import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Store, Truck, MapPin, User as UserIcon, Mail, Phone, FileText, AlertCircle, ArrowRight, Package, Building2 } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import { formatPrice } from '@/lib/format';
import type { CheckoutProps } from '@/types';

export default function CheckoutIndex({
  cart,
  destinations,
  rates,
  bank_accounts,
  default_address,
  customer,
  settings,
}: CheckoutProps) {
  const [courier] = useState('');

  const { data, setData, post, processing, errors } = useForm({
    name: default_address?.recipient_name || customer?.name || '',
    email: customer?.email || '',
    phone: default_address?.phone || customer?.phone || '',
    shipping_method: 'delivery' as 'delivery' | 'pickup',
    address_line: default_address?.address_line || '',
    province: default_address?.province || '',
    city: default_address?.city || '',
    district: default_address?.district || '',
    postal_code: default_address?.postal_code || '',
    shipping_courier: courier,
    notes: '',
    save_address: !!customer,
  });

  const cities = useMemo(() => {
    const match = destinations.find((d) => d.province === data.province);
    return match?.cities ?? [];
  }, [destinations, data.province]);

  const shipping = useMemo(() => {
    if (data.shipping_method === 'pickup') {
      return { cost: 0, label: 'Ambil di toko', eta: 'Siap diambil setelah pembayaran diverifikasi' };
    }

    const cityRate = rates.find((r) => r.province === data.province && r.city === data.city);
    const provinceRate = rates.find((r) => r.province === data.province && r.city === null);
    const rate = cityRate || provinceRate;

    if (!rate) {
      return { cost: 0, label: 'Belum tersedia', eta: '' };
    }

    const threshold = rate.free_shipping_min_total ?? settings.free_shipping_min_total ?? null;
    const free = threshold !== null && cart.subtotal >= threshold;

    return {
      cost: free ? 0 : rate.cost,
      label: free ? 'Gratis ongkir' : rate.eta_label,
      eta: rate.eta_label,
    };
  }, [data.shipping_method, data.province, data.city, rates, cart.subtotal, settings.free_shipping_min_total]);

  const estimatedTotal = cart.subtotal + shipping.cost;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/checkout');
  };

  const error = (key: string) => (errors as Record<string, string>)[key];

  if (cart.items.length === 0) {
    return (
      <PublicLayout>
        <Head title="Checkout" />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Keranjang kosong</h1>
          <p className="text-sm text-gray-500 mb-6">Tambahkan produk terlebih dahulu sebelum checkout.</p>
          <Link href="/katalog" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl">
            Lihat Katalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Head title="Checkout" />
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-500 mt-1">Lengkapi data pengiriman dan pilih metode pembayaran transfer bank.</p>
          </div>

          <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Contact */}
              <section className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-gray-400" /> Data Pembeli
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Penerima *</label>
                    <input
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Nama lengkap"
                      required
                    />
                    {error('name') && <p className="text-xs text-red-600 mt-1">{error('name')}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor WhatsApp *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="08xxxxxxxxxx"
                        required
                      />
                    </div>
                    {error('phone') && <p className="text-xs text-red-600 mt-1">{error('phone')}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="nama@email.com"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Bukti pesanan dan update status dikirim ke email ini.</p>
                    {error('email') && <p className="text-xs text-red-600 mt-1">{error('email')}</p>}
                  </div>
                </div>
              </section>

              {/* Shipping */}
              <section className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400" /> Metode Pengiriman
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <button
                    type="button"
                    onClick={() => setData('shipping_method', 'delivery')}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-colors ${
                      data.shipping_method === 'delivery' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Truck className={`w-5 h-5 mt-0.5 ${data.shipping_method === 'delivery' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Kirim ke Alamat</p>
                      <p className="text-xs text-gray-500 mt-0.5">Ongkir sesuai wilayah tujuan</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setData('shipping_method', 'pickup')}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-colors ${
                      data.shipping_method === 'pickup' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Store className={`w-5 h-5 mt-0.5 ${data.shipping_method === 'pickup' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Ambil di Toko</p>
                      <p className="text-xs text-gray-500 mt-0.5">Tanpa biaya pengiriman</p>
                    </div>
                  </button>
                </div>

                {data.shipping_method === 'pickup' ? (
                  <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
                    <p className="font-medium text-gray-900 flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-gray-400" /> {settings.store_name}
                    </p>
                    <p>{settings.store_address}</p>
                    <p className="text-xs text-gray-500 mt-1">{settings.store_hours}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Provinsi *</label>
                      <select
                        value={data.province}
                        onChange={(e) => {
                          setData('province', e.target.value);
                          setData('city', '');
                        }}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      >
                        <option value="">Pilih provinsi</option>
                        {destinations.map((d) => (
                          <option key={d.province} value={d.province}>{d.province}</option>
                        ))}
                      </select>
                      {error('province') && <p className="text-xs text-red-600 mt-1">{error('province')}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Kota / Kabupaten *</label>
                      <select
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        disabled={!data.province}
                        required
                      >
                        <option value="">Pilih kota/kabupaten</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {error('city') && <p className="text-xs text-red-600 mt-1">{error('city')}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Kecamatan</label>
                      <input
                        value={data.district}
                        onChange={(e) => setData('district', e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Opsional"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Kode Pos</label>
                      <input
                        value={data.postal_code}
                        onChange={(e) => setData('postal_code', e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Opsional"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat Lengkap *</label>
                      <textarea
                        value={data.address_line}
                        onChange={(e) => setData('address_line', e.target.value)}
                        rows={3}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Nama jalan, nomor rumah, RT/RW, patokan"
                        required
                      />
                      {error('address_line') && <p className="text-xs text-red-600 mt-1">{error('address_line')}</p>}
                    </div>
                    {customer && (
                      <label className="sm:col-span-2 flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={data.save_address}
                          onChange={(e) => setData('save_address', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Simpan alamat ini sebagai alamat utama
                      </label>
                    )}
                  </div>
                )}
              </section>

              {/* Notes */}
              <section className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" /> Catatan Pesanan
                </h2>
                <textarea
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Contoh: warna cadangan, jam pengiriman, atau instruksi khusus (opsional)"
                />
                {error('notes') && <p className="text-xs text-red-600 mt-1">{error('notes')}</p>}
              </section>

              {/* Payment info */}
              <section className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" /> Pembayaran
                </h2>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 mb-4">
                  <p className="font-medium">Transfer bank manual</p>
                  <p className="text-xs mt-1">
                    Setelah checkout, transfer sesuai nominal dan unggah bukti transfer. Pesanan akan diproses setelah admin memverifikasi
                    pembayaran dalam batas {settings.payment_expiry_hours} jam.
                  </p>
                </div>
                <div className="space-y-2">
                  {bank_accounts.map((bank, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                      <div>
                        <p className="font-semibold text-gray-900">{bank.bank}</p>
                        <p className="text-xs text-gray-500">a.n. {bank.account_name}</p>
                      </div>
                      <span className="font-mono text-sm text-gray-700">{bank.account_number}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:sticky lg:top-24">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h2>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-gray-200" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 line-clamp-2">{item.product_name}</p>
                        {item.variant_label && <p className="text-[11px] text-gray-400">{item.variant_label}</p>}
                        <p className="text-[11px] text-gray-500">{item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <span className="text-xs font-semibold text-gray-900">{formatPrice(item.line_total)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{data.shipping_method === 'pickup' ? 'Ambil di toko' : 'Ongkir'}</span>
                    <span className={`font-medium ${shipping.cost === 0 ? 'text-green-600' : ''}`}>
                      {shipping.cost === 0 ? (data.shipping_method === 'pickup' ? 'Gratis' : shipping.label) : formatPrice(shipping.cost)}
                    </span>
                  </div>
                  {data.shipping_method === 'delivery' && shipping.label === 'Belum tersedia' && (
                    <p className="text-xs text-red-600 flex items-start gap-1">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5" /> Ongkir wilayah ini belum tersedia. Hubungi toko.
                    </p>
                  )}
                  <div className="flex justify-between text-gray-400 text-xs">
                    <span>Kode unik</span>
                    <span>Ditambahkan otomatis</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-baseline">
                  <span className="text-sm text-gray-500">Perkiraan total</span>
                  <span className="text-lg font-bold text-gray-900">{formatPrice(estimatedTotal)}</span>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {processing ? 'Memproses...' : 'Buat Pesanan'} <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-gray-400 text-center mt-3 leading-relaxed">
                  Dengan menekan tombol ini, Anda menyetujui{' '}
                  <Link href="/syarat-ketentuan" className="underline">syarat & ketentuan</Link>.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PublicLayout>
  );
}
