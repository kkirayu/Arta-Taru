<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductSpecification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::pluck('id', 'slug');
        $brands = Brand::pluck('id', 'slug');

        $products = [
            // ===== PAKAIAN =====
            [
                'category' => 'kaos', 'brand' => null,
                'name' => 'Kaos Tactical Military', 'sku' => 'PK-001', 'price' => 125000, 'sale_price' => 99000,
                'short' => 'Kaos tactical bahan cotton combed 30s, nyaman dipakai sehari-hari.',
                'description' => "Kaos Tactical Military dirancang untuk penggunaan sehari-hari maupun kegiatan lapangan. Terbuat dari bahan cotton combed 30s yang lembut dan adem, kaos ini sangat nyaman dipakai dalam waktu lama.\n\nDesain military style dengan sablon rubber berkualitas tinggi yang tidak mudah luntur. Tersedia dalam berbagai ukuran dari S hingga XXL.\n\nCocok untuk komunitas outdoor, security, maupun penggunaan casual sehari-hari.",
                'specs' => [['Bahan', 'Cotton Combed 30s'], ['Ukuran', 'S, M, L, XL, XXL'], ['Tipe Sablon', 'Rubber'], ['Berat', '250 gram']],
                'stock' => 45, 'is_featured' => false,
            ],
            [
                'category' => 'jaket', 'brand' => null,
                'name' => 'Jaket Pilot Bomber', 'sku' => 'PK-002', 'price' => 350000, 'sale_price' => null,
                'short' => 'Jaket bomber style pilot dengan bahan parasut tebal dan dalam fleece.',
                'description' => "Jaket Pilot Bomber memiliki desain klasik militer yang ikonik. Bahan luar parasut premium tahan angin dan air ringan, dengan lapisan dalam fleece yang hangat.\n\nDilengkapi dengan rib collar, cuff, dan hem yang elastis. Zipper YKK berkualitas tinggi dan dua kantong samping serta kantong lengan.\n\nSangat cocok untuk cuaca dingin atau sebagai fashion item kasual.",
                'specs' => [['Bahan Luar', 'Parasut Premium'], ['Dalam', 'Fleece'], ['Resleting', 'YKK'], ['Berat', '650 gram']],
                'stock' => 25, 'is_featured' => true,
            ],
            [
                'category' => 'celana', 'brand' => null,
                'name' => 'Celana Cargo Tactical', 'sku' => 'PK-003', 'price' => 225000, 'sale_price' => 189000,
                'short' => 'Celana cargo dengan 6 kantong multifungsi, bahan ripstop tahan lama.',
                'description' => "Celana Cargo Tactical menggunakan bahan ripstop yang tahan sobek dan ringan. Memiliki 6 kantong multifungsi termasuk dua kantong belakang, dua samping atas, dan dua kantong cargo di paha.\n\nDengan desain ergonomis yang memungkinkan gerakan bebas, celana ini sangat cocok untuk aktivitas outdoor, tactical, atau kerja lapangan.\n\nTersedia dalam warna hitam, hijau army, dan khaki.",
                'specs' => [['Bahan', 'Ripstop'], ['Kantong', '6 kantong multifungsi'], ['Warna', 'Hitam, Army, Khaki'], ['Berat', '500 gram']],
                'stock' => 35, 'is_featured' => true,
            ],
            [
                'category' => 'seragam', 'brand' => null,
                'name' => 'Seragam Security', 'sku' => 'PK-004', 'price' => 275000, 'sale_price' => null,
                'short' => 'Seragam security lengkap dengan bahan drill premium dan jahitan rapi.',
                'description' => "Seragam Security dibuat dari bahan drill premium yang nyaman dan tahan lama. Cocok untuk kebutuhan seragam petugas keamanan di berbagai instansi.\n\nSet termasuk kemeja lengan panjang dengan kantong dada, celana panjang, dan topi. Tersedia dalam berbagai ukuran standar nasional.\n\nJahitan rapi dan presisi, dengan aksesoris badge area yang memudahkan pemasangan identitas.",
                'specs' => [['Bahan', 'Drill Premium'], ['Set', 'Kemeja, Celana, Topi'], ['Ukuran', 'M, L, XL, XXL'], ['Berat', '800 gram']],
                'stock' => 20, 'is_featured' => false,
            ],
            [
                'category' => 'aksesoris', 'brand' => null,
                'name' => 'Topi Tactical Operator', 'sku' => 'PK-005', 'price' => 85000, 'sale_price' => null,
                'short' => 'Topi tactical model operator dengan webbing depan untuk aksesoris.',
                'description' => "Topi Tactical Operator didesain untuk penggunaan lapangan maupun casual. Memiliki panel webbing depan (loop) untuk patch dan aksesoris.\n\nBahan ripstop ringan dengan ventilasi udara baik. Adjustable strap di belakang untuk ukuran yang pas.\n\nCocok untuk komunitas tactical, airsoft, atau penggunaan sehari-hari.",
                'specs' => [['Bahan', 'Ripstop'], ['Fitur', 'Webbing panel depan'], ['Pengaturan', 'Adjustable strap'], ['Berat', '120 gram']],
                'stock' => 60, 'is_featured' => false,
            ],
            [
                'category' => 'aksesoris', 'brand' => 'safety-first',
                'name' => 'Rompi Safety Vest', 'sku' => 'PK-006', 'price' => 165000, 'sale_price' => null,
                'short' => 'Rompi safety reflektif sesuai standar, terlihat jelas di malam hari.',
                'description' => "Rompi Safety Vest berstandar nasional dengan pita reflektif 3M yang memberikan visibilitas tinggi dalam kondisi gelap atau berkabut.\n\nBahan mesh polyester yang ringan dan breathable, nyaman dipakai berlama-lama. Dilengkapi dengan kantong depan untuk menyimpan alat kecil.\n\nWajib digunakan untuk pekerja proyek, lalu lintas, dan aktivitas outdoor di area berbahaya.",
                'specs' => [['Bahan', 'Mesh Polyester'], ['Reflektif', '3M Scotchlite'], ['Ukuran', 'Universal'], ['Berat', '150 gram']],
                'stock' => 50, 'is_featured' => false,
            ],

            // ===== ALAT KOMUNIKASI =====
            [
                'category' => 'ht', 'brand' => 'baofeng',
                'name' => 'HT Baofeng UV-5R', 'sku' => 'AK-001', 'price' => 285000, 'sale_price' => 249000,
                'short' => 'HT dual band VHF/UHF, 5W output power, baterai 1800mAh.',
                'description' => "Baofeng UV-5R adalah HT dual band paling populer di Indonesia. Mendukung frekuensi VHF (136-174 MHz) dan UHF (400-520 MHz) dengan output power hingga 5 Watt.\n\nDilengkapi dengan LCD display, flashlight, FM radio, dan alarm. Baterai Li-ion 1800mAh memberikan waktu operasi yang cukup lama.\n\nCocok untuk kebutuhan komunikasi outdoor, security, event organizer, dan komunitas radio.",
                'specs' => [['Frekuensi', 'VHF 136-174 MHz / UHF 400-520 MHz'], ['Output Power', '5W'], ['Baterai', 'Li-ion 1800mAh'], ['Channel', '128']],
                'stock' => 40, 'is_featured' => true,
            ],
            [
                'category' => 'ht', 'brand' => 'baofeng',
                'name' => 'HT Baofeng UV-82', 'sku' => 'AK-002', 'price' => 425000, 'sale_price' => null,
                'short' => 'HT dual band dengan PTT ganda dan output power 8W.',
                'description' => "Baofeng UV-82 adalah upgrade dari UV-5R dengan fitur lebih lengkap. Dual PTT button memungkinkan pengiriman di dua band berbeda tanpa berganti channel.\n\nOutput power lebih besar hingga 8 Watt untuk jangkauan lebih jauh. LCD display yang lebih besar dan mudah dibaca.\n\nBaterai Li-ion 2800mAh memberikan waktu operasi lebih lama. Cocok untuk pengguna yang membutuhkan HT lebih powerful.",
                'specs' => [['Frekuensi', 'VHF 136-174 MHz / UHF 400-520 MHz'], ['Output Power', '8W'], ['Baterai', 'Li-ion 2800mAh'], ['Fitur', 'Dual PTT']],
                'stock' => 22, 'is_featured' => false,
            ],
            [
                'category' => 'radio', 'brand' => null,
                'name' => 'Radio Scanner SDR', 'sku' => 'AK-003', 'price' => 750000, 'sale_price' => null,
                'short' => 'SDR receiver wideband, monitoring frekuensi dari 100 kHz hingga 1.7 GHz.',
                'description' => "Radio Scanner SDR (Software Defined Radio) adalah receiver serbaguna yang mampu menangkap sinyal dari berbagai frekuensi mulai 100 kHz hingga 1.7 GHz.\n\nBisa digunakan untuk monitoring radio komunikasi, pesawat, cuaca, dan berbagai sinyal RF lainnya. Terhubung ke komputer via USB dan dikontrol melalui software SDR.\n\nTermasuk antena wideband untuk reception optimal. Cocok untuk hobiis radio dan profesional.",
                'specs' => [['Range', '100 kHz - 1.7 GHz'], ['Interface', 'USB'], ['Resolusi', '8-bit ADC'], ['Software', 'SDR# / SDR++']],
                'stock' => 10, 'is_featured' => false,
            ],
            [
                'category' => 'antena', 'brand' => null,
                'name' => 'Antena HT Dual Band', 'sku' => 'AK-004', 'price' => 125000, 'sale_price' => null,
                'short' => 'Antena dual band untuk HT, gain tinggi, kompatibel BaoFeng.',
                'description' => "Antena HT Dual Band dirancang untuk menggantikan antena standar pada HT. Dengan gain lebih tinggi, antena ini memberikan jangkauan komunikasi lebih jauh.\n\nKompatibel dengan semua HT Baofeng UV series dan sebagian besar HT dual band lainnya. Bahan stainless steel dan fleksibel, tidak mudah patah.\n\nPanjang sekitar 40cm, ringan dan mudah dibawa.",
                'specs' => [['Gain', '3 dBi'], ['Frekuensi', 'VHF/UHF Dual Band'], ['Kompatibel', 'Baofeng UV-5R, UV-82, dll'], ['Panjang', '~40 cm']],
                'stock' => 30, 'is_featured' => false,
            ],
            [
                'category' => 'battery', 'brand' => null,
                'name' => 'Battery HT Baofeng 1800mAh', 'sku' => 'AK-005', 'price' => 85000, 'sale_price' => null,
                'short' => 'Baterai pengganti Li-ion 1800mAh untuk HT Baofeng UV-5R.',
                'description' => "Baterai pengganti Li-ion 1800mAh untuk HT Baofeng UV-5R dan kompatibel. Kapasitas sama dengan baterai original, memberikan waktu operasi hingga 12 jam normal use.\n\nBaterai lithium-ion tahan lama dengan built-in protection dari overcharge dan overdischarge.\n\nCocok sebagai baterai cadangan untuk perjalanan panjang atau operasi lapangan.",
                'specs' => [['Tipe', 'Li-ion'], ['Kapasitas', '1800mAh'], ['Voltase', '7.4V'], ['Kompatibel', 'Baofeng UV-5R']],
                'stock' => 55, 'is_featured' => false,
            ],
            [
                'category' => 'charger', 'brand' => null,
                'name' => 'Charger HT Universal', 'sku' => 'AK-006', 'price' => 65000, 'sale_price' => null,
                'short' => 'Charger desktop universal untuk berbagai jenis HT Baofeng.',
                'description' => "Charger HT Universal desktop, kompatibel dengan berbagai model HT Baofeng termasuk UV-5R, UV-82, dan UV-B5.\n\nLED indicator menunjukkan status charging: merah saat mengisi, hijau saat penuh. Input USB dan AC adapter.\n\nRingan dan portabel, cocok untuk dibawa bepergian. Pengisian cepat dan aman dengan proteksi overcharge.",
                'specs' => [['Input', 'USB 5V / AC 220V'], ['Output', '8.4V DC'], ['Indikator', 'LED Merah/Hijau'], ['Kompatibel', 'Baofeng UV Series']],
                'stock' => 40, 'is_featured' => false,
            ],

            // ===== ALAT OTOMOTIF =====
            [
                'category' => 'hand-tools-otomotif', 'brand' => 'tekiro',
                'name' => 'Kunci Ring Set Tekiro 10pcs', 'sku' => 'AO-001', 'price' => 285000, 'sale_price' => null,
                'short' => 'Set kunci ring 10pcs ukuran 8-19mm, bahan chrome vanadium.',
                'description' => "Kunci Ring Set Tekiro terdiri dari 10 pcs kunci ring ukuran 8mm hingga 19mm. Terbuat dari bahan chrome vanadium steel yang kuat dan tahan karat.\n\nFinish chrome mengkilap memberikan ketahanan terhadap korosi dan memudahkan pembersihan. Desain ring yang presisi memudahkan pencengkeraman baut.\n\nDilengkapi dengan box organizer untuk penyimpanan rapi. Garansi seumur hidup dari Tekiro.",
                'specs' => [['Jumlah', '10 pcs'], ['Ukuran', '8, 9, 10, 11, 12, 13, 14, 15, 17, 19 mm'], ['Bahan', 'Chrome Vanadium Steel'], ['Garansi', 'Seumur Hidup']],
                'stock' => 30, 'is_featured' => false,
            ],
            [
                'category' => 'hand-tools-otomotif', 'brand' => 'tekiro',
                'name' => 'Kunci Pas Set 8pcs', 'sku' => 'AO-002', 'price' => 175000, 'sale_price' => null,
                'short' => 'Set kunci pas 8pcs dari Tekiro, ringan dan ergonomis.',
                'description' => "Set kunci pas Tekiro terdiri dari 8 pcs dengan ukuran yang paling sering digunakan. Ergonomis dan ringan, nyaman digunakan dalam waktu lama.\n\nBahan chrome vanadium berkualitas tinggi dengan finish chrome. Ketebalan yang presisi memudahkan akses di ruang sempit.\n\nCocok untuk bengkel rumahan maupun profesional. Disertakan holder untuk penyimpanan.",
                'specs' => [['Jumlah', '8 pcs'], ['Ukuran', '5.5, 6, 7, 8, 10, 11, 12, 13 mm'], ['Bahan', 'Chrome Vanadium'], ['Berat', '800 gram']],
                'stock' => 35, 'is_featured' => false,
            ],
            [
                'category' => 'sparepart', 'brand' => 'toyota-parts',
                'name' => 'Oli Mesin Synthetic 5W-30', 'sku' => 'AO-003', 'price' => 125000, 'sale_price' => null,
                'short' => 'Oli mesin fully synthetic 5W-30, cocok untuk mesin bensin dan diesel.',
                'description' => "Oli mesin fully synthetic 5W-30 memberikan pelumasan optimal pada semua kondisi mesin. Formula terbaru dengan additive anti-wear yang melindungi mesin dari keausan.\n\nViskositas 5W-30 memberikan flow yang baik saat dingin dan proteksi pada temperatur tinggi. Cocok untuk mesin bensin dan diesel modern.\n\nKapasitas 4 liter, cukup untuk satu kali ganti oli untuk kebanyakan kendaraan.",
                'specs' => [['Tipe', 'Fully Synthetic'], ['Viskositas', '5W-30'], ['Kapasitas', '4 Liter'], ['Standar', 'API SN Plus / ILSAC GF-5']],
                'stock' => 50, 'is_featured' => false,
            ],
            [
                'category' => 'sparepart', 'brand' => null,
                'name' => 'Filter Udara Universal', 'sku' => 'AO-004', 'price' => 75000, 'sale_price' => null,
                'short' => 'Filter udara universal, compatible dengan berbagai jenis kendaraan.',
                'description' => "Filter udara universal yang kompatibel dengan berbagai jenis kendaraan. Material filter berkualitas tinggi yang efektif menangkap debu dan kotoran.\n\nPemasangan mudah tanpa perlu modifikasi. Ganti filter udara secara berkala untuk menjaga performa mesin dan efisiensi bahan bakar.\n\nDisarankan mengganti setiap 10.000 km atau sesuai kondisi jalan.",
                'specs' => [['Tipe', 'Paper Element'], ['Ukuran', 'Universal (potong sesuai)'], ['Material', 'Cellulose Fiber'], ['Interval', '10.000 km']],
                'stock' => 40, 'is_featured' => false,
            ],
            [
                'category' => 'electrical-otomotif', 'brand' => null,
                'name' => 'Lampu LED H7', 'sku' => 'AO-005', 'price' => 145000, 'sale_price' => null,
                'short' => 'Lampu LED H7 12V 60W super bright, 6000K white, plug and play.',
                'description' => "Lampu LED H7 dengan output cahaya super bright hingga 6000K white memberikan visibilitas yang jauh lebih baik dibanding lampu halogen standar.\n\nPlug and play, tidak perlu modifikasi. Heat sink aluminium built-in untuk散热 yang baik. Daya rendah hanya 60W per buah.\n\nUmur panjang hingga 30.000 jam, jauh lebih awet dari lampu halogen. Termasuk sepasang (2 pcs).",
                'specs' => [['Tipe', 'LED H7'], ['Daya', '60W per bulb'], ['Suhu Warna', '6000K White'], ['Umur', '30.000 jam']],
                'stock' => 25, 'is_featured' => false,
            ],
            [
                'category' => 'safety', 'brand' => 'safety-first',
                'name' => 'Helm Safety Proyek', 'sku' => 'AO-006', 'price' => 185000, 'sale_price' => null,
                'short' => 'Helm safety standar SNI, bahan ABS impact resistant, adjustable size.',
                'description' => "Helm Safety Proyek berstandar SNI dengan shell bahan ABS yang tahan benturan. Sistem suspensi 4-point memberikan perlindungan optimal dan kenyamanan.\n\nAdjustable size dengan tali pengikat chincup. Ventilasi udara yang baik untuk kenyamanan saat bekerja di bawah terik matahari.\n\nCocok untuk pekerja konstruksi, proyek bangunan, dan aktivitas lain yang membutuhkan perlindungan kepala.",
                'specs' => [['Material', 'ABS'], ['Standar', 'SNI'], ['Ukuran', 'Adjustable (54-62 cm)'], ['Tipe Suspensi', '4-Point']],
                'stock' => 30, 'is_featured' => false,
            ],

            // ===== PERALATAN TEKNIKAL =====
            [
                'category' => 'power-tools', 'brand' => 'bosch',
                'name' => 'Bosch GSB 550 Impact Drill', 'sku' => 'PT-001', 'price' => 525000, 'sale_price' => null,
                'short' => 'Impact drill 550W, kecepatan 0-2800 RPM, chuck 13mm.',
                'description' => "Bosch GSB 550 Impact Drill adalah bor listrik serbaguna dengan daya 550W. Mode impact memungkinkan pengeboran pada beton hingga diameter 13mm.\n\nKecepatan variabel 0-2800 RPM dengan switch untuk kecepatan tinggi/rendah. Chuck keyless 13mm memudahkan penggantian mata bor.\n\nErgonomis dengan grip yang nyaman, cocok untuk DIY maupun penggunaan profesional ringan.",
                'specs' => [['Daya', '550W'], ['Kecepatan', '0-2800 RPM'], ['Chuck', '13mm keyless'], ['Mode', 'Drill + Hammer']],
                'stock' => 15, 'is_featured' => true,
            ],
            [
                'category' => 'power-tools', 'brand' => 'bosch',
                'name' => 'Mesin Gerinda Bosch', 'sku' => 'PT-002', 'price' => 750000, 'sale_price' => 675000,
                'short' => 'Angle grinder 4 inch, 840W, kecepatan 11000 RPM.',
                'description' => "Mesin Gerinda Bosch GWS 7-125 adalah angle grinder 4 inch dengan daya 840W. Kecepatan putar 11000 RPM untuk cutting dan grinding yang efisien.\n\nBody slim dan ringan untuk kenyamanan penggunaan lama. Spindle lock memudahkan penggantian disc tanpa kunci.\n\nTermasuk guard pelindung dan side handle. Cocok untuk cutting besi, grinding, dan polishing.",
                'specs' => [['Daya', '840W'], ['Diameter Disc', '115mm (4 inch)'], ['Kecepatan', '11000 RPM'], ['Spindle', 'M10']],
                'stock' => 12, 'is_featured' => false,
            ],
            [
                'category' => 'measuring-tools', 'brand' => null,
                'name' => 'Multimeter Digital Fluke', 'sku' => 'PT-003', 'price' => 850000, 'sale_price' => null,
                'short' => 'Multimeter digital True RMS, pengukuran voltage, current, resistance.',
                'description' => "Multimeter Digital Fluke adalah alat ukur elektronik profesional dengan akurasi tinggi. True RMS measurement untuk pembacaan akurat pada sinyal non-sinusoidal.\n\nMampu mengukur DC/AC voltage hingga 600V, DC/AC current hingga 10A, resistance hingga 40MΩ, kapasitansi, frekuensi, dan temperatur.\n\nAuto-ranging dengan hold function dan backlight display. CAT III 600V rated untuk keamanan.",
                'specs' => [['Tipe', 'True RMS Digital'], ['Max Voltage', '600V'], ['Max Current', '10A'], ['Safety Rating', 'CAT III 600V']],
                'stock' => 8, 'is_featured' => true,
            ],
            [
                'category' => 'electrical-tools', 'brand' => null,
                'name' => 'Tang Crimping Wire', 'sku' => 'PT-004', 'price' => 95000, 'sale_price' => null,
                'short' => 'Tang crimping 3-in-1, untuk crimp, cut, dan strip kabel.',
                'description' => "Tang Crimping Wire serbaguna 3-in-1 yang bisa digunakan untuk memotong, menstripping, dan mencrimp kabel. Dengan satu alat, semua pekerjaan kabel bisa diselesaikan.\n\nErgonomis dengan handle anti-slip. Pisau potong tajam dari baja hardness tinggi. Area crimp untuk berbagai ukuran terminal.\n\nCocok untuk teknisi listrik, elektronik, dan instalasi jaringan.",
                'specs' => [['Fungsi', 'Crimp, Cut, Strip'], ['Ukuran Kabel', '0.2 - 6 mm²'], ['Handle', 'Anti-slip'], ['Bahan', 'High Carbon Steel']],
                'stock' => 25, 'is_featured' => false,
            ],
            [
                'category' => 'hand-tools-teknikal', 'brand' => null,
                'name' => 'Obeng Set Precision 32in1', 'sku' => 'PT-005', 'price' => 145000, 'sale_price' => null,
                'short' => 'Set obeng precision 32 bit, untuk elektronik, HP, laptop.',
                'description' => "Obeng Set Precision 32in1 dengan 32 jenis bit yang berbeda untuk keperluan membongkar perangkat elektronik. Termasuk bit Torx, Phillips, Flat, Tri-wing, Pentalobe, dan lainnya.\n\nHandle magnetik dengan rotating cap untuk kemudahan penggunaan. Material bit S2 steel yang keras dan tahan lama.\n\nCocok untuk reparasi smartphone, laptop, konsol game, kacamata, dan perangkat elektronik lainnya.",
                'specs' => [['Jumlah Bit', '32 pcs'], ['Material Bit', 'S2 Steel'], ['Tipe', 'Precision Screwdriver'], ['Fitur', 'Magnetic']],
                'stock' => 35, 'is_featured' => false,
            ],
            [
                'category' => 'measuring-tools', 'brand' => null,
                'name' => 'Meteran Laser 40m', 'sku' => 'PT-006', 'price' => 325000, 'sale_price' => null,
                'short' => 'Laser distance meter 40m, akurasi ±2mm, dengan tripod mount.',
                'description' => "Meteran Laser 40m mengukur jarak dengan akurasi tinggi ±2mm menggunakan teknologi laser. Jangkauan hingga 40 meter, cocok untuk pengukuran indoor maupun outdoor.\n\nFitur pengukuran luas dan volume otomatis. Memory untuk menyimpan 30 hasil pengukuran. LCD backlight untuk visibilitas di tempat gelap.\n\nMounting tripod di bagian bawah untuk pengukuran yang stabil. Baterai AAA sudah termasuk.",
                'specs' => [['Jangkauan', '40 meter'], ['Akurasi', '±2mm'], ['Memory', '30 values'], ['Display', 'LCD Backlight']],
                'stock' => 15, 'is_featured' => false,
            ],
            [
                'category' => 'power-tools', 'brand' => null,
                'name' => 'Bor Listrik Makita', 'sku' => 'PT-007', 'price' => 875000, 'sale_price' => null,
                'short' => 'Impact drill Makita 710W, chuck 13mm, kecepatan variable.',
                'description' => "Bor Listrik Makita HP1640 adalah impact drill profesional dengan daya 710W. Mode drill dan hammer untuk pengeboran beton.\n\nKecepatan variable dengan switch dan dial speed control. Chuck 3-jaw keyless 13mm. Forward/reverse switch untuk versatile use.\n\nBody ringan hanya 1.7kg dengan ergonomis yang baik. Cocok untuk contractor dan DIY enthusiast yang membutuhkan bor reliable.",
                'specs' => [['Daya', '710W'], ['Chuck', '13mm 3-jaw keyless'], ['Kecepatan', '0-2800 RPM'], ['Berat', '1.7 kg']],
                'stock' => 10, 'is_featured' => false,
            ],
        ];

        $now = now();
        foreach ($products as $data) {
            $categoryId = $categories[$data['category']] ?? $categories->first();
            $brandId = $data['brand'] ? ($brands[$data['brand']] ?? null) : null;

            $stockStatus = 'available';
            if ($data['stock'] === 0) {
                $stockStatus = 'out_of_stock';
            }

            $product = Product::create([
                'category_id' => $categoryId,
                'brand_id' => $brandId,
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'sku' => $data['sku'],
                'short_description' => $data['short'],
                'description' => $data['description'],
                'price' => $data['price'],
                'sale_price' => $data['sale_price'],
                'stock' => $data['stock'],
                'low_stock_threshold' => 5,
                'stock_status' => $stockStatus,
                'is_featured' => $data['is_featured'],
                'is_active' => true,
                'published_at' => $now,
            ]);

            foreach ($data['specs'] as $i => $spec) {
                ProductSpecification::create([
                    'product_id' => $product->id,
                    'key' => $spec[0],
                    'value' => $spec[1],
                    'sort_order' => $i,
                ]);
            }
        }
    }
}
