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
        $cat = fn (string $slug) => Category::where('slug', $slug)->first()?->id;
        $brand = fn (?string $name) => $name ? Brand::where('name', $name)->first()?->id : null;

        $products = [
            // ===== PAKAIAN: KAOS =====
            [
                'category' => 'kaos', 'brand' => 'Nike',
                'name' => 'Kaos Tactical Polos Navy', 'sku' => 'PK-001',
                'price' => 125000, 'sale_price' => 99000, 'stock' => 75, 'featured' => true,
                'short' => 'Kaos tactical polos warna navy, bahan cotton combed 30s premium.',
                'description' => "Kaos Tactical Polos Navy dirancang untuk kenyamanan sehari-hari maupun aktivitas lapangan. Terbuat dari bahan cotton combed 30s yang lembut, adem, dan menyerap keringat dengan baik.\n\nPotongan regular fit yang tidak ketat memberikan kebebasan bergerak. Warna navy yang solid tidak mudah pudar meski sudah dicuci berkali-kali. Tersedia dalam ukuran S hingga XXL.\n\nCocok digunakan sebagai kaos kerja, komunitas, atau casual sehari-hari. Kualitas jahitan rapi dan tahan lama.",
                'specs' => [['Bahan', 'Cotton Combed 30s'], ['Ukuran', 'S, M, L, XL, XXL'], ['Warna', 'Navy'], ['Berat', '250 gram']],
            ],
            [
                'category' => 'kaos', 'brand' => 'Adidas',
                'name' => 'Kaos Polo Kerja Kantor', 'sku' => 'PK-002',
                'price' => 175000, 'sale_price' => null, 'stock' => 60, 'featured' => false,
                'short' => 'Kaos polo kerja kantor bahan lacoste premium, nyaman dan formal.',
                'description' => "Kaos Polo Kerja Kantor menggunakan bahan lacoste premium yang memberikan tampilan semi-formal namun tetap nyaman. Cocok untuk seragam kantor atau acara formal kasual.\n\nKerah rib dan dua tombol depan dengan jahitan rantai yang rapi. Logo bisa ditambahkan pada area dada kiri sesuai kebutuhan perusahaan.\n\nTersedia dalam berbagai warna netral: hitam, putih, navy, abu-abu, dan merah marun.",
                'specs' => [['Bahan', 'Lacoste Premium'], ['Tipe', 'Polo Kerah 2 Tombol'], ['Ukuran', 'S, M, L, XL, XXL'], ['Berat', '280 gram']],
            ],
            // ===== PAKAIAN: JAKET =====
            [
                'category' => 'jaket', 'brand' => 'Nike',
                'name' => 'Jaket Pilot Bomber Premium', 'sku' => 'PK-003',
                'price' => 350000, 'sale_price' => 299000, 'stock' => 30, 'featured' => true,
                'short' => 'Jaket bomber style pilot dengan bahan parasut premium dan dalam fleece.',
                'description' => "Jaket Pilot Bomber Premium mengusung desain klasik militer yang ikonik. Bahan luar parasut premium tahan angin dan air ringan, dengan lapisan dalam fleece yang hangat dan nyaman.\n\nDilengkapi rib collar, cuff, dan hem yang elastis. Resleting YKK berkualitas tinggi di bagian depan. Dua kantong samping zipper dan kantong lengan kiri dengan zipper.\n\nTersedia dalam warna hitam, olive, dan navy. Cocok untuk cuaca dingin atau sebagai fashion item kasual.",
                'specs' => [['Bahan Luar', 'Parasut Premium'], ['Dalam', 'Fleece'], ['Resleting', 'YKK'], ['Berat', '650 gram']],
            ],
            [
                'category' => 'jaket', 'brand' => 'Adidas',
                'name' => 'Jaket Tactical Softshell Waterproof', 'sku' => 'PK-004',
                'price' => 425000, 'sale_price' => null, 'stock' => 25, 'featured' => false,
                'short' => 'Jaket tactical softshell waterproof, tahan angin dan hujan ringan.',
                'description' => "Jaket Tactical Softshell Waterproof dirancang untuk kondisi cuaca ekstrem. Bahan softshell 3-layer dengan membran waterproof rating 8000mm memberikan perlindungan dari hujan dan angin.\n\nDesain tactical dengan banyak kantong: dua kantong dada dengan velcro, dua kantong samping zipper, dan kantong dalam. Hood bisa dilipat ke dalam kerah.\n\nRingan dan breathable, cocok untuk outdoor activity, hiking, atau kerja lapangan. Tersedia dalam hitam dan hijau army.",
                'specs' => [['Bahan', 'Softshell 3-Layer'], ['Waterproof', '8000mm Rating'], ['Kantong', '6 kantong'], ['Berat', '700 gram']],
            ],
            // ===== PAKAIAN: CELANA =====
            [
                'category' => 'celana', 'brand' => 'Nike',
                'name' => 'Celana Cargo Tactical 8 Pocket', 'sku' => 'PK-005',
                'price' => 225000, 'sale_price' => 189000, 'stock' => 50, 'featured' => true,
                'short' => 'Celana cargo tactical 8 kantong, bahan ripstop tahan sobek.',
                'description' => "Celana Cargo Tactical 8 Pocket menggunakan bahan ripstop yang tahan sobek dan ringan. Memiliki 8 kantong multifungsi termasuk dua kantong belakang, dua samping atas, dua cargo besar di paha, dan dua kantong kecil untuk aksesoris.\n\nDesain ergonomis dengan articulated knee memungkinkan gerakan bebas. Adjustable waist strap dan ankle cuffs untuk fit yang pas.\n\nTersedia dalam warna hitam, hijau army, khaki, dan coyote. Cocok untuk tactical, outdoor, atau kerja lapangan.",
                'specs' => [['Bahan', 'Ripstop'], ['Kantong', '8 kantong multifungsi'], ['Warna', 'Hitam, Army, Khaki, Coyote'], ['Berat', '550 gram']],
            ],
            [
                'category' => 'celana', 'brand' => 'Adidas',
                'name' => 'Celana Lapangan Ripstop Military', 'sku' => 'PK-006',
                'price' => 195000, 'sale_price' => null, 'stock' => 45, 'featured' => false,
                'short' => 'Celana lapangan bahan ripstop military, nyaman dan tahan lama.',
                'description' => "Celana Lapangan Ripstop Military dibuat dari bahan ripstop militer spec yang kuat dan tahan lama. Potongan regular dengan pergerakan luas untuk aktivitas lapangan.\n\nDilengkapi 6 kantong dengan penutup velcro dan zipper. Ring belt loop yang lebar untuk penggunaan tali taktis. Double stitch pada area stress point.\n\nCocok untuk personel security, TNI/Polri, komunitas outdoor, dan aktivitas berat lainnya.",
                'specs' => [['Bahan', 'Ripstop Military'], ['Kantong', '6 dengan velcro & zipper'], ['Tipe', 'Regular Fit'], ['Berat', '500 gram']],
            ],
            // ===== PAKAIAN: SERAGAM =====
            [
                'category' => 'seragam', 'brand' => null,
                'name' => 'Seragam Security Hitam Full Set', 'sku' => 'PK-007',
                'price' => 350000, 'sale_price' => null, 'stock' => 20, 'featured' => true,
                'short' => 'Seragam security full set: kemeja, celana, topi, dan aksesoris.',
                'description' => "Seragam Security Hitam Full Set terdiri dari kemeja lengan panjang, celana panjang, dan topi pet. Terbuat dari bahan drill premium yang nyaman, adem, dan tahan lama.\n\nKemeja memiliki dua kantong dada dengan penutup velcro, epaulette bahu, dan area untuk badge identitas. Celana dengan belt loop dan kantong samping.\n\nJahitan rapi dan presisi, warna hitam pekat yang tidak mudah pudar. Tersedia ukuran M, L, XL, XXL.",
                'specs' => [['Bahan', 'Drill Premium'], ['Set', 'Kemeja, Celana, Topi'], ['Ukuran', 'M, L, XL, XXL'], ['Berat', '900 gram']],
            ],
            // ===== PAKAIAN: AKSESORIS =====
            [
                'category' => 'aksesoris', 'brand' => 'Nike',
                'name' => 'Topi Tactical Operator Cap', 'sku' => 'PK-008',
                'price' => 85000, 'sale_price' => null, 'stock' => 100, 'featured' => false,
                'short' => 'Topi tactical operator cap dengan webbing depan untuk patch.',
                'description' => "Topi Tactical Operator Cap didesain untuk penggunaan lapangan maupun casual. Panel webbing depan (loop) untuk patch MOLLE dan aksesoris. Bahan ripstop ringan dengan ventilasi udara baik.\n\nAdjustable strap di belakang untuk ukuran yang pas. Brim kaku yang melindungi dari sinar matahari. Drainage holes di bagian atas jika basah.\n\nCocok untuk komunitas tactical, airsoft, militer, atau penggunaan sehari-hari.",
                'specs' => [['Bahan', 'Ripstop'], ['Fitur', 'Webbing panel depan'], ['Pengaturan', 'Adjustable strap'], ['Berat', '120 gram']],
            ],
            // ===== ALAT KOMUNIKASI: HT =====
            [
                'category' => 'ht', 'brand' => 'Baofeng',
                'name' => 'HT Baofeng UV-5R Dual Band', 'sku' => 'AK-001',
                'price' => 285000, 'sale_price' => 249000, 'stock' => 80, 'featured' => true,
                'short' => 'HT dual band VHF/UHF 5W, 128 channel, baterai 1800mAh.',
                'description' => "Baofeng UV-5R adalah HT dual band paling populer di Indonesia. Mendukung frekuensi VHF (136-174 MHz) dan UHF (400-520 MHz) dengan output power hingga 5 Watt.\n\nDilengkapi LCD display dual watch, flashlight, FM radio, dan alarm darurat. 128 channel programmable dengan CTCSS/DCS tone. Baterai Li-ion 1800mAh memberikan waktu operasi hingga 12 jam.\n\nCocok untuk komunikasi outdoor, security, event organizer, dan komunitas radio. Termasuk antena, charger desktop, dan handsfree.",
                'specs' => [['Frekuensi', 'VHF 136-174 MHz / UHF 400-520 MHz'], ['Output Power', '5 Watt'], ['Baterai', 'Li-ion 1800mAh BL-5'], ['Channel', '128']],
            ],
            [
                'category' => 'ht', 'brand' => 'Baofeng',
                'name' => 'HT Baofeng UV-82 8Watt', 'sku' => 'AK-002',
                'price' => 425000, 'sale_price' => null, 'stock' => 40, 'featured' => false,
                'short' => 'HT dual band 8W dengan dual PTT button dan baterai 2800mAh.',
                'description' => "Baofeng UV-82 adalah upgrade dari UV-5R dengan fitur lebih lengkap dan power lebih besar. Dual PTT button memungkinkan transmisi di dua band tanpa berganti channel.\n\nOutput power hingga 8 Watt untuk jangkauan lebih jauh. LCD display yang lebih besar dan mudah dibaca. Baterai Li-ion 2800mAh memberikan waktu operasi lebih lama.\n\nBody lebih kokoh dengan keypad numeric lengkap. Ideal untuk pengguna yang membutuhkan HT lebih powerful dan reliable.",
                'specs' => [['Frekuensi', 'VHF 136-174 MHz / UHF 400-520 MHz'], ['Output Power', '8 Watt'], ['Baterai', 'Li-ion 2800mAh'], ['Fitur', 'Dual PTT']],
            ],
            [
                'category' => 'ht', 'brand' => 'Baofeng',
                'name' => 'HT Baofeng GT-3 Mark V', 'sku' => 'AK-003',
                'price' => 365000, 'sale_price' => null, 'stock' => 35, 'featured' => true,
                'short' => 'HT Baofeng GT-3 Mark V dual band 5W, desain premium finish metalik.',
                'description' => "Baofeng GT-3 Mark V adalah HT dual band dengan desain premium dan finishing metalik yang elegan. Output power 5 Watt pada kedua band VHF dan UHF.\n\nDesain ergonomis dengan grip yang nyaman dan keypad backlight untuk penggunaan malam hari. Fitur lengkap termasuk FM radio, alarm, FM transceiver, dan VOX.\n\nBaterai Li-ion 2000mAh lebih besar dari UV-5R. Cocok untuk pengguna yang menginginkan HT dengan tampilan lebih premium namun tetap affordable.",
                'specs' => [['Frekuensi', 'VHF 136-174 MHz / UHF 400-520 MHz'], ['Output Power', '5 Watt'], ['Baterai', 'Li-ion 2000mAh'], ['Desain', 'Premium Metallic Finish']],
            ],
            // ===== ALAT KOMUNIKASI: RADIO =====
            [
                'category' => 'radio', 'brand' => null,
                'name' => 'Radio Scanner SDR Trunk Analog Digital', 'sku' => 'AK-004',
                'price' => 750000, 'sale_price' => null, 'stock' => 15, 'featured' => false,
                'short' => 'SDR receiver wideband trunking, monitoring analog dan digital.',
                'description' => "Radio Scanner SDR Trunk Analog Digital adalah receiver serbaguna yang mampu menangkap sinyal dari berbagai frekuensi mulai 100 kHz hingga 1.7 GHz. Mendukung decoding trunking analog dan digital.\n\nBisa digunakan untuk monitoring radio komunikasi, pesawat terbang, cuaca, dan berbagai sinyal RF lainnya. Terhubung ke komputer via USB dan dikontrol melalui software SDR.\n\nTermasuk antena wideband dan kabel USB. Cocok untuk hobiis radio, peneliti, dan profesional RF.",
                'specs' => [['Range Frekuensi', '100 kHz - 1.7 GHz'], ['Interface', 'USB 2.0'], ['Resolusi', '8-bit ADC'], ['Software', 'SDR#, SDR++, Unitrunker']],
            ],
            // ===== ALAT KOMUNIKASI: ANTENA =====
            [
                'category' => 'antena', 'brand' => 'Baofeng',
                'name' => 'Antena HT Dual Band Nagoya NA-771', 'sku' => 'AK-005',
                'price' => 125000, 'sale_price' => null, 'stock' => 60, 'featured' => false,
                'short' => 'Antena dual band gain tinggi Nagoya NA-771, kompatibel Baofeng.',
                'description' => "Antena HT Nagoya NA-771 dual band dirancang untuk menggantikan antena standar pada HT. Dengan gain lebih tinggi, antena ini memberikan jangkauan komunikasi lebih jauh dan sinyal lebih stabil.\n\nKompatibel dengan semua HT Baofeng UV series, Kenwood, dan sebagian besar HT dual band SMA-Female. Bahan stainless steel fleksibel, tidak mudah patah.\n\nPanjang sekitar 40cm, ringan dan mudah dibawa. Peningkatan signifikan dibanding antena rubber duck standar.",
                'specs' => [['Gain', '3 dBi'], ['Frekuensi', 'VHF/UHF Dual Band'], ['Kompatibel', 'Baofeng UV-5R, UV-82, GT-3'], ['Panjang', '~40 cm']],
            ],
            // ===== ALAT KOMUNIKASI: BATTERY =====
            [
                'category' => 'battery', 'brand' => 'Baofeng',
                'name' => 'Battery HT Baofeng 1800mAh BL-5', 'sku' => 'AK-006',
                'price' => 85000, 'sale_price' => null, 'stock' => 90, 'featured' => false,
                'short' => 'Baterai pengganti Li-ion 1800mAh untuk HT Baofeng UV-5R.',
                'description' => "Baterai pengganti Li-ion 1800mAh tipe BL-5 untuk HT Baofeng UV-5R dan kompatibel. Kapasitas sama dengan baterai original, memberikan waktu operasi hingga 12 jam normal use.\n\nBaterai lithium-ion berkualitas dengan built-in protection dari overcharge, overdischarge, dan short circuit. Daya tahan charge hingga 500 siklus.\n\nCocok sebagai baterai cadangan untuk perjalanan panjang atau operasi lapangan tanpa akses charger.",
                'specs' => [['Tipe', 'Li-ion BL-5'], ['Kapasitas', '1800mAh'], ['Voltase', '7.4V'], ['Kompatibel', 'Baofeng UV-5R, GT-3']],
            ],
            // ===== ALAT KOMUNIKASI: CHARGER =====
            [
                'category' => 'charger', 'brand' => 'Baofeng',
                'name' => 'Charger HT Universal 12V Desktop', 'sku' => 'AK-007',
                'price' => 65000, 'sale_price' => null, 'stock' => 70, 'featured' => false,
                'short' => 'Charger desktop universal 12V untuk HT Baofeng series.',
                'description' => "Charger HT Universal 12V Desktop kompatibel dengan berbagai model HT Baofeng termasuk UV-5R, UV-82, GT-3, dan UV-B5. Charging dock dengan LED indicator status.\n\nLED merah menunjukkan proses charging, LED hijau menunjukkan baterai penuh. Input AC 220V ke DC 12V adapter. Charging cepat dan aman dengan proteksi overcharge.\n\nRingan dan portabel, cocok untuk dibawa bepergian. Digunakan sebagai charger meja di kantor atau base station.",
                'specs' => [['Input', 'AC 220V / 50Hz'], ['Output', 'DC 12V 1A'], ['Indikator', 'LED Merah/Hijau'], ['Kompatibel', 'Baofeng UV Series, GT-3']],
            ],
            // ===== ALAT KOMUNIKASI: AKSESORIS-KOMUNIKASI =====
            [
                'category' => 'aksesoris-komunikasi', 'brand' => 'Baofeng',
                'name' => 'Tas HT Tactical Walkie Talkie Bag', 'sku' => 'AK-008',
                'price' => 95000, 'sale_price' => null, 'stock' => 40, 'featured' => false,
                'short' => 'Tas tactical untuk HT walkie talkie, bahan cordura tahan air.',
                'description' => "Tas HT Tactical Walkie Talkie Bag dirancang khusus untuk membawa HT saat operasi lapangan. Bahan cordura 600D yang tahan air dan abrasion.\n\nDilengkapi tali MOLLE untuk attachment ke tactical vest atau belt. Penutup dengan buckle quick-release dan velcro. Kabel earpiece bisa dilewatkan melalui lubang khusus.\n\nKompatibel dengan semua jenis HT termasuk Baofeng UV-5R, UV-82, dan model lainnya. Tersedia dalam warna hitam, khaki, dan hijau army.",
                'specs' => [['Bahan', 'Cordura 600D'], ['Sistem', 'MOLLE Compatible'], ['Penutup', 'Buckle + Velcro'], ['Kompatibel', 'Semua HT Handheld']],
            ],
            // ===== ALAT OTOMOTIF: HAND TOOLS =====
            [
                'category' => 'hand-tools-otomotif', 'brand' => 'Tekiro',
                'name' => 'Kunci Ring Set Tekiro 10pcs 6-22mm', 'sku' => 'AO-001',
                'price' => 285000, 'sale_price' => null, 'stock' => 35, 'featured' => true,
                'short' => 'Set kunci ring Tekiro 10pcs ukuran 6-22mm, chrome vanadium.',
                'description' => "Kunci Ring Set Tekiro terdiri dari 10 pcs kunci ring ukuran 6mm hingga 22mm. Terbuat dari bahan chrome vanadium steel yang kuat, keras, dan tahan karat.\n\nFinish chrome mengkilap memberikan ketahanan terhadap korosi dan memudahkan pembersihan. Desain ring 6-point yang presisi memudahkan pencengkeraman baut tanpa slip.\n\nDilengkapi dengan box organizer untuk penyimpanan rapi. Garansi seumur hidup dari Tekiro. Cocok untuk bengkel otomotif profesional dan DIY.",
                'specs' => [['Jumlah', '10 pcs'], ['Ukuran', '6, 7, 8, 9, 10, 11, 12, 14, 17, 19, 22 mm'], ['Bahan', 'Chrome Vanadium Steel'], ['Garansi', 'Seumur Hidup']],
            ],
            [
                'category' => 'hand-tools-otomotif', 'brand' => 'Tekiro',
                'name' => 'Kunci Pas Set 8pcs Chrome Vanadium', 'sku' => 'AO-002',
                'price' => 175000, 'sale_price' => null, 'stock' => 50, 'featured' => false,
                'short' => 'Set kunci pas 8pcs Tekiro, chrome vanadium, ringan dan presisi.',
                'description' => "Set Kunci Pas Tekiro terdiri dari 8 pcs ukuran yang paling sering digunakan. Bahan chrome vanadium berkualitas tinggi dengan finish chrome anti karat.\n\nKetebalan dan lebar yang presisi memudahkan akses di ruang sempit. Ringan namun kuat, nyaman digunakan dalam waktu lama tanpa pegal.\n\nDisertakan wall-mount holder untuk penyimpanan rapi di bengkel. Cocok untuk bengkel rumahan maupun profesional. Garansi seumur hidup.",
                'specs' => [['Jumlah', '8 pcs'], ['Ukuran', '5.5, 6, 7, 8, 10, 11, 12, 13 mm'], ['Bahan', 'Chrome Vanadium'], ['Berat', '800 gram']],
            ],
            // ===== ALAT OTOMOTIF: SPAREPART =====
            [
                'category' => 'sparepart', 'brand' => 'Toyota Parts',
                'name' => 'Oli Mesin Synthetic 5W-30 4L', 'sku' => 'AO-003',
                'price' => 325000, 'sale_price' => null, 'stock' => 60, 'featured' => true,
                'short' => 'Oli mesin fully synthetic 5W-30, API SN Plus, kapasitas 4 liter.',
                'description' => "Oli mesin fully synthetic 5W-30 memberikan pelumasan optimal pada semua kondisi mesin. Formula terbaru dengan additive anti-wear yang melindungi mesin dari keausan berlebih.\n\nViskositas 5W-30 memberikan flow yang baik saat mesin dingin dan proteksi optimal pada temperatur kerja tinggi. Cocok untuk mesin bensin dan diesel modern termasuk turbocharger.\n\nKapasitas 4 liter, cukup untuk satu kali ganti oli pada kebanyakan kendaraan. Memenuhi standar API SN Plus dan ILSAC GF-5.",
                'specs' => [['Tipe', 'Fully Synthetic'], ['Viskositas', '5W-30'], ['Kapasitas', '4 Liter'], ['Standar', 'API SN Plus / ILSAC GF-5']],
            ],
            [
                'category' => 'sparepart', 'brand' => 'Toyota Parts',
                'name' => 'Filter Udara Universal Mobil', 'sku' => 'AO-004',
                'price' => 125000, 'sale_price' => null, 'stock' => 45, 'featured' => false,
                'short' => 'Filter udara universal high-flow untuk berbagai jenis kendaraan.',
                'description' => "Filter Udara Universal dibuat dari material filter berkualitas tinggi yang efektif menangkap debu, kotoran, dan partikel halus dari udara yang masuk ke mesin.\n\nDesain universal dengan ukuran yang bisa disesuaikan (potong sesuai kebutuhan). Pemasangan mudah tanpa modifikasi. Flow rate tinggi menjaga performa mesin tetap optimal.\n\nDisarankan mengganti setiap 10.000 km atau sesuai kondisi jalan. Menjaga efisiensi bahan bakar dan memperpanjang umur mesin.",
                'specs' => [['Tipe', 'Paper Element High-Flow'], ['Ukuran', 'Universal (Potong Sesuai)'], ['Material', 'Cellulose Fiber'], ['Interval Ganti', '10.000 km']],
            ],
            // ===== ALAT OTOMOTIF: ELECTRICAL =====
            [
                'category' => 'electrical-otomotif', 'brand' => null,
                'name' => 'Lampu LED H7 Plug and Play', 'sku' => 'AO-005',
                'price' => 145000, 'sale_price' => null, 'stock' => 80, 'featured' => false,
                'short' => 'Lampu LED H7 12V 60W super bright 6000K, plug and play.',
                'description' => "Lampu LED H7 Plug and Play dengan output cahaya super bright hingga 6000K white memberikan visibilitas jauh lebih baik dibanding lampu halogen standar.\n\nPemasangan langsung plug and play tanpa modifikasi kelistrikan. Heat sink aluminium built-in untuk pendinginan optimal. Daya rendah hanya 60W per bulb, hemat energi.\n\nUmur panjang hingga 30.000 jam, jauh lebih awet dari lampu halogen. Termasuk sepasang (2 pcs) dengan brightness 12.000 lumens total.",
                'specs' => [['Tipe', 'LED H7'], ['Daya', '60W per bulb'], ['Suhu Warna', '6000K White'], ['Umur', '30.000 jam']],
            ],
            // ===== ALAT OTOMOTIF: SAFETY =====
            [
                'category' => 'safety', 'brand' => 'Safety First',
                'name' => 'Helm Safety Proyek SNI Standard', 'sku' => 'AO-006',
                'price' => 185000, 'sale_price' => null, 'stock' => 40, 'featured' => true,
                'short' => 'Helm safety proyek standar SNI, shell ABS, adjustable suspension.',
                'description' => "Helm Safety Proyek berstandar SNI dengan shell bahan ABS high-impact yang tahan benturan keras. Sistem suspensi 4-point ratchet memberikan perlindungan optimal dan kenyamanan maksimal.\n\nAdjustable size dengan tali pengikat chincup. Ventilasi udara strategis untuk kenyamanan saat bekerja di bawah terik matahari. Available dalam warna kuning, putih, dan orange.\n\nCocok untuk pekerja konstruksi, proyek bangunan, pertambangan, dan aktivitas industri lainnya yang membutuhkan perlindungan kepala.",
                'specs' => [['Material Shell', 'ABS High-Impact'], ['Standar', 'SNI 03-6575-2001'], ['Ukuran', 'Adjustable (54-62 cm)'], ['Suspensi', '4-Point Ratchet']],
            ],
            [
                'category' => 'safety', 'brand' => 'Safety First',
                'name' => 'Sarung Tangan Kerja Anti Slip', 'sku' => 'AO-007',
                'price' => 45000, 'sale_price' => null, 'stock' => 100, 'featured' => false,
                'short' => 'Sarung tangan kerja anti slip, bahan nylon coated latex.',
                'description' => "Sarung Tangan Kerja Anti Slip terbuat dari bahan nylon knit yang ringan dan breathable dengan coating latex pada telapak tangan untuk grip anti slip yang optimal.\n\nCocok untuk pekerjaan bengkel, konstruksi, pergudangan, dan aktivitas yang membutuhkan cengkeraman kuat. Fingersensitive memungkinkan presisi saat menangani objek kecil.\n\nTersedia dalam ukuran M, L, XL. Mudah dicuci dan bisa digunakan berulang kali. Anti debu dan tahan minyak ringan.",
                'specs' => [['Bahan', 'Nylon Knit + Latex Coating'], ['Fitur', 'Anti Slip, Breathable'], ['Ukuran', 'M, L, XL'], ['Penggunaan', 'Bengkel, Konstruksi, Gudang']],
            ],
            // ===== PERALATAN TEKNIKAL: POWER TOOLS =====
            [
                'category' => 'power-tools', 'brand' => 'Bosch',
                'name' => 'Bosch GSB 550 Impact Drill Set', 'sku' => 'PT-001',
                'price' => 525000, 'sale_price' => null, 'stock' => 25, 'featured' => true,
                'short' => 'Impact drill 550W, 0-2800 RPM, chuck 13mm, mode drill + hammer.',
                'description' => "Bosch GSB 550 Impact Drill adalah bor listrik serbaguna dengan daya 550W. Mode impact memungkinkan pengeboran pada beton hingga diameter 13mm. Mode drill untuk kayu dan logam.\n\nKecepatan variabel 0-2800 RPM dengan switch selector kecepatan tinggi/rendah. Chuck keyless 13mm memudahkan penggantian mata bor tanpa kunci.\n\nErgonomis dengan Softgrip handle yang nyaman. Termasuk set mata bor dan tas carry case. Cocok untuk DIY maupun penggunaan profesional ringan.",
                'specs' => [['Daya', '550W'], ['Kecepatan', '0-2800 RPM'], ['Chuck', '13mm Keyless'], ['Mode', 'Drill + Hammer']],
            ],
            [
                'category' => 'power-tools', 'brand' => 'Bosch',
                'name' => 'Mesin Gerinda Tangan Bosch 4 inch', 'sku' => 'PT-002',
                'price' => 750000, 'sale_price' => 675000, 'stock' => 20, 'featured' => false,
                'short' => 'Angle grinder Bosch 4 inch, 840W, 11000 RPM, spindle lock.',
                'description' => "Mesin Gerinda Tangan Bosch GWS 7-125 adalah angle grinder 4 inch (115mm) dengan daya 840W. Kecepatan putar 11000 RPM untuk cutting, grinding, dan polishing yang efisien.\n\nBody slim dan ringan untuk kenyamanan penggunaan lama. Spindle lock memudahkan penggantian disc tanpa kunci. Guard pelindung adjustable dan side handle sudah termasuk.\n\nMotor copper winding tahan panas dan awet. Cocok untuk cutting besi, grinding weld, sharpening, dan polishing metal.",
                'specs' => [['Daya', '840W'], ['Diameter Disc', '115mm (4 inch)'], ['Kecepatan', '11000 RPM'], ['Spindle', 'M10']],
            ],
            [
                'category' => 'power-tools', 'brand' => null,
                'name' => 'Bor Listrik Makita HP1640', 'sku' => 'PT-003',
                'price' => 875000, 'sale_price' => null, 'stock' => 18, 'featured' => false,
                'short' => 'Impact drill Makita 710W, chuck 13mm, variable speed 0-2800 RPM.',
                'description' => "Bor Listrik Makita HP1640 adalah impact drill profesional dengan daya 710W. Mode drill dan hammer untuk pengeboran beton, kayu, dan logam.\n\nKecepatan variable dengan dial speed control 0-2800 RPM. Chuck 3-jaw keyless 13mm. Forward/reverse switch untuk fleksibilitas. Trigger lock button untuk operasi kontinu.\n\nBody ringan hanya 1.7kg dengan ergonomis D-handle yang baik. Cocok untuk contractor, builder, dan DIY enthusiast yang membutuhkan bor reliable dan tahan lama.",
                'specs' => [['Daya', '710W'], ['Chuck', '13mm 3-Jaw Keyless'], ['Kecepatan', '0-2800 RPM'], ['Berat', '1.7 kg']],
            ],
            // ===== PERALATAN TEKNIKAL: MEASURING TOOLS =====
            [
                'category' => 'measuring-tools', 'brand' => null,
                'name' => 'Multimeter Digital Fluke 101', 'sku' => 'PT-004',
                'price' => 850000, 'sale_price' => null, 'stock' => 15, 'featured' => false,
                'short' => 'Multimeter digital True RMS Fluke 101, CAT III 600V rated.',
                'description' => "Multimeter Digital Fluke 101 adalah alat ukur elektronik profesional dengan akurasi tinggi. True RMS measurement untuk pembacaan akurat pada sinyal non-sinusoidal.\n\nMampu mengukur DC/AC voltage hingga 600V, DC/AC current hingga 10A, resistance hingga 40MΩ, kapasitansi, frekuensi, dan temperatur. Auto-ranging dengan hold function.\n\nCAT III 600V safety rated. Backlight display untuk visibilitas di tempat gelap. Compact dan robust, cocok untuk teknisi elektrik dan engineer.",
                'specs' => [['Tipe', 'True RMS Digital'], ['Max Voltage', '600V AC/DC'], ['Max Current', '10A'], ['Safety Rating', 'CAT III 600V']],
            ],
            // ===== PERALATAN TEKNIKAL: ELECTRICAL TOOLS =====
            [
                'category' => 'electrical-tools', 'brand' => null,
                'name' => 'Tang Crimping Wire Stripper Set', 'sku' => 'PT-005',
                'price' => 95000, 'sale_price' => null, 'stock' => 55, 'featured' => false,
                'short' => 'Tang 3-in-1 crimping, cutting, stripping untuk kabel 0.2-6mm².',
                'description' => "Tang Crimping Wire Stripper Set serbaguna 3-in-1 untuk memotong, menstripping, dan mencrimp kabel. Dengan satu alat, semua pekerjaan kabel bisa diselesaikan dengan cepat.\n\nErgonomis dengan handle anti-slip yang nyaman. Pisau potong tajam dari high carbon steel hardness tinggi. Area crimp untuk berbagai ukuran terminal insulated dan non-insulated.\n\nCocok untuk teknisi listrik, elektronik, instalasi jaringan, dan automotive wiring.",
                'specs' => [['Fungsi', 'Crimp, Cut, Strip'], ['Ukuran Kabel', '0.2 - 6 mm²'], ['Handle', 'Anti-slip Rubber'], ['Bahan', 'High Carbon Steel']],
            ],
            // ===== PERALATAN TEKNIKAL: HAND TOOLS =====
            [
                'category' => 'hand-tools-teknikal', 'brand' => 'Bosch',
                'name' => 'Obeng Set Precision 32in1', 'sku' => 'PT-006',
                'price' => 145000, 'sale_price' => null, 'stock' => 65, 'featured' => false,
                'short' => 'Set obeng precision 32 bit, magnetik, untuk elektronik dan gadget.',
                'description' => "Obeng Set Precision 32in1 dilengkapi 32 jenis bit berbeda untuk membongkar perangkat elektronik. Termasuk bit Torx (T3-T15), Phillips (#00-#2), Flat (1.0-3.0mm), Tri-wing, Pentalobe, Spanner, dan lainnya.\n\nHandle magnetik dengan rotating cap untuk kemudahan penggunaan satu tangan. Material bit S2 steel yang keras, tahan lama, dan tidak mudah melengkung.\n\nCocok untuk reparasi smartphone, laptop, konsol game, jam tangan, kacamata, dan perangkat elektronik lainnya. Dilengkapi case penyimpanan.",
                'specs' => [['Jumlah Bit', '32 pcs'], ['Material Bit', 'S2 Steel'], ['Tipe', 'Precision Screwdriver Set'], ['Fitur', 'Magnetic Handle + Rotating Cap']],
            ],
            // ===== PERALATAN TEKNIKAL: MEASURING TOOLS (2) =====
            [
                'category' => 'measuring-tools', 'brand' => 'Bosch',
                'name' => 'Meteran Laser 40m Bosch', 'sku' => 'PT-007',
                'price' => 325000, 'sale_price' => null, 'stock' => 30, 'featured' => true,
                'short' => 'Laser distance meter Bosch 40m, akurasi ±2mm, tripod mount.',
                'description' => "Meteran Laser 40m Bosch mengukur jarak dengan akurasi tinggi ±2mm menggunakan teknologi laser merah. Jangkauan hingga 40 meter untuk pengukuran indoor maupun outdoor.\n\nFitur pengukuran luas dan volume otomatis. Memory untuk menyimpan 30 hasil pengukuran terakhir. LCD backlight untuk visibilitas di tempat gelap.\n\nMounting tripod di bagian bawah untuk pengukuran yang stabil. Auto power off untuk hemat baterai. Termasuk baterai AAA dan pouch.",
                'specs' => [['Jangkauan', '0.05 - 40 meter'], ['Akurasi', '±2mm'], ['Memory', '30 values'], ['Display', 'LCD Backlight']],
            ],
        ];

        $now = now();

        foreach ($products as $data) {
            $categoryId = $cat($data['category']);
            $brandId = $brand($data['brand']);

            if (!$categoryId) {
                $this->command?->warn("Category '{$data['category']}' not found, skipping: {$data['name']}");
                continue;
            }

            $stock = $data['stock'];
            $stockStatus = match (true) {
                $stock === 0 => 'out_of_stock',
                $stock <= 5 => 'low_stock',
                default => 'available',
            };

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
                'stock' => $stock,
                'low_stock_threshold' => 5,
                'stock_status' => $stockStatus,
                'weight' => null,
                'length' => null,
                'width' => null,
                'height' => null,
                'seo_title' => $data['name'] . ' - Beli Online | Aerta Taru',
                'meta_description' => $data['short'] . ' Harga terbaik di Aerta Taru.',
                'canonical_url' => null,
                'is_featured' => $data['featured'],
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

        $this->command?->info('Products seeded: ' . Product::count());
    }
}
