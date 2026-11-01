# Toko Arta Taru — Admin Standard Operating Procedures

> **Language**: Bahasa Indonesia
> **Akses**: `/admin` (harus login sebagai admin/staff)

---

## 1. Dashboard & Ringkasan Harian

- **URL**: `/admin`
- **Fungsi**: Melihat ringkasan omzet, pesanan, pelanggan baru, item terjual
- **Data diambil dari**: tabel `daily_stats` (diagregasi harian via cron)
- **Refresh**: Otomatis setiap hari jam 02:00 UTC via cron job

---

## 2. Manajemen Pesanan (`/admin/orders`)

### 2.1 Daftar Pesanan
- **Filter**: Status, Status Pembayaran, Tanggal, Pencarian (nomor/nama/email/telepon)
- **Ekspor CSV**: Tombol "Ekspor CSV" → unduh laporan pesanan
- **Badge Notifikasi**: Lonceng di header menampilkan jumlah bukti pembayaran menunggu verifikasi

### 2.2 Detail Pesanan (`/admin/orders/{order_number}`)
**Tabs/Section**:
1. **Produk Dipesan** — daftar item, varian, harga, subtotal
2. **Pembayaran** — daftar bukti transfer, verifikasi/tolak
3. **Pengiriman** — metode (kirim/ambil), kurir, nomor resi, alamat
4. **Riwayat Status** — timeline perubahan status
5. **Sidebar**: Info pelanggan, kontak WhatsApp, catatan

**Aksi Utama**:
| Aksi | Syarat | Deskripsi |
|------|--------|-----------|
| **Verifikasi Pembayaran** | `payment_status = waiting_confirmation` | Ubah status pesanan ke `processing`, stok sudah ter-reserve saat order dibuat |
| **Tolak Pembayaran** | `payment_status = waiting_confirmation` | Isi alasan → pelanggan dapat upload ulang |
| **Kirim Pesanan** | `status = processing` | Isi kurir & nomor resi → status jadi `shipped` |
| **Selesaikan** | `status = shipped` | Status jadi `completed` |
| **Batalkan** | Bukan `completed/cancelled/expired` | Stok dikembalikan otomatis (idempotent via `stock_movements`) |
| **Cetak Invoice** | Kapan saja | Buka `/admin/orders/{order_number}/invoice` → cetak ke PDF |

### 2.3 Alur Status Pesanan
```
pending_payment → waiting_confirmation → processing → shipped → completed
                      ↓ (tolak)              ↓ (batal)      ↓ (batal)
                   pending_payment      cancelled      cancelled
                      ↓ (expire)           ↓ (expire)
                   expired               expired
```

- **Expired**: Dijalankan oleh cron (`OrderService::expireStale()`) — pesanan `pending_payment` > 24 jam (konfigurasi `order_expiry_hours`)

---

## 3. Verifikasi Pembayaran (`/admin/payments`)

- **Default filter**: `status = pending` (menunggu verifikasi)
- **Tabs**: Menunggu / Diverifikasi / Ditolak
- **Aksi per baris**:
  - **Lihat Bukti** → buka bukti transfer di tab baru
  - **Verifikasi** → konfirmasi → pesanan ke `processing`
  - **Tolak** → isi alasan (contoh: "nominal tidak sesuai") → pelanggan notifikasi via email
- **Notifikasi**: Pelanggan dapat email otomatis saat verifikasi/ditolak

---

## 4. Manajemen Pelanggan (`/admin/customers`)

### 4.1 Daftar Pelanggan
- **Kolom**: Nama, Email, Telepon, Jumlah Pesanan, Total Belanja, Tanggal Daftar, Status (Aktif/Nonaktif)
- **Aksi**: Toggle aktif/nonaktif, Lihat detail

### 4.2 Detail Pelanggan (`/admin/customers/{id}`)
- **Ringkasan**: Total pesanan, total belanja, pesanan terakhir
- **Riwayat Pesanan**: Tabel pesanan dengan link ke detail order
- **Alamat Tersimpan**: Daftar alamat (label, penerima, telepon, alamat lengkap, default)

---

## 5. Tarif Ongkir (`/admin/shipping-rates`)

### 5.1 Konsep
- **Flat rate per wilayah**: Provinsi + (opsional) Kota + (opsional) Kecamatan
- **Prioritas pencocokan**: Kecamatan > Kota > Provinsi > Fallback default
- **Gratis ongkir**: Minimal total belanja (`free_shipping_min_total`)
- **Estimasi**: `eta_min_days` – `eta_max_days` hari

### 5.2 CRUD
- **Tambah**: Isi provinsi (wajib), kota, kecamatan, biaya, gratis ongkir min, estimasi, urutan, status aktif
- **Edit**: Klik ikon pensil
- **Hapus**: Klik ikon trash (konfirmasi)
- **Toggle Aktif**: Klik ikon power

### 5.3 Contoh Data (dari seeder)
| Provinsi | Kota | Biaya | Gratis Min | ETA |
|----------|------|-------|------------|-----|
| DKI Jakarta | (semua) | 15.000 | 500.000 | 1-2 |
| Jawa Barat | Bandung | 20.000 | 500.000 | 2-3 |
| Jawa Barat | (lainnya) | 25.000 | 500.000 | 2-4 |
| Bali | (semua) | 45.000 | 1.000.000 | 3-5 |

---

## 6. Manajemen Produk & Varian (`/admin/products`)

### 6.1 Daftar Produk (`/admin/products`)
- Filter: kategori, brand, pencarian
- Aksi: Lihat, Edit, Duplicate, Hapus

### 6.2 Detail Produk (`/admin/products/{id}`)
**Tabs**:
1. **Info Dasar** — nama, slug, SKU, deskripsi, harga, stok, berat, kategori, brand, status
2. **Gambar** — upload (drag & drop), kompres otomatis ≤4 MB, ubah alt text, set primary, hapus
3. **Varian** — manajemen ukuran/warna/stok/harga per varian

### 6.3 Varian Produk
- **Stok produk** = total stok semua varian (otomatis dihitung)
- **Harga varian** opsional — jika diisi, menimpa harga produk
- **Field**: Nama, SKU, Ukuran, Warna, Harga, Stok, Urutan, Aktif
- **Aksi**: Tambah, Edit, Toggle Aktif, Hapus (stok produk dihitung ulang)

### 6.4 Upload Gambar
- **Format**: JPEG, PNG, WebP, GIF
- **Kompresi**: Otomatis di browser (canvas) → max 4 MB, max dimensi 1600px
- **Primary**: Gambar pertama = primary, bisa diubah via bintang
- **Disk**: `product_disk` (default `s3` di production)

---

## 7. Laporan (`/admin/reports`)

### 7.1 Filter Periode
- Default: 30 hari terakhir
- Pilih "Dari tanggal" & "Sampai tanggal" → Terapkan

### 7.2 Kartu Ringkasan
- Omzet, Order Dibayar, Total Order, Rata-rata Order, Item Terjual, Pelanggan Baru

### 7.3 Grafik & Tabel
- **Omzet Harian**: Bar chart (data dari `daily_stats`)
- **Status Pesanan**: Breakdown count per status
- **Produk Terlaris**: Top 10 by quantity & revenue
- **Penjualan per Kategori**: Revenue & quantity per kategori

### 7.4 Ekspor
- Tombol "Ekspor CSV" → unduh laporan lengkap

---

## 8. Moderasi Ulasan (`/admin/reviews`)

- **Tabs**: Semua / Menunggu / Disetujui
- **Filter Rating**: 1-5 bintang
- **Aksi**:
  - **Setujui** → tampil di halaman produk
  - **Hapus** → hapus permanen
- **Info**: Nama reviewer, rating, produk, komentar, tanggal, user (jika login)

---

## 9. Pengguna Back-Office (`/admin/users`)

> **Hanya Super Admin** yang bisa tambah/edit/hapus

- **Role**: Super Admin / Admin / Staff
- **Staff**: Akses kelola pesanan, pembayaran, pelanggan, laporan, ulasan, pengiriman
- **Admin**: Staff + kelola pengguna, produk, pengaturan
- **Super Admin**: Full access + kelola role pengguna lain

---

## 10. Pengaturan Toko (`/admin/settings`)

Grup pengaturan:
- **Toko**: Nama, telepon, alamat, jam operasional, nomor WhatsApp, template inquiry
- **SEO**: Judul situs, deskripsi, gambar OG default
- **Sosial Media**: Instagram, Facebook, YouTube URL
- **Pembayaran**: Rekening bank (BCA, Mandiri, dll.) — diedit via seeder/manual DB
- **Kebijakan**: Pengembalian, Privasi, Syarat & Ketentuan
- **FAQ**: Pertanyaan & jawaban umum

**Simpan**: Tombol "Simpan Perubahan" → clear cache `store_settings.v1`

---

## 11. Cron Job & Maintenance

### 11.1 Cron Internal (Vercel)
- **Endpoint**: `GET /api/cron/tick?token=CRON_SECRET`
- **Jadwal**: Harian jam 02:00 UTC (9 AM WIB)
- **Tugas**:
  - `OrderService::expireStale(50)` — expire pesanan pending > 24 jam
  - Agregasi `daily_stats` untuk dashboard

### 11.2 Cron Eksternal (cron-job.org) — Direkomendasikan
- **Interval**: Setiap 5 menit
- **URL**: `https://domain.vercel.app/api/cron/tick?token=CRON_SECRET`
- **Tujuan**: Backup jika Vercel cron gagal, expire lebih responsif

### 11.3 Maintenance Rutin
| Frekuensi | Tugas |
|-----------|-------|
| Harian | Cek dashboard omzet, pesanan pending pembayaran |
| Mingguan | Cek stok produk (stok ≤ 5), review ulasan pending |
| Bulanan | Ekspor laporan penjualan, backup database TiDB |

---

## 12. Troubleshooting Umum

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| Pesanan tidak expire | Cron tidak jalan | Cek Vercel Function logs, pastikan `CRON_SECRET` benar |
| Gambar produk tidak tampil | S3 config salah | Cek `AWS_BUCKET`, `AWS_URL`, CORS bucket |
| Bukti transfer 403 | Private bucket policy | Pastikan `s3_private` disk config benar, signed URL |
| Email tidak terkirim | SMTP config | Cek `MAIL_*` env vars, test via `php artisan tinker` → `Mail::raw(...)` |
| Error 9007 TiDB | Koneksi drop idle | App sudah retry otomatis; pastikan `MYSQL_ATTR_SSL_CA` benar |
| Upload gagal "File terlalu besar" | > 4 MB | Frontend kompres otomatis; pastikan `upload_max_filesize=4M` |

---

## 13. Keamanan & Akses

- **Password Admin Default** (seeder): `password` — **GANTI SEGERA SETELAH DEPLOY**
- **2FA**: Tersedia untuk user (opsional)
- **Session**: Database driver, timeout 2 jam (config `session.lifetime`)
- **CSRF**: Otomatis di form Inertia
- **Rate Limit**: Login/throttle via Laravel default

---

## 14. Rollback & Recovery

### Rollback Deploy Vercel
```bash
vercel rollback <deployment-url> --token=$VERCEL_TOKEN
# Atau: Dashboard → Deployments → ⋮ → Promote to Production
```

### Database Backup (TiDB Cloud)
- TiDB Cloud Starter: Backup otomatis harian (retensi 7 hari)
- Manual backup: Console TiDB → Backup & Restore → Create Backup

### Restore Procedure
1. Buat cluster baru dari backup
2. Update `DB_HOST`, `DB_PASSWORD` di Vercel env vars
3. Redeploy

---

## 15. Kontak Darurat

- **Developer**: [Nama] — [Email/WA]
- **Vercel Support**: https://vercel.com/support
- **TiDB Cloud Support**: https://docs.pingcap.com/tidbcloud/support
- **S3 Provider**: AWS Support / Cloudflare Dashboard

---

*Dokumen ini diperbarui terakhir: 2026-11-01*
*Versi: 1.0*