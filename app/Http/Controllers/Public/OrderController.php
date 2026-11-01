<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentProofRequest;
use App\Models\Order;
use App\Services\OrderService;
use App\Support\StoreSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orders) {}

    public function success(Request $request, Order $order): Response
    {
        $this->authorizeAccess($request, $order);
        $this->orders->expireIfNeeded($order);

        $order->load(['items', 'address', 'payments' => fn ($q) => $q->latest()]);

        return Inertia::render('Order/Success', [
            'order' => $order,
            'bank_accounts' => StoreSettings::bankAccounts(),
            'whatsapp_number' => StoreSettings::whatsappNumber(),
            'guest_token' => $order->guest_token,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        $this->authorizeAccess($request, $order);
        $this->orders->expireIfNeeded($order);

        $order->load([
            'items.product',
            'address',
            'payments' => fn ($q) => $q->latest(),
            'statusHistories',
        ]);

        return Inertia::render('Order/Show', [
            'order' => $order,
            'bank_accounts' => StoreSettings::bankAccounts(),
            'whatsapp_number' => StoreSettings::whatsappNumber(),
            'guest_token' => $order->guest_token,
            'can_upload_proof' => in_array($order->status, [Order::STATUS_PENDING_PAYMENT, Order::STATUS_WAITING_CONFIRMATION], true),
        ]);
    }

    public function uploadProof(StorePaymentProofRequest $request, Order $order)
    {
        $this->authorizeAccess($request, $order);

        if (! in_array($order->status, [Order::STATUS_PENDING_PAYMENT, Order::STATUS_WAITING_CONFIRMATION], true)) {
            return back()->with('error', 'Pesanan ini tidak lagi menerima bukti transfer.');
        }

        try {
            $this->orders->attachPaymentProof($order, $request->file('proof'), $request->input('bank_name'));
        } catch (\Throwable $e) {
            report($e);

            return back()->with('error', 'Bukti transfer gagal diunggah. Silakan coba lagi.');
        }

        return back()->with('success', 'Bukti transfer berhasil diunggah. Menunggu verifikasi admin.');
    }

    public function trackForm(Request $request): Response
    {
        return Inertia::render('Order/Track', [
            'order_number' => $request->query('order'),
            'email' => $request->query('email'),
        ]);
    }

    public function track(Request $request)
    {
        $validated = $request->validate([
            'order_number' => ['required', 'string', 'max:32'],
            'contact' => ['required', 'string', 'max:255'],
        ]);

        $order = Order::query()
            ->where('order_number', strtoupper(trim($validated['order_number'])))
            ->where(function ($query) use ($validated) {
                $query->where('customer_email', $validated['contact'])
                    ->orWhere('customer_phone', $validated['contact']);
            })
            ->first();

        if (! $order) {
            return back()->withErrors(['order_number' => 'Pesanan tidak ditemukan. Periksa nomor pesanan dan email/WhatsApp Anda.']);
        }

        $request->session()->put('order_access.'.$order->id, true);

        return redirect()->route('order.show', [
            'order' => $order->order_number,
            'token' => $order->guest_token,
        ]);
    }

    public function invoice(Request $request, Order $order)
    {
        $this->authorizeAccess($request, $order);
        $order->load(['items', 'address', 'payments' => fn ($q) => $q->latest()]);

        return response()
            ->view('invoice.order', [
                'order' => $order,
                'storeName' => StoreSettings::storeName(),
                'storeAddress' => StoreSettings::get('store_address', ''),
                'storePhone' => StoreSettings::get('store_phone', ''),
            ]);
    }

    private function authorizeAccess(Request $request, Order $order): void
    {
        $user = Auth::guard('customer')->user();

        if ($user && $order->user_id === $user->id) {
            return;
        }

        $token = $request->query('token');

        if ($token && hash_equals((string) $order->guest_token, (string) $token)) {
            $request->session()->put('order_access.'.$order->id, true);

            return;
        }

        if ($request->session()->get('order_access.'.$order->id)) {
            return;
        }

        abort(404);
    }
}
