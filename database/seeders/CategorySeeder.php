<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Pakaian' => [
                'Kaos', 'Jaket', 'Celana', 'Seragam', 'Aksesoris',
            ],
            'Alat Komunikasi' => [
                'HT', 'Radio', 'Antena', 'Battery', 'Charger', 'Aksesoris Komunikasi',
            ],
            'Alat Otomotif' => [
                'Hand Tools Otomotif', 'Sparepart', 'Electrical Otomotif', 'Safety', 'Aksesoris Otomotif',
            ],
            'Peralatan Teknikal' => [
                'Hand Tools Teknikal', 'Power Tools', 'Measuring Tools', 'Electrical Tools', 'Workshop Equipment',
            ],
        ];

        $sort = 0;
        foreach ($categories as $name => $children) {
            $parent = Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'sort_order' => $sort++,
                'is_active' => true,
            ]);

            $childSort = 0;
            foreach ($children as $childName) {
                Category::create([
                    'parent_id' => $parent->id,
                    'name' => $childName,
                    'slug' => Str::slug($childName),
                    'sort_order' => $childSort++,
                    'is_active' => true,
                ]);
            }
        }
    }
}
