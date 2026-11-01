<?php

namespace Database\Factories;

use App\Models\OrderAddress;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderAddressFactory extends Factory
{
    protected $model = OrderAddress::class;

    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'recipient_name' => fake()->name(),
            'phone' => '08' . fake()->numerify('##########'),
            'address_line' => fake()->streetAddress(),
            'city' => fake()->city(),
            'province' => fake()->state(),
            'postal_code' => fake()->postcode(),
            'full_address' => null,
            'label' => 'Alamat Pengiriman',
        ];
    }
}