import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Download, ShoppingCart, ChevronRight, Clock } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import { formatDate, formatPrice, orderStatusClasses, paymentStatusClasses } from '@/lib/format';
import type { AdminOrdersProps } from '@/types';

export default function OrdersIndex({
  orders,
  statuses,
  payment_statuses,
  counts,
  filters,
  pending_payments,
}: AdminOrdersProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [from, setFrom] = useState(filters.from || '');
  const [to, setTo] = useState(filters.to || '');

  const buildParams = (overrides: Record<string, string> = {}) => {
    const params: Record<string, string> = {};
    const values = {
      status: filters.status || '',
      payment_status: filters.payment_status || '',
      search,
      from,
      to,
      ...overrides,
    };
    Object.entries(values).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    return params;
  };

  const apply = (overrides: Record<string, string> = {}) => {
    router.get('/admin/orders', buildParams(overrides), { preserveState: true, replace: true });
  };

  const resetFilters = () => {
    setSearch('');
    setFrom('');
    setTo('');
    router.get('/admin/orders', {}, { preserveState: true, replace: true });
  };

  const exportUrl = `/admin/orders/export?${new URLSearchParams(buildParams()).toString()}`;

  return (
    <AdminLayout>
      <Head title="Pesanan" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pesanan</h1>
            <p className="text-sm text-gray-500 mt-1">Pantau dan proses pesanan pelanggan.</p>
          </div>
          <a
            href={exportUrl}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" /> Ekspor CSV
          </a>
        </div>

        {pending_payments > 0 && (
          <Link
            href="/admin/payments"
            className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 hover:bg-amber-100 transition-colors"
          >
            <Clock className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">
              Ada <strong>{pending_payments}</strong> bukti pembayaran menunggu verifikasi.
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}

        {/* Status tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => apply({ status: '' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              !filters.status ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Semua ({Object.values(counts || {}).reduce((a, b) => a + Number(b), 0)})
          </button>
          {Object.entries(statuses).map(([value, label]) => (
            <button
              key={value}
              onClick={() => apply({ status: value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                filters.status === value ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label} ({counts?.[value] ?? 0})
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  apply();
                }}
                className="relative w-full lg:w-72"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nomor, nama, email, telepon..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </form>
              <select
                value={filters.payment_status || ''}
                onChange={(e) => apply({ payment_status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="">Semua Pembayaran</option>
                {Object.entries(payment_statuses).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                aria-label="Dari tanggal"
              />
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                aria-label="Sampai tanggal"
              />
              <button
                onClick={() => apply()}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
              >
                Terapkan
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>

          {orders.data.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Tidak ada pesanan pada filter ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Nomor</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Pelanggan</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Tanggal</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Total</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Pembayaran</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.data.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${order.order_number}`} className="font-medium text-blue-600 hover:underline">
                          {order.order_number}
                        </Link>
                        <p className="text-xs text-gray-400">{order.items_count ?? 0} item</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{order.customer_phone}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-600">{formatDate(order.created_at)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(order.grand_total)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border ${orderStatusClasses[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                          {order.status_label || statuses[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border ${paymentStatusClasses[order.payment_status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                          {order.payment_status_label || payment_statuses[order.payment_status] || order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/orders/${order.order_number}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                        >
                          Detail <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {orders.last_page > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination
                currentPage={orders.current_page}
                lastPage={orders.last_page}
                onPageChange={(page) => apply({ page: String(page) })}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
