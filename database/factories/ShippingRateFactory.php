<?php

namespace Database\Factories;

use App\Models\ShippingRate;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShippingRateFactory extends Factory
{
    protected $model = ShippingRate::class;

    public function definition(): array
    {
        return [
            'province' => fake()->state(),
            'city' => fake()->optional()->city(),
            'district' => null,
            'cost' => fake()->numberBetween(10000, 50000),
            'free_shipping_min_total' => fake()->optional(0.3)->numberBetween(200000, 1000000),
            'eta_min_days' => fake()->numberBetween(1, 3),
            'eta_max_days' => fake()->numberBetween(3, 7),
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