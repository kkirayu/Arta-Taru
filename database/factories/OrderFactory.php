<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $orderNumber = 'ORD-' . now()->format('Ymd') . '-' . strtoupper(fake()->unique()->lexify('????'));

        return [
            'order_number' => $orderNumber,
            'user_id' => null,
            'guest_token' => null,
            'customer_name' => fake()->name(),
            'customer_email' => fake()->unique()->safeEmail(),
            'customer_phone' => '08' . fake()->numerify('##########'),
            'status' => 'pending_payment',
            'payment_status' => 'unpaid',
            'payment_method' => 'bank_transfer',
            'subtotal' => 0,
            'discount_total' => 0,
            'shipping_total' => 0,
            'unique_code' => fake()->numberBetween(100, 999),
            'grand_total' => 0,
            'shipping_method' => 'delivery',
            'shipping_courier' => null,
            'tracking_number' => null,
            'notes' => null,
            'admin_notes' => null,
            'expires_at' => now()->addHours(24),
        ];
    }

    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
            'guest_token' => null,
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => $user->phone ?? '081234567890',
        ]);
    }

    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
            'guest_token' => \Illuminate\Support\Str::random(40),
        ]);
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'processing',
            'payment_status' => 'paid',
            'paid_at' => now(),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'payment_status' => 'paid',
            'paid_at' => now()->subDays(2),
            'completed_at' => now(),
        ]);
    }
}