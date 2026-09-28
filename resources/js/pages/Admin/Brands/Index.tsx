import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Tag, Edit, Trash2, ExternalLink } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import SearchInput from '@/components/SearchInput';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import type { BrandIndexProps } from '@/types';

export default function BrandsIndex({ brands }: BrandIndexProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const handleDelete = () => {
    if (deleteId) {
      router.delete(`/admin/brands/${deleteId}`);
      setDeleteId(null);
    }
  };

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    params.page = String(page);
    router.get('/admin/brands', params, { preserveState: true, replace: true });
  };

  return (
    <AdminLayout>
      <Head title="Brand" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Brand</h1>
          <Link
            href="/admin/brands/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Tambah Brand
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="w-64">
              <SearchInput value={search} onChange={setSearch} placeholder="Cari brand..." />
            </div>
          </div>

          {brands.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Brand</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">Slug</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500 hidden lg:table-cell">Website</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Produk</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.data.map((brand) => (
                    <tr key={brand.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {brand.logo ? (
                              <img src={brand.logo.startsWith('http') ? brand.logo : `/storage/${brand.logo}`} alt={brand.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Tag className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900">{brand.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{brand.slug}</td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        {brand.website ? (
                          <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                            {brand.website} <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-900">{brand.products_count ?? 0}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${brand.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {brand.is_active ? 'Aktif' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/brands/${brand.id}/edit`} className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteId(brand.id)} className="p-1.5 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={Tag} title="Tidak ada brand" description="Belum ada brand yang ditambahkan." action={{ label: 'Tambah Brand', href: '/admin/brands/create' }} />
          )}

          {brands.last_page > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination currentPage={brands.current_page} lastPage={brands.last_page} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog open={deleteId !== null} title="Hapus Brand" message="Apakah Anda yakin ingin menghapus brand ini?" confirmLabel="Hapus" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} variant="danger" />
    </AdminLayout>
  );
}
