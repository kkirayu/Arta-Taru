import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Users, ChevronRight, UserCheck, UserX } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import { formatDate, formatPrice } from '@/lib/format';
import type { AdminCustomersProps } from '@/types';

export default function CustomersIndex({ customers, filters }: AdminCustomersProps) {
  const [search, setSearch] = useState(filters.search || '');

  const apply = (overrides: Record<string, string> = {}) => {
    const params: Record<string, string> = {};
    const values = { search, status: filters.status || '', ...overrides };
    Object.entries(values).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    router.get('/admin/customers', params, { preserveState: true, replace: true });
  };

  const toggleActive = (id: number, isActive: boolean) => {
    if (!confirm(isActive ? 'Nonaktifkan akun pelanggan ini?' : 'Aktifkan akun pelanggan ini?')) return;
    router.post(`/admin/customers/${id}/toggle-active`, {}, { preserveScroll: true });
  };

  return (
    <AdminLayout>
      <Head title="Pelanggan" />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pelanggan</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar akun pelanggan yang terdaftar di toko.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3">
            <form onSubmit={(e) => { e.preventDefault(); apply(); }} className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, email, atau telepon..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </form>
            <select
              value={filters.status || ''}
              onChange={(e) => apply({ status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>

          {customers.data.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Belum ada pelanggan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Pelanggan</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Kontak</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Pesanan</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Total Belanja</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Terdaftar</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.data.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/customers/${customer.id}`} className="font-medium text-blue-600 hover:underline">
                          {customer.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-gray-700">{customer.email}</p>
                        <p className="text-xs text-gray-500">{customer.phone || '-'}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{customer.orders_count}</td>
                      <td className="px-4 py-3 hidden lg:table-cell font-medium text-gray-900">
                        {formatPrice(customer.total_spent ?? 0)}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-500">{formatDate(customer.created_at, false)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          customer.is_active === false ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {customer.is_active === false ? 'Nonaktif' : 'Aktif'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleActive(customer.id, customer.is_active !== false)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title={customer.is_active === false ? 'Aktifkan' : 'Nonaktifkan'}
                          >
                            {customer.is_active === false ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          </button>
                          <Link
                            href={`/admin/customers/${customer.id}`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Detail"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {customers.last_page > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination
                currentPage={customers.current_page}
                lastPage={customers.last_page}
                onPageChange={(page) => apply({ page: String(page) })}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
