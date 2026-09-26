import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
  Package,
  Eye,
  AlertTriangle,
  FolderTree,
  Tag,
  MessageCircle,
  XCircle,
  EyeOff,
  ArrowUpRight,
} from 'lucide-react';
import type { DashboardProps } from '@/types';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Dashboard({
  stats,
  low_stock_products,
  most_viewed_products,
  most_whatsapp_products,
  latest_products,
  recent_logs,
}: DashboardProps) {
  const kpiCards = [
    { label: 'Total Produk', value: stats.total_products, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Produk Aktif', value: stats.active_products, icon: Eye, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Stok Rendah', value: stats.low_stock, icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Total Kategori', value: stats.total_categories, icon: FolderTree, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Brands', value: stats.total_brands, icon: Tag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'WhatsApp Klik', value: stats.whatsapp_clicks, icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Stok Habis', value: stats.out_of_stock, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Produk Hidden', value: stats.hidden_products, icon: EyeOff, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  return (
    <AdminLayout>
      <Head title="Dashboard" />

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpiCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {low_stock_products.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Stok Rendah</h2>
                <Link href="/admin/inventory" className="text-sm text-blue-600 hover:text-blue-700">
                  Lihat Semua
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Produk</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Stok</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {low_stock_products.slice(0, 5).map((product) => (
                      <tr key={product.id} className="border-b border-gray-50">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.sku}</p>
                        </td>
                        <td className="px-5 py-3 text-gray-900">{product.stock}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Stok Rendah
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {most_viewed_products.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Paling Dilihat</h2>
                <Link href="/admin/analytics" className="text-sm text-blue-600 hover:text-blue-700">
                  Lihat Semua
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Produk</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Harga</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Stok</th>
                    </tr>
                  </thead>
                  <tbody>
                    {most_viewed_products.slice(0, 5).map((product) => (
                      <tr key={product.id} className="border-b border-gray-50">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.sku}</p>
                        </td>
                        <td className="px-5 py-3 text-gray-900">
                          {formatPrice(product.effective_price ?? product.sale_price ?? product.price)}
                        </td>
                        <td className="px-5 py-3 text-gray-900">{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {most_whatsapp_products.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Paling Diklik WhatsApp</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Produk</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Harga</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {most_whatsapp_products.slice(0, 5).map((product) => (
                      <tr key={product.id} className="border-b border-gray-50">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                        </td>
                        <td className="px-5 py-3 text-gray-900">
                          {formatPrice(product.effective_price ?? product.sale_price ?? product.price)}
                        </td>
                        <td className="px-5 py-3">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                          >
                            Lihat <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {latest_products.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Produk Terbaru</h2>
                <Link href="/admin/products" className="text-sm text-blue-600 hover:text-blue-700">
                  Lihat Semua
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Produk</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Harga</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latest_products.slice(0, 5).map((product) => (
                      <tr key={product.id} className="border-b border-gray-50">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.sku}</p>
                        </td>
                        <td className="px-5 py-3 text-gray-900">
                          {formatPrice(product.effective_price ?? product.sale_price ?? product.price)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              product.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {product.is_active ? 'Aktif' : 'Hidden'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {recent_logs.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Aktivitas Terbaru</h2>
              <Link href="/admin/activity-logs" className="text-sm text-blue-600 hover:text-blue-700">
                Lihat Semua
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Waktu</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">User</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Aksi</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Subjek</th>
                  </tr>
                </thead>
                <tbody>
                  {recent_logs.slice(0, 10).map((log) => (
                    <tr key={log.id} className="border-b border-gray-50">
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {new Date(log.created_at).toLocaleString('id-ID')}
                      </td>
                      <td className="px-5 py-3 text-gray-900">{log.user?.name || '-'}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {log.subject_type ? `${log.subject_type.split('\\').pop()} #${log.subject_id}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
