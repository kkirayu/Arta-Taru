import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

export default function CategoryShow({ category }: { category: any }) {
  return (
    <AdminLayout>
      <Head title={category.name} />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/categories" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div><span className="text-sm font-medium text-gray-500">Slug:</span> <span className="text-sm text-gray-900">{category.slug}</span></div>
          <div><span className="text-sm font-medium text-gray-500">Status:</span> <span className={`text-sm font-medium ${category.is_active ? 'text-green-600' : 'text-gray-500'}`}>{category.is_active ? 'Aktif' : 'Nonaktif'}</span></div>
          <div><span className="text-sm font-medium text-gray-500">Urutan:</span> <span className="text-sm text-gray-900">{category.sort_order}</span></div>
          {category.description && <div><span className="text-sm font-medium text-gray-500">Deskripsi:</span> <span className="text-sm text-gray-900">{category.description}</span></div>}
          {category.parent && <div><span className="text-sm font-medium text-gray-500">Parent:</span> <span className="text-sm text-gray-900">{category.parent.name}</span></div>}
        </div>
        <Link href={`/admin/categories/${category.id}/edit`} className="inline-flex px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          Edit Kategori
        </Link>
      </div>
    </AdminLayout>
  );
}
