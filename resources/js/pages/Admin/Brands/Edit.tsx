import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { BrandFormProps } from '@/types';

export default function BrandEdit({ brand, errors }: BrandFormProps) {
  const { data, setData, put, processing } = useForm({
    name: brand?.name || '',
    slug: brand?.slug || '',
    logo: null as File | null,
    description: brand?.description || '',
    website: brand?.website || '',
    is_active: brand?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (brand) {
      put(`/admin/brands/${brand.id}`);
    }
  };

  const fieldError = (name: string) =>
    errors[name] ? <p className="mt-1 text-sm text-red-600">{errors[name]}</p> : null;

  if (!brand) return null;

  return (
    <AdminLayout>
      <Head title={`Edit - ${brand.name}`} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/brands" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Brand</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Brand</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('name')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" value={data.slug} onChange={(e) => setData('slug', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('slug')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo Baru</label>
                <input type="file" accept="image/*" onChange={(e) => setData('logo', e.target.files?.[0] || null)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
                {brand.logo && (
                  <div className="mt-2">
                    <img src={brand.logo} alt={brand.name} className="w-16 h-16 rounded-lg object-cover" />
                  </div>
                )}
                {fieldError('logo')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="url" value={data.website} onChange={(e) => setData('website', e.target.value)} placeholder="https://" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('website')}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('description')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-700">Aktif</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={processing} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <Link href="/admin/brands" className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
