<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            ['name' => 'Baofeng', 'description' => 'Two-way radio brand'],
            ['name' => 'Tekiro', 'description' => 'Hand tools brand'],
            ['name' => 'Bosch', 'description' => 'Power tools brand'],
            ['name' => 'Safety First', 'description' => 'Safety equipment brand'],
            ['name' => 'Toyota Parts', 'description' => 'Auto parts brand'],
            ['name' => 'Nike', 'description' => 'Clothing brand'],
            ['name' => 'Adidas', 'description' => 'Clothing brand'],
        ];

        foreach ($brands as $brand) {
            Brand::create([
                'name' => $brand['name'],
                'slug' => Str::slug($brand['name']),
                'description' => $brand['description'],
                'is_active' => true,
            ]);
        }
    }
}
