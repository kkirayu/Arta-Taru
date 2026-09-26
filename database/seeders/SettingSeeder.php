<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'store_name', 'value' => 'Toko Arta Taru'],
            ['key' => 'store_phone', 'value' => '0888-2869-727'],
            ['key' => 'whatsapp_number', 'value' => '628882869727'],
            ['key' => 'store_address', 'value' => 'Jl. Malioboro No. 45, Yogyakarta, Daerah Istimewa Yogyakarta 55271'],
            ['key' => 'store_hours', 'value' => 'Senin - Sabtu: 08:00 - 21:00 WIB | Minggu: 09:00 - 17:00 WIB'],
            ['key' => 'instagram_url', 'value' => 'https://instagram.com/artataru'],
            ['key' => 'facebook_url', 'value' => 'https://facebook.com/artataru'],
            ['key' => 'youtube_url', 'value' => ''],
            ['key' => 'default_og_image', 'value' => ''],
            ['key' => 'inquiry_template', 'value' => "Halo Toko Arta Taru,\n\nSaya ingin menanyakan produk:\n\nNama: {product_name}\nSKU: {sku}\nHarga: {price}\n\nApakah produk tersebut masih tersedia?\n\nTerima kasih."],
            ['key' => 'site_title', 'value' => 'Toko Arta Taru - Peralatan & Perlengkapan Lengkap Yogyakarta'],
            ['key' => 'site_description', 'value' => 'Toko Arta Taru Yogyakarta menyediakan peralatan komunikasi, alat otomotif, peralatan teknikal, dan pakaian tactical berkualitas.'],
        ];

        foreach ($settings as $setting) {
            SystemSetting::set($setting['key'], $setting['value']);
        }
    }
}
