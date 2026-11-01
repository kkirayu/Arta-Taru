<?php

namespace Database\Factories;

use App\Models\ProductVariant;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductVariantFactory extends Factory
{
    protected $model = ProductVariant::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'name' => fake()->randomElement(['Small', 'Medium', 'Large', 'XL', 'XXL']),
            'sku' => 'VAR-' . fake()->unique()->numerify('######'),
            'size' => fake()->randomElement(['S', 'M', 'L', 'XL', 'XXL']),
            'color' => fake()->safeColorName(),
            'price' => fake()->optional(0.5)->numberBetween(50000, 500000),
            'stock' => fake()->numberBetween(0, 50),
            'is_active' => true,
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}