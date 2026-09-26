<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        Banner::create([
            'title' => 'Toko Arta Taru - Peralatan Lengkap',
            'subtitle' => 'HT, Tools, Safety & Pakaian Tactical',
            'cta_label' => 'Lihat Katalog',
            'cta_url' => '/katalog',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Banner::create([
            'title' => 'Promo Spesial Bulan Ini',
            'subtitle' => 'Diskon hingga 30% untuk produk tertentu',
            'cta_label' => 'Belanja Sekarang',
            'cta_url' => '/katalog?sort=price_asc',
            'sort_order' => 2,
            'is_active' => true,
        ]);
    }
}
