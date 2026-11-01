import { Head, useForm } from '@inertiajs/react';
import { Search, Truck, Receipt, Mail } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import type { TrackProps } from '@/types';

export default function OrderTrack({ order_number, email }: TrackProps) {
  const { data, setData, post, processing, errors } = useForm({
    order_number: order_number || '',
    contact: email || '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/lacak-pesanan');
  };

  return (
    <PublicLayout>
      <Head title="Lacak Pesanan" />
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="max-w-lg mx-auto px-4 py-12">
          <div className="text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Truck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Lacak Pesanan</h1>
            <p className="text-sm text-gray-500 mt-1">Masukkan nomor pesanan dan email/WhatsApp yang digunakan saat checkout.</p>
          </div>

          <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Pesanan</label>
              <div className="relative">
                <Receipt className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={data.order_number}
                  onChange={(e) => setData('order_number', e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="AT-20261101-0001"
                  required
                />
              </div>
              {errors.order_number && <p className="text-xs text-red-600 mt-1">{errors.order_number}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email / Nomor WhatsApp</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={data.contact}
                  onChange={(e) => setData('contact', e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="nama@email.com atau 08xxxxxxxxxx"
                  required
                />
              </div>
              {errors.contact && <p className="text-xs text-red-600 mt-1">{errors.contact}</p>}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60"
            >
              <Search className="w-4 h-4" /> {processing ? 'Mencari...' : 'Lacak Pesanan'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Nomor pesanan dikirim ke email Anda setelah checkout.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
