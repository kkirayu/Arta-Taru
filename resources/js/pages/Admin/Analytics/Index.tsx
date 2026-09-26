import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { BarChart3, Eye, Search, MessageCircle } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { AnalyticsProps } from '@/types';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function BarChart({ data, label }: { data: { date: string; count: number }[]; label: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{label}</h3>
      <div className="flex items-end gap-1 h-40">
        {data.length > 0 ? (
          data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{item.count}</span>
              <div
                className="w-full bg-blue-500 rounded-t min-h-[2px]"
                style={{ height: `${(item.count / max) * 100}%` }}
              />
              <span className="text-[10px] text-gray-400 truncate w-full text-center">
                {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
            Tidak ada data
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsIndex({ summary, daily_views, daily_whatsapp, popular_products, popular_searches }: AnalyticsProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleFilter = () => {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;
    router.get('/admin/analytics', params, { preserveState: true, replace: true });
  };

  return (
    <AdminLayout>
      <Head title="Analytics" />

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

        <div className="flex items-center gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Dari</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sampai</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <button
            onClick={handleFilter}
            className="mt-5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total Views</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary.total_views.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Search className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Total Pencarian</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary.total_searches.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-500">WhatsApp Klik</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{summary.total_whatsapp.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart data={daily_views} label="Views Harian" />
          <BarChart data={daily_whatsapp} label="WhatsApp Klik Harian" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {popular_products.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-5 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Produk Populer</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Produk</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popular_products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-50">
                        <td className="px-5 py-3 text-gray-900">{product.name}</td>
                        <td className="px-5 py-3 text-gray-500">
                          {formatPrice(product.effective_price ?? product.sale_price ?? product.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {popular_searches.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-5 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Pencarian Populer</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Kata Kunci</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popular_searches.map((item, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="px-5 py-3 text-gray-900">{item.term}</td>
                        <td className="px-5 py-3 text-gray-500">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
