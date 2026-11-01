<?php

namespace App\Services;

use App\Exceptions\InsufficientStockException;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class StockService
{
    /**
     * Deduct stock for a freshly created order and record the reservation.
     * Must run inside a database transaction.
     */
    public function reserve(Order $order): void
    {
        foreach ($order->items as $item) {
            $product = Product::query()->lockForUpdate()->find($item->product_id);

            if (! $product) {
                continue;
            }

            $variant = $item->product_variant_id
                ? ProductVariant::query()->lockForUpdate()->find($item->product_variant_id)
                : null;

            $this->applyDelta(
                product: $product,
                variant: $variant,
                delta: -1 * (int) $item->quantity,
                type: StockMovement::TYPE_RESERVATION,
                note: 'Reservasi order '.$order->order_number,
                reference: $order,
                userId: $order->user_id,
            );
        }
    }

    /**
     * Return reserved stock to inventory. Idempotent per order.
     */
    public function release(Order $order): void
    {
        $alreadyReleased = StockMovement::query()
            ->where('reference_type', Order::class)
            ->where('reference_id', $order->id)
            ->where('type', StockMovement::TYPE_RELEASE)
            ->exists();

        if ($alreadyReleased) {
            return;
        }

        foreach ($order->items as $item) {
            $product = Product::query()->lockForUpdate()->find($item->product_id);

            if (! $product) {
                continue;
            }

            $variant = $item->product_variant_id
                ? ProductVariant::query()->lockForUpdate()->find($item->product_variant_id)
                : null;

            $this->applyDelta(
                product: $product,
                variant: $variant,
                delta: (int) $item->quantity,
                type: StockMovement::TYPE_RELEASE,
                note: 'Pelepasan stok order '.$order->order_number,
                reference: $order,
                userId: null,
            );
        }
    }

    /**
     * Set stock to an absolute value (manual adjustment from the admin area).
     */
    public function adjust(Product $product, ?ProductVariant $variant, int $newStock, ?User $user = null, ?string $note = null): void
    {
        $newStock = max(0, $newStock);

        if ($variant) {
            $variant = ProductVariant::query()->lockForUpdate()->findOrFail($variant->id);
            $delta = $newStock - (int) $variant->stock;
        } else {
            $product = Product::query()->lockForUpdate()->findOrFail($product->id);
            $delta = $newStock - (int) $product->stock;
        }

        if ($delta === 0) {
            return;
        }

        $this->applyDelta(
            product: $product,
            variant: $variant,
            delta: $delta,
            type: StockMovement::TYPE_ADJUSTMENT,
            note: $note ?: 'Penyesuaian stok manual',
            reference: null,
            userId: $user?->id,
        );
    }

    /**
     * Apply a signed stock delta, keeping the product aggregate and status in sync.
     */
    private function applyDelta(
        Product $product,
        ?ProductVariant $variant,
        int $delta,
        string $type,
        ?string $note = null,
        ?Model $reference = null,
        ?int $userId = null,
    ): void {
        if ($variant) {
            $current = (int) $variant->stock;
            $newStock = $current + $delta;

            if ($newStock < 0) {
                throw new InsufficientStockException($product->name, $current);
            }

            $variant->stock = $newStock;
            $variant->save();

            $aggregate = (int) ProductVariant::query()
                ->where('product_id', $product->id)
                ->sum('stock');

            $product->stock = $aggregate;
            $stockAfter = $newStock;
        } else {
            $current = (int) $product->stock;
            $newStock = $current + $delta;

            if ($newStock < 0) {
                throw new InsufficientStockException($product->name, $current);
            }

            $product->stock = $newStock;
            $stockAfter = $newStock;
        }

        $product->syncStockStatus();
        $product->save();

        StockMovement::create([
            'product_id' => $product->id,
            'product_variant_id' => $variant?->id,
            'type' => $type,
            'quantity' => $delta,
            'stock_after' => $stockAfter,
            'reference_type' => $reference ? get_class($reference) : null,
            'reference_id' => $reference?->getKey(),
            'note' => $note,
            'user_id' => $userId,
        ]);
    }
}
