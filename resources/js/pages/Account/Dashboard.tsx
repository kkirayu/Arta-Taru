import { Head, Link } from '@inertiajs/react';
import { Package, Heart, Wallet, Clock, ChevronRight, MapPin, User as UserIcon } from 'lucide-react';
import AccountLayout from '@/layouts/AccountLayout';
import { formatDate, formatPrice, orderStatusClasses } from '@/lib/format';
import type { AccountDashboardProps } from '@/types';

export default function AccountDashboard({ summary, recent_orders, default_address }: AccountDashboardProps) {
  const cards = [
    { label: 'Total Pesanan', value: summary.orders_count, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pesanan Aktif', value: summary.active_orders, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Wishlist', value: summary.wishlist_count, icon: Heart, color: 'bg-red-50 text-red-600' },
    { label: 'Total Belanja', value: formatPrice(summary.total_spent), icon: Wallet, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <AccountLayout title="Akun Saya" description="Ringkasan aktivitas belanja Anda.">
      <Head title="Akun Saya" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${card.color}`}>
              <card.icon className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Pesanan Terakhir</h2>
            <Link href="/akun/pesanan" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              Lihat semua <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {recent_orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Belum ada pesanan.</p>
              <Link href="/katalog" className="inline-block mt-3 text-sm text-blue-600 hover:underline">Mulai belanja</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recent_orders.map((order) => (
                <Link key={order.id} href={`/akun/pesanan/${order.order_number}`} className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.created_at)} · {order.items_count ?? 0} item</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatPrice(order.grand_total)}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${orderStatusClasses[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {order.status_label || order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Alamat Utama
              </h2>
              <Link href="/akun/alamat" className="text-xs text-blue-600 hover:underline">Kelola</Link>
            </div>
            {default_address ? (
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{default_address.recipient_name}</p>
                <p className="text-xs mt-0.5">{default_address.phone}</p>
                <p className="text-xs mt-1 leading-relaxed">{default_address.full_address || default_address.address_line}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Belum ada alamat tersimpan.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <UserIcon className="w-4 h-4 text-gray-400" /> Profil
            </h2>
            <Link href="/akun/profil" className="text-sm text-blue-600 hover:underline">Ubah data profil</Link>
            <br />
            <Link href="/akun/password" className="hidden" aria-hidden="true">.</Link>
            <Link href="/lacak-pesanan" className="text-sm text-gray-500 hover:text-blue-600 mt-2 inline-block">Lacak pesanan tamu</Link>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
