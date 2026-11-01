import { Head, Link, router } from '@inertiajs/react';
import { Package, ChevronRight, Filter } from 'lucide-react';
import AccountLayout from '@/layouts/AccountLayout';
import { formatDate, formatPrice, orderStatusClasses } from '@/lib/format';
import type { AccountOrdersProps } from '@/types';

export default function AccountOrders({ orders, statuses, filters }: AccountOrdersProps) {
  const setStatus = (status: string) => {
    router.get('/akun/pesanan', status ? { status } : {}, { preserveState: true, replace: true });
  };

  return (
    <AccountLayout title="Pesanan Saya" description="Semua pesanan yang pernah Anda buat.">
      <Head title="Pesanan Saya" />

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <button
            onClick={() => setStatus('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${!filters.status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Semua
          </button>
          {Object.entries(statuses).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setStatus(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${filters.status === value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {orders.data.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-4">Belum ada pesanan pada filter ini.</p>
          <Link href="/katalog" className="inline-block px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl">Mulai Belanja</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.data.map((order) => (
            <Link
              key={order.id}
              href={`/akun/pesanan/${order.order_number}`}
              className="block bg-white rounded-2xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{order.order_number}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.created_at)} · {order.items_count ?? 0} produk</p>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{formatPrice(order.grand_total)}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${orderStatusClasses[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {order.status_label || order.status}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            </Link>
          ))}

          {orders.last_page > 1 && (
            <div className="flex items-center justify-center gap-1 pt-2">
              {orders.prev_page_url && (
                <Link href={orders.prev_page_url} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50">Sebelumnya</Link>
              )}
              <span className="px-3 py-2 text-xs text-gray-500">Halaman {orders.current_page} dari {orders.last_page}</span>
              {orders.next_page_url && (
                <Link href={orders.next_page_url} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50">Berikutnya</Link>
              )}
            </div>
          )}
        </div>
      )}
    </AccountLayout>
  );
}
