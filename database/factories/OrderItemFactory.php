<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition(): array
    {
        $product = Product::factory()->create(['price' => fake()->numberBetween(50000, 500000)]);

        return [
            'order_id' => Order::factory(),
            'product_id' => $product->id,
            'variant_id' => null,
            'product_name' => $product->name,
            'variant_label' => null,
            'sku' => $product->sku,
            'quantity' => fake()->numberBetween(1, 3),
            'price' => $product->price,
            'subtotal' => 0, // will be calculated
        ];
    }

    public function withVariant(ProductVariant $variant): static
    {
        return $this->state(fn (array $attributes) => [
            'variant_id' => $variant->id,
            'product_name' => $variant->product->name,
            'variant_label' => $variant->label,
            'sku' => $variant->sku,
            'price' => $variant->price ?? $variant->product->price,
        ]);
    }

    public function configure(): static
    {
        return $this->afterMaking(function (OrderItem $item) {
            $item->subtotal = $item->quantity * $item->price;
        });
    }
}