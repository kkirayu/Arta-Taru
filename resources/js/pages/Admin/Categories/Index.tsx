import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, FolderTree, MoreVertical, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import type { CategoryIndexProps } from '@/types';

export default function CategoriesIndex({ categories }: CategoryIndexProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      router.delete(`/admin/categories/${deleteId}`);
      setDeleteId(null);
    }
  };

  const handlePageChange = (page: number) => {
    router.get('/admin/categories', { page: String(page) }, { preserveState: true, replace: true });
  };

  return (
    <AdminLayout>
      <Head title="Kategori" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Kategori</h1>
          <Link
            href="/admin/categories/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Tambah Kategori
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          {categories.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Nama</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">Slug</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500 hidden lg:table-cell">Parent</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Produk</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.data.map((cat) => (
                    <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{cat.name}</td>
                      <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{cat.slug}</td>
                      <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{cat.parent?.name || '-'}</td>
                      <td className="px-5 py-3 text-gray-900">{cat.products_count ?? 0}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            cat.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {cat.is_active ? 'Aktif' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/categories/${cat.id}/edit`} className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteId(cat.id)} className="p-1.5 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600">
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
            <EmptyState icon={FolderTree} title="Tidak ada kategori" description="Belum ada kategori yang ditambahkan." action={{ label: 'Tambah Kategori', href: '/admin/categories/create' }} />
          )}

          {categories.last_page > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination currentPage={categories.current_page} lastPage={categories.last_page} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus Kategori"
        message="Apakah Anda yakin ingin menghapus kategori ini?"
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        variant="danger"
      />
    </AdminLayout>
  );
}
