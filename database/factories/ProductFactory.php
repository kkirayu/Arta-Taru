<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'brand_id' => Brand::factory(),
            'name' => fake()->unique()->words(3, true),
            'slug' => fake()->unique()->slug(),
            'sku' => 'SKU-' . fake()->unique()->numerify('######'),
            'short_description' => fake()->optional()->sentence(),
            'description' => fake()->optional()->paragraphs(3, true),
            'price' => fake()->numberBetween(50000, 500000),
            'sale_price' => fake()->optional(0.3)->numberBetween(30000, 450000),
            'stock' => fake()->numberBetween(0, 100),
            'low_stock_threshold' => 5,
            'stock_status' => 'available',
            'weight' => fake()->numberBetween(100, 2000),
            'length' => fake()->optional()->numberBetween(10, 100),
            'width' => fake()->optional()->numberBetween(10, 100),
            'height' => fake()->optional()->numberBetween(10, 100),
            'seo_title' => null,
            'meta_description' => null,
            'canonical_url' => null,
            'is_featured' => fake()->boolean(20),
            'is_active' => true,
            'published_at' => now(),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
            'published_at' => null,
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
            'stock_status' => 'out_of_stock',
        ]);
    }

    public function onSale(): static
    {
        return $this->state(fn (array $attributes) => [
            'sale_price' => fake()->numberBetween(30000, 450000),
        ]);
    }
}