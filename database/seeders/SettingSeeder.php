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

            // Commerce
            ['key' => 'bank_accounts', 'value' => json_encode([
                ['bank' => 'BCA', 'account_number' => '1234567890', 'account_name' => 'Toko Arta Taru'],
                ['bank' => 'Mandiri', 'account_number' => '9876543210', 'account_name' => 'Toko Arta Taru'],
            ]), 'type' => 'json', 'group' => 'payment'],
            ['key' => 'payment_expiry_hours', 'value' => '24', 'type' => 'number', 'group' => 'payment'],
            ['key' => 'unique_code_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'payment'],
            ['key' => 'order_auto_complete_days', 'value' => '7', 'type' => 'number', 'group' => 'order'],
            ['key' => 'free_shipping_min_total', 'value' => '500000', 'type' => 'number', 'group' => 'shipping'],
            ['key' => 'return_policy', 'value' => 'Produk dapat ditukar atau dikembalikan dalam 3 hari setelah diterima apabila terdapat kerusakan dari pihak kami. Sertakan video unboxing sebagai bukti.', 'type' => 'text', 'group' => 'policy'],
            ['key' => 'privacy_policy', 'value' => 'Kami hanya menyimpan data yang diperlukan untuk memproses pesanan: nama, kontak, dan alamat pengiriman. Data tidak dijual atau dibagikan kepada pihak lain selain jasa pengiriman.', 'type' => 'text', 'group' => 'policy'],
            ['key' => 'terms_conditions', 'value' => 'Dengan melakukan pemesanan, Anda menyetujui bahwa harga dan ketersediaan stok dapat berubah sebelum pembayaran diverifikasi. Pesanan yang belum dibayar dalam batas waktu akan dibatalkan otomatis.', 'type' => 'text', 'group' => 'policy'],
            ['key' => 'faq_content', 'value' => json_encode([
                ['question' => 'Bagaimana cara memesan?', 'answer' => 'Pilih produk, tambahkan ke keranjang, lalu isi data pengiriman pada halaman checkout. Setelah itu transfer sesuai nominal dan unggah bukti transfer.'],
                ['question' => 'Berapa lama pesanan diproses?', 'answer' => 'Setelah pembayaran diverifikasi, pesanan diproses maksimal 1x24 jam pada hari kerja.'],
                ['question' => 'Apakah bisa ambil di toko?', 'answer' => 'Bisa. Pilih metode "Ambil di toko" saat checkout tanpa biaya pengiriman.'],
                ['question' => 'Apakah bisa bayar di tempat?', 'answer' => 'Saat ini pembayaran dilakukan melalui transfer bank. Untuk COD silakan hubungi toko via WhatsApp.'],
            ]), 'type' => 'json', 'group' => 'content'],
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'type' => $setting['type'] ?? 'text',
                    'group' => $setting['group'] ?? 'general',
                ],
            );
        }

        \App\Support\StoreSettings::flush();
    }
}
