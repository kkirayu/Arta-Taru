import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

export default function BrandShow({ brand }: { brand: any }) {
  return (
    <AdminLayout>
      <Head title={brand.name} />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/brands" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{brand.name}</h1>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div><span className="text-sm font-medium text-gray-500">Slug:</span> <span className="text-sm text-gray-900">{brand.slug}</span></div>
          <div><span className="text-sm font-medium text-gray-500">Status:</span> <span className={`text-sm font-medium ${brand.is_active ? 'text-green-600' : 'text-gray-500'}`}>{brand.is_active ? 'Aktif' : 'Nonaktif'}</span></div>
          {brand.description && <div><span className="text-sm font-medium text-gray-500">Deskripsi:</span> <span className="text-sm text-gray-900">{brand.description}</span></div>}
          {brand.website && (
            <div>
              <span className="text-sm font-medium text-gray-500">Website:</span>{' '}
              <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                {brand.website} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
        <Link href={`/admin/brands/${brand.id}/edit`} className="inline-flex px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          Edit Brand
        </Link>
      </div>
    </AdminLayout>
  );
}
