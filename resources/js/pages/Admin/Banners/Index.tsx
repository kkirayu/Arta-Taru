import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Image, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import type { BannerIndexProps } from '@/types';

export default function BannersIndex({ banners }: BannerIndexProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      router.delete(`/admin/banners/${deleteId}`);
      setDeleteId(null);
    }
  };

  const handleToggle = (bannerId: number) => {
    router.patch(`/admin/banners/${bannerId}/toggle`);
  };

  const handlePageChange = (page: number) => {
    router.get('/admin/banners', { page: String(page) }, { preserveState: true, replace: true });
  };

  return (
    <AdminLayout>
      <Head title="Banner" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Banner</h1>
          <Link
            href="/admin/banners/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Tambah Banner
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          {banners.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Judul</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">CTA</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500 hidden lg:table-cell">Periode</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Urutan</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.data.map((banner) => (
                    <tr key={banner.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                            {banner.desktop_image ? (
                              <img src={banner.desktop_image.startsWith('http') ? banner.desktop_image : `/storage/${banner.desktop_image}`} alt={banner.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{banner.title}</p>
                            {banner.subtitle && <p className="text-xs text-gray-400 truncate">{banner.subtitle}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{banner.cta_label || '-'}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs hidden lg:table-cell">
                        {banner.start_at ? new Date(banner.start_at).toLocaleDateString('id-ID') : '-'}
                        {banner.end_at && ` - ${new Date(banner.end_at).toLocaleDateString('id-ID')}`}
                      </td>
                      <td className="px-5 py-3 text-gray-900">{banner.sort_order}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => handleToggle(banner.id)} className="cursor-pointer">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              banner.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {banner.is_active ? 'Aktif' : 'Hidden'}
                          </span>
                        </button>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/banners/${banner.id}/edit`} className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteId(banner.id)} className="p-1.5 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600">
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
            <EmptyState icon={Image} title="Tidak ada banner" description="Belum ada banner yang ditambahkan." action={{ label: 'Tambah Banner', href: '/admin/banners/create' }} />
          )}

          {banners.last_page > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination currentPage={banners.current_page} lastPage={banners.last_page} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog open={deleteId !== null} title="Hapus Banner" message="Apakah Anda yakin ingin menghapus banner ini?" confirmLabel="Hapus" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} variant="danger" />
    </AdminLayout>
  );
}
