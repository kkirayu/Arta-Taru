import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
  Download, TrendingUp, ShoppingBag, Wallet, Package, Users, BarChart3, PieChart,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { formatPrice, formatNumber, formatShortDate } from '@/lib/format';
import type { AdminReportsProps } from '@/types';

export default function ReportsIndex({
  summary,
  daily,
  top_products,
  by_category,
  status_breakdown,
  filters,
}: AdminReportsProps) {
  const [from, setFrom] = useState(filters.from);
  const [to, setTo] = useState(filters.to);

  const apply = () => {
    router.get('/admin/reports', { from, to }, { preserveState: true, replace: true });
  };

  const exportUrl = `/admin/reports/export?from=${filters.from}&to=${filters.to}`;

  const cards = [
    { label: 'Omzet', value: formatPrice(summary.revenue), icon: Wallet, color: 'bg-green-50 text-green-600' },
    { label: 'Order Dibayar', value: formatNumber(summary.paid_orders), icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Order', value: formatNumber(summary.orders), icon: TrendingUp, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Rata-rata Order', value: formatPrice(summary.average_order_value), icon: BarChart3, color: 'bg-amber-50 text-amber-600' },
    { label: 'Item Terjual', value: formatNumber(summary.items_sold), icon: Package, color: 'bg-purple-50 text-purple-600' },
    { label: 'Pelanggan Baru', value: formatNumber(summary.new_customers), icon: Users, color: 'bg-cyan-50 text-cyan-600' },
  ];

  const maxRevenue = Math.max(1, ...daily.map((d) => Number(d.revenue)));

  return (
    <AdminLayout>
      <Head title="Laporan" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
            <p className="text-sm text-gray-500 mt-1">
              Periode {formatShortDate(filters.from)} – {formatShortDate(filters.to)}
            </p>
          </div>
          <a
            href={exportUrl}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" /> Ekspor CSV
          </a>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Dari tanggal</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sampai tanggal</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <button onClick={apply} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            Terapkan
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {cards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Omzet Harian</h2>
            </div>
            <div className="p-5">
              {daily.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Belum ada data pada periode ini.</p>
              ) : (
                <div className="flex items-end gap-1.5 h-52 overflow-x-auto pb-2">
                  {daily.map((stat) => {
                    const height = Math.max(4, Math.round((Number(stat.revenue) / maxRevenue) * 180));
                    return (
                      <div key={stat.id} className="flex flex-col items-center gap-1 min-w-[24px] flex-1 group">
                        <div className="relative w-full flex justify-center">
                          <div
                            className="w-full max-w-[28px] bg-blue-500 hover:bg-blue-600 rounded-t transition-colors"
                            style={{ height }}
                            title={`${formatShortDate(stat.date)}: ${formatPrice(stat.revenue)}`}
                          />
                        </div>
                        <span className="text-[9px] text-gray-400 whitespace-nowrap">
                          {new Date(stat.date).getDate()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Status Pesanan</h2>
            </div>
            <div className="p-5 space-y-2.5">
              {Object.entries(status_breakdown).length === 0 ? (
                <p className="text-sm text-gray-400">Belum ada pesanan.</p>
              ) : (
                Object.entries(status_breakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 capitalize">{status.replace(/_/g, ' ')}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Produk Terlaris</h2>
            </div>
            {top_products.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-400 text-center">Belum ada penjualan.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {top_products.map((product, i) => (
                  <div key={`${product.product_name}-${i}`} className="px-5 py-3 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.product_name}</p>
                      <p className="text-xs text-gray-500">{product.quantity} terjual</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatPrice(product.revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Penjualan per Kategori</h2>
            </div>
            {by_category.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-400 text-center">Belum ada penjualan.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {by_category.map((category, i) => (
                  <div key={`${category.category}-${i}`} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{category.category}</p>
                      <p className="text-xs text-gray-500">{category.quantity} item</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatPrice(category.revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
