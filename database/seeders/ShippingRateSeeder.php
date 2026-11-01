<?php

namespace Database\Seeders;

use App\Models\ShippingRate;
use Illuminate\Database\Seeder;

class ShippingRateSeeder extends Seeder
{
    public function run(): void
    {
        $rates = [
            ['province' => 'DI Yogyakarta', 'city' => 'Kota Yogyakarta', 'cost' => 8000, 'eta_min_days' => 1, 'eta_max_days' => 2],
            ['province' => 'DI Yogyakarta', 'city' => 'Sleman', 'cost' => 10000, 'eta_min_days' => 1, 'eta_max_days' => 2],
            ['province' => 'DI Yogyakarta', 'city' => 'Bantul', 'cost' => 10000, 'eta_min_days' => 1, 'eta_max_days' => 2],
            ['province' => 'DI Yogyakarta', 'city' => 'Kulon Progo', 'cost' => 12000, 'eta_min_days' => 1, 'eta_max_days' => 2],
            ['province' => 'DI Yogyakarta', 'city' => 'Gunungkidul', 'cost' => 12000, 'eta_min_days' => 1, 'eta_max_days' => 3],
            ['province' => 'Jawa Tengah', 'city' => 'Semarang', 'cost' => 18000, 'eta_min_days' => 2, 'eta_max_days' => 3],
            ['province' => 'Jawa Tengah', 'city' => 'Surakarta', 'cost' => 15000, 'eta_min_days' => 1, 'eta_max_days' => 3],
            ['province' => 'Jawa Barat', 'city' => 'Bandung', 'cost' => 22000, 'eta_min_days' => 2, 'eta_max_days' => 4],
            ['province' => 'DKI Jakarta', 'city' => 'Jakarta Selatan', 'cost' => 25000, 'eta_min_days' => 2, 'eta_max_days' => 4],
            ['province' => 'DKI Jakarta', 'city' => 'Jakarta Pusat', 'cost' => 25000, 'eta_min_days' => 2, 'eta_max_days' => 4],
            ['province' => 'Jawa Timur', 'city' => 'Surabaya', 'cost' => 25000, 'eta_min_days' => 2, 'eta_max_days' => 4],
            ['province' => 'Bali', 'city' => 'Denpasar', 'cost' => 30000, 'eta_min_days' => 3, 'eta_max_days' => 5],
            // Province-wide fallback when a city is not listed.
            ['province' => 'DI Yogyakarta', 'city' => null, 'cost' => 15000, 'eta_min_days' => 1, 'eta_max_days' => 3],
            ['province' => 'Jawa Tengah', 'city' => null, 'cost' => 20000, 'eta_min_days' => 2, 'eta_max_days' => 4],
            ['province' => 'Jawa Barat', 'city' => null, 'cost' => 25000, 'eta_min_days' => 2, 'eta_max_days' => 4],
            ['province' => 'DKI Jakarta', 'city' => null, 'cost' => 28000, 'eta_min_days' => 2, 'eta_max_days' => 4],
            ['province' => 'Jawa Timur', 'city' => null, 'cost' => 28000, 'eta_min_days' => 3, 'eta_max_days' => 5],
            ['province' => 'Bali', 'city' => null, 'cost' => 35000, 'eta_min_days' => 3, 'eta_max_days' => 6],
        ];

        foreach ($rates as $index => $rate) {
            ShippingRate::firstOrCreate(
                ['province' => $rate['province'], 'city' => $rate['city']],
                [
                    'cost' => $rate['cost'],
                    'eta_min_days' => $rate['eta_min_days'],
                    'eta_max_days' => $rate['eta_max_days'],
                    'is_active' => true,
                    'sort_order' => $index,
                ],
            );
        }
    }
}
