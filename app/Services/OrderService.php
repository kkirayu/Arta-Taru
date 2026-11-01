<?php

namespace App\Services;

use App\Exceptions\CheckoutException;
use App\Mail\OrderUpdateMail;
use App\Models\Cart;
use App\Models\DailyStat;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Payment;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use App\Notifications\NewPaymentNotification;
use App\Support\DbRetry;
use App\Support\StoreSettings;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(
        private readonly StockService $stock,
        private readonly ShippingRateResolver $shipping,
        private readonly OrderNumberGenerator $numbers,
    ) {}

    /**
     * Convert a cart into a pending-payment order and reserve its stock.
     *
     * @param  array<string, mixed>  $data
     */
    public function createFromCart(Cart $cart, array $data, ?User $user = null): Order
    {
        $cart->load(['items.product', 'items.variant']);

        if ($cart->items->isEmpty()) {
            throw CheckoutException::emptyCart();
        }

        $order = DbRetry::transaction(function () use ($cart, $data, $user) {
            $subtotal = 0.0;
            $lines = [];

            foreach ($cart->items as $item) {
                $product = $item->product;

                if (! $product || $product->trashed() || ! $product->is_active) {
                    throw CheckoutException::invalidItem($item->product?->name ?? 'yang dipilih');
                }

                $available = $item->product_variant_id
                    ? (int) ($item->variant?->stock ?? 0)
                    : (int) $product->stock;

                if ($available < $item->quantity) {
                    throw CheckoutException::invalidItem($product->name.' (stok tersisa '.$available.')');
                }

                $lineTotal = (float) $item->price * $item->quantity;
                $subtotal += $lineTotal;

                $lines[] = [
                    'product_id' => $product->id,
                    'product_variant_id' => $item->product_variant_id,
                    'product_name' => $product->name,
                    'sku' => $item->variant?->sku ?? $product->sku,
                    'variant_label' => $item->variant?->label,
                    'price' => (float) $item->price,
                    'quantity' => (int) $item->quantity,
                    'subtotal' => $lineTotal,
                    'weight' => $product->weight,
                ];
            }

            $isPickup = ($data['shipping_method'] ?? 'delivery') === 'pickup';
            $shippingCost = 0.0;
            $shippingLabel = 'Ambil di toko';

            if (! $isPickup) {
                $rate = $this->shipping->resolve($data['province'] ?? null, $data['city'] ?? null);

                if (! $rate) {
                    throw CheckoutException::shippingUnavailable();
                }

                $shippingCost = $this->shipping->costFor($rate, $subtotal);
                $shippingLabel = 'Kirim - '.$rate->area_label;
            }

            $uniqueCode = 0.0;
            if (StoreSettings::uniqueCodeEnabled() && ! $isPickup) {
                $uniqueCode = (float) random_int(1, 999);
            }

            $grandTotal = round($subtotal + $shippingCost + $uniqueCode, 2);
            $orderNumber = $this->numbers->next();

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user?->id,
                'guest_token' => $user ? null : Str::random(48),
                'customer_name' => $data['name'],
                'customer_email' => $data['email'],
                'customer_phone' => $data['phone'],
                'status' => Order::STATUS_PENDING_PAYMENT,
                'payment_status' => Order::PAYMENT_UNPAID,
                'payment_method' => 'bank_transfer',
                'subtotal' => $subtotal,
                'discount_total' => 0,
                'shipping_total' => $shippingCost,
                'unique_code' => $uniqueCode,
                'grand_total' => $grandTotal,
                'shipping_method' => $isPickup ? 'pickup' : 'delivery',
                'shipping_courier' => $data['shipping_courier'] ?? null,
                'notes' => $data['notes'] ?? null,
                'expires_at' => now()->addHours(StoreSettings::paymentExpiryHours()),
            ]);

            foreach ($lines as $line) {
                $order->items()->create($line);
            }

            $order->address()->create([
                'recipient_name' => $data['name'],
                'phone' => $data['phone'],
                'address_line' => $isPickup ? 'Ambil di toko' : $data['address_line'],
                'province' => $isPickup ? '-' : $data['province'],
                'city' => $isPickup ? '-' : $data['city'],
                'district' => $isPickup ? null : ($data['district'] ?? null),
                'postal_code' => $isPickup ? null : ($data['postal_code'] ?? null),
                'notes' => $data['notes'] ?? null,
            ]);

            $this->stock->reserve($order);
            $cart->items()->delete();

            $this->history($order, null, Order::STATUS_PENDING_PAYMENT, 'Order dibuat');
            DailyStat::bump(now(), 'checkouts');

            return $order->fresh(['items', 'address']);
        });

        $this->notifyNewOrder($order);
        $this->sendCustomerMail($order, 'placed');

        return $order;
    }

    public function attachPaymentProof(Order $order, UploadedFile $file, ?string $bankName = null): Payment
    {
        if ($order->isFinal()) {
            throw new CheckoutException('Order ini sudah selesai dan tidak bisa diubah.');
        }

        $path = $file->store(
            'payment-proofs/'.$order->order_number,
            config('filesystems.proof_disk', 'local'),
        );

        $payment = DbRetry::transaction(function () use ($order, $path, $bankName) {
            $payment = $order->payments()->create([
                'method' => 'bank_transfer',
                'bank_name' => $bankName,
                'amount' => $order->grand_total,
                'proof_path' => $path,
                'status' => Payment::STATUS_PENDING,
            ]);

            $from = $order->status;
            $order->update([
                'status' => Order::STATUS_WAITING_CONFIRMATION,
                'payment_status' => Order::PAYMENT_WAITING,
            ]);

            $this->history($order, $from, Order::STATUS_WAITING_CONFIRMATION, 'Bukti transfer diunggah');

            return $payment;
        });

        $this->notifyAdmins(new NewPaymentNotification($order->fresh()));

        return $payment;
    }

    public function verifyPayment(Payment $payment, User $admin): void
    {
        DbRetry::transaction(function () use ($payment, $admin) {
            $payment->update([
                'status' => Payment::STATUS_VERIFIED,
                'verified_by' => $admin->id,
                'verified_at' => now(),
                'rejection_reason' => null,
            ]);

            $order = $payment->order;
            $from = $order->status;

            $order->update([
                'payment_status' => Order::PAYMENT_PAID,
                'status' => Order::STATUS_PROCESSING,
                'paid_at' => $order->paid_at ?? now(),
            ]);

            $this->history($order, $from, Order::STATUS_PROCESSING, 'Pembayaran diverifikasi');

            DailyStat::bump(now(), 'revenue', (int) $order->grand_total);
            DailyStat::bump(now(), 'paid_orders_count');
            DailyStat::bump(now(), 'items_sold', (int) $order->items()->sum('quantity'));
        });

        $this->sendCustomerMail($payment->order->fresh(), 'paid');
    }

    public function rejectPayment(Payment $payment, User $admin, string $reason): void
    {
        DbRetry::transaction(function () use ($payment, $admin, $reason) {
            $payment->update([
                'status' => Payment::STATUS_REJECTED,
                'verified_by' => $admin->id,
                'verified_at' => now(),
                'rejection_reason' => $reason,
            ]);

            $order = $payment->order;
            $from = $order->status;

            $order->update([
                'payment_status' => Order::PAYMENT_REJECTED,
                'status' => Order::STATUS_PENDING_PAYMENT,
            ]);

            $this->history($order, $from, Order::STATUS_PENDING_PAYMENT, 'Bukti transfer ditolak: '.$reason);
        });

        $this->sendCustomerMail($payment->order->fresh(), 'rejected');
    }

    /**
     * @param  array{courier?: string, tracking_number?: string, note?: string}  $data
     */
    public function ship(Order $order, array $data, ?User $actor = null): void
    {
        DbRetry::transaction(function () use ($order, $data, $actor) {
            $from = $order->status;

            $order->update([
                'status' => Order::STATUS_SHIPPED,
                'shipping_courier' => $data['courier'] ?? $order->shipping_courier,
                'tracking_number' => $data['tracking_number'] ?? $order->tracking_number,
                'shipped_at' => now(),
            ]);

            $this->history($order, $from, Order::STATUS_SHIPPED, $data['note'] ?? 'Pesanan dikirim', $actor);
        });

        $this->sendCustomerMail($order->fresh(), 'shipped');
    }

    public function complete(Order $order, ?User $actor = null): void
    {
        DbRetry::transaction(function () use ($order, $actor) {
            $from = $order->status;

            $order->update([
                'status' => Order::STATUS_COMPLETED,
                'completed_at' => now(),
            ]);

            $this->history($order, $from, Order::STATUS_COMPLETED, 'Pesanan selesai', $actor);
        });

        $this->sendCustomerMail($order->fresh(), 'completed');
    }

    public function cancel(Order $order, ?string $reason = null, ?User $actor = null): void
    {
        if ($order->isFinal()) {
            return;
        }

        DbRetry::transaction(function () use ($order, $reason, $actor) {
            $from = $order->status;

            $this->stock->release($order);

            $order->update([
                'status' => Order::STATUS_CANCELLED,
                'cancelled_at' => now(),
            ]);

            $this->history($order, $from, Order::STATUS_CANCELLED, $reason ?: 'Pesanan dibatalkan', $actor);
        });

        $this->sendCustomerMail($order->fresh(), 'cancelled');
    }

    public function expire(Order $order): void
    {
        if ($order->status !== Order::STATUS_PENDING_PAYMENT) {
            return;
        }

        DbRetry::transaction(function () use ($order) {
            $from = $order->status;

            $this->stock->release($order);

            $order->update([
                'status' => Order::STATUS_EXPIRED,
                'cancelled_at' => now(),
            ]);

            $this->history($order, $from, Order::STATUS_EXPIRED, 'Batas waktu pembayaran habis');
        });
    }

    /**
     * Lazily expire overdue orders. Safe to call on every request.
     */
    public function expireStale(int $limit = 50): int
    {
        $orders = Order::query()
            ->where('status', Order::STATUS_PENDING_PAYMENT)
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->limit($limit)
            ->get();

        $count = 0;
        foreach ($orders as $order) {
            $this->expire($order);
            $count++;
        }

        return $count;
    }

    /**
     * Auto-complete delivered orders after the configured grace period.
     */
    public function autoComplete(int $limit = 50): int
    {
        $cutoff = now()->subDays(StoreSettings::autoCompleteDays());

        $orders = Order::query()
            ->where('status', Order::STATUS_SHIPPED)
            ->whereNotNull('shipped_at')
            ->where('shipped_at', '<=', $cutoff)
            ->limit($limit)
            ->get();

        foreach ($orders as $order) {
            $this->complete($order);
        }

        return $orders->count();
    }

    /**
     * Lazily expire a single order when it is opened.
     */
    public function expireIfNeeded(Order $order): Order
    {
        if ($order->isExpired()) {
            $this->expire($order);
            $order->refresh();
        }

        return $order;
    }

    private function history(Order $order, ?string $from, string $to, ?string $note = null, ?User $actor = null): void
    {
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'from_status' => $from,
            'to_status' => $to,
            'note' => $note,
            'changed_by' => $actor?->id,
        ]);
    }

    private function notifyNewOrder(Order $order): void
    {
        $this->notifyAdmins(new NewOrderNotification($order));
    }

    private function notifyAdmins($notification): void
    {
        try {
            $admins = User::query()
                ->whereIn('role', ['super_admin', 'admin', 'staff'])
                ->where('is_active', true)
                ->get();

            if ($admins->isNotEmpty()) {
                Notification::send($admins, $notification);
            }
        } catch (\Throwable $e) {
            Log::warning('Failed to notify admins: '.$e->getMessage());
        }
    }

    private function sendCustomerMail(Order $order, string $stage): void
    {
        try {
            Mail::to($order->customer_email)->send(new OrderUpdateMail($order, $stage));
        } catch (\Throwable $e) {
            // Mail must never break a checkout or an admin action.
            Log::warning('Failed to send order mail: '.$e->getMessage());
        }
    }

    public function proofUrl(Payment $payment): ?string
    {
        if (! $payment->proof_path) {
            return null;
        }

        return Storage::disk(config('filesystems.proof_disk', 'local'))->exists($payment->proof_path)
            ? $payment->proof_path
            : null;
    }

    public function deleteProof(Payment $payment): void
    {
        if ($payment->proof_path) {
            Storage::disk(config('filesystems.proof_disk', 'local'))->delete($payment->proof_path);
        }
    }

    public function generateGuestToken(): string
    {
        return Str::random(48);
    }

    public function statsForRange($start, $end): array
    {
        $row = DB::table('orders')
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('COUNT(*) as orders_count')
            ->selectRaw('SUM(CASE WHEN payment_status = ? THEN grand_total ELSE 0 END) as revenue', [Order::PAYMENT_PAID])
            ->first();

        return [
            'orders_count' => (int) ($row->orders_count ?? 0),
            'revenue' => (float) ($row->revenue ?? 0),
        ];
    }
}
