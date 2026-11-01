<?php

namespace Database\Factories;

use App\Models\CartItem;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartItemFactory extends Factory
{
    protected $model = CartItem::class;

    public function definition(): array
    {
        $product = Product::factory()->create(['price' => fake()->numberBetween(50000, 500000)]);

        return [
            'cart_id' => Cart::factory(),
            'product_id' => $product->id,
            'product_variant_id' => null,
            'quantity' => fake()->numberBetween(1, 5),
            'price' => $product->price,
        ];
    }

    public function withVariant(ProductVariant $variant): static
    {
        return $this->state(fn (array $attributes) => [
            'product_variant_id' => $variant->id,
            'price' => $variant->price ?? $variant->product->price,
        ]);
    }
}