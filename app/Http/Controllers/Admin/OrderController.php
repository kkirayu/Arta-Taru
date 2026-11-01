<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Services\OrderService;
use App\Support\StoreSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orders) {}

    public function index(Request $request): Response
    {
        $this->orders->expireStale(50);

        $query = Order::query()->withCount('items');

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($paymentStatus = $request->input('payment_status')) {
            $query->where('payment_status', $paymentStatus);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_email', 'like', "%{$search}%")
                    ->orWhere('customer_phone', 'like', "%{$search}%");
            });
        }

        if ($from = $request->input('from')) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to = $request->input('to')) {
            $query->whereDate('created_at', '<=', $to);
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        $counts = Order::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'statuses' => Order::STATUSES,
            'payment_statuses' => Order::PAYMENT_STATUSES,
            'counts' => $counts,
            'filters' => $request->only(['status', 'payment_status', 'search', 'from', 'to']),
            'pending_payments' => Payment::where('status', Payment::STATUS_PENDING)->count(),
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        $this->orders->expireIfNeeded($order);

        $order->load([
            'items.product.primaryImage',
            'address',
            'payments' => fn ($q) => $q->latest(),
            'payments.verifier',
            'statusHistories.user',
            'user',
        ]);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'statuses' => Order::STATUSES,
            'payment_statuses' => Order::PAYMENT_STATUSES,
            'bank_accounts' => StoreSettings::bankAccounts(),
        ]);
    }

    public function ship(Request $request, Order $order)
    {
        $validated = $request->validate([
            'courier' => ['required', 'string', 'max:64'],
            'tracking_number' => ['required', 'string', 'max:128'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        if ($order->status !== Order::STATUS_PROCESSING) {
            return back()->with('error', 'Pesanan harus berstatus Diproses sebelum dikirim.');
        }

        $this->orders->ship($order, $validated, Auth::user());

        return back()->with('success', 'Pesanan ditandai sebagai dikirim.');
    }

    public function complete(Order $order)
    {
        if ($order->status !== Order::STATUS_SHIPPED) {
            return back()->with('error', 'Hanya pesanan yang sudah dikirim yang bisa diselesaikan.');
        }

        $this->orders->complete($order, Auth::user());

        return back()->with('success', 'Pesanan selesai.');
    }

    public function cancel(Request $request, Order $order)
    {
        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        if ($order->isFinal()) {
            return back()->with('error', 'Pesanan ini sudah final.');
        }

        $this->orders->cancel($order, $validated['reason'] ?? null, Auth::user());

        return back()->with('success', 'Pesanan dibatalkan dan stok dikembalikan.');
    }

    public function verifyPayment(Request $request, Order $order, Payment $payment)
    {
        abort_unless($payment->order_id === $order->id, 404);

        $this->orders->verifyPayment($payment, Auth::user());

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Pembayaran diverifikasi.',
                'payment' => $payment->fresh(),
                'order' => $order->fresh(),
            ]);
        }

        return back()->with('success', 'Pembayaran diverifikasi.');
    }

    public function rejectPayment(Request $request, Order $order, Payment $payment)
    {
        abort_unless($payment->order_id === $order->id, 404);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $this->orders->rejectPayment($payment, Auth::user(), $validated['reason']);

        return back()->with('success', 'Bukti transfer ditolak.');
    }

    public function proof(Order $order, Payment $payment)
    {
        abort_unless($payment->order_id === $order->id, 404);
        abort_unless($payment->proof_path, 404);

        $disk = Storage::disk(config('filesystems.proof_disk', 'local'));

        abort_unless($disk->exists($payment->proof_path), 404);

        return $disk->response($payment->proof_path);
    }

    public function invoice(Order $order)
    {
        $order->load(['items', 'address', 'payments' => fn ($q) => $q->latest()]);

        return response()->view('invoice.order', [
            'order' => $order,
            'storeName' => StoreSettings::storeName(),
            'storeAddress' => StoreSettings::get('store_address', ''),
            'storePhone' => StoreSettings::get('store_phone', ''),
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $query = Order::query()->withCount('items');

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($from = $request->input('from')) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to = $request->input('to')) {
            $query->whereDate('created_at', '<=', $to);
        }

        $filename = 'orders-'.now()->format('Ymd-His').'.csv';

        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'Nomor Order', 'Tanggal', 'Nama', 'Email', 'Telepon', 'Status',
                'Pembayaran', 'Subtotal', 'Ongkir', 'Kode Unik', 'Total', 'Jumlah Item',
            ]);

            $query->orderByDesc('created_at')->chunk(500, function ($orders) use ($handle) {
                foreach ($orders as $order) {
                    fputcsv($handle, [
                        $order->order_number,
                        $order->created_at?->format('Y-m-d H:i'),
                        $order->customer_name,
                        $order->customer_email,
                        $order->customer_phone,
                        $order->status_label,
                        $order->payment_status_label,
                        $order->subtotal,
                        $order->shipping_total,
                        $order->unique_code,
                        $order->grand_total,
                        $order->items_count,
                    ]);
                }
            });

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }
}
