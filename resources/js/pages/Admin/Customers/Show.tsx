import { Head, Link, router } from '@inertiajs/react';
import {
  ArrowLeft, User as UserIcon, Mail, Phone, MapPin, Package, Wallet,
  ShoppingBag, Calendar, UserCheck, UserX, ChevronRight,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import { formatDate, formatPrice, orderStatusClasses } from '@/lib/format';
import type { AdminCustomerShowProps } from '@/types';

export default function CustomerShow({ customer, orders, summary }: AdminCustomerShowProps) {
  const toggleActive = () => {
    if (!confirm(customer.is_active === false ? 'Aktifkan akun ini?' : 'Nonaktifkan akun ini?')) return;
    router.post(`/admin/customers/${customer.id}/toggle-active`, {}, { preserveScroll: true });
  };

  const cards = [
    { label: 'Total Pesanan', value: summary.orders_count, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Belanja', value: formatPrice(summary.total_spent), icon: Wallet, color: 'bg-green-50 text-green-600' },
    { label: 'Pesanan Terakhir', value: summary.last_order_at ? formatDate(summary.last_order_at, false) : '-', icon: Calendar, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <AdminLayout>
      <Head title={customer.name} />

      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <Link href="/admin/customers" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke pelanggan
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                customer.is_active === false ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {customer.is_active === false ? 'Nonaktif' : 'Aktif'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Terdaftar {formatDate(customer.created_at, false)}</p>
          </div>
          <button
            onClick={toggleActive}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg ${
              customer.is_active === false
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'border border-red-200 text-red-600 hover:bg-red-50'
            }`}
          >
            {customer.is_active === false ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
            {customer.is_active === false ? 'Aktifkan Akun' : 'Nonaktifkan Akun'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              <Package className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Riwayat Pesanan</h2>
            </div>

            {orders.data.length === 0 ? (
              <p className="px-5 py-10 text-sm text-gray-400 text-center">Belum ada pesanan.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.data.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.order_number}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)} · {order.items_count ?? 0} item</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatPrice(order.grand_total)}</p>
                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${orderStatusClasses[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                          {order.status_label || order.status}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {orders.last_page > 1 && (
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  currentPage={orders.current_page}
                  lastPage={orders.last_page}
                  onPageChange={(page) => router.get(`/admin/customers/${customer.id}`, { page: String(page) }, { preserveState: true, replace: true })}
                />
              </div>
            )}
          </div>

          <div className="space-y-5">
            <section className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-400" /> Kontak
              </h2>
              <p className="text-xs text-gray-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {customer.email}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1.5"><Phone className="w-3.5 h-3.5" /> {customer.phone || '-'}</p>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Alamat Tersimpan
              </h2>
              {(customer.addresses || []).length === 0 ? (
                <p className="text-xs text-gray-400">Belum ada alamat tersimpan.</p>
              ) : (
                <div className="space-y-3">
                  {(customer.addresses || []).map((address) => (
                    <div key={address.id} className="text-sm text-gray-600 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <p className="font-medium text-gray-900 flex items-center gap-1.5">
                        {address.label}
                        {address.is_default && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">Utama</span>
                        )}
                      </p>
                      <p className="text-xs mt-0.5">{address.recipient_name} · {address.phone}</p>
                      <p className="text-xs mt-0.5 leading-relaxed">
                        {address.full_address || `${address.address_line}, ${address.city}, ${address.province}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
