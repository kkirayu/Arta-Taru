import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { CategoryFormProps } from '@/types';

export default function CategoryCreate({ parent_categories, errors }: CategoryFormProps) {
  const { data, setData, post, processing } = useForm({
    name: '',
    slug: '',
    parent_id: '',
    description: '',
    seo_title: '',
    meta_description: '',
    sort_order: '0',
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/categories');
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const fieldError = (name: string) =>
    errors[name] ? <p className="mt-1 text-sm text-red-600">{errors[name]}</p> : null;

  return (
    <AdminLayout>
      <Head title="Tambah Kategori" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/categories" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Kategori</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => {
                    setData('name', e.target.value);
                    if (!data.slug) setData('slug', generateSlug(e.target.value));
                  }}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {fieldError('name')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={data.slug}
                  onChange={(e) => setData('slug', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {fieldError('slug')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
                <select
                  value={data.parent_id}
                  onChange={(e) => setData('parent_id', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Tidak ada parent</option>
                  {parent_categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {fieldError('parent_id')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                <input
                  type="number"
                  value={data.sort_order}
                  onChange={(e) => setData('sort_order', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {fieldError('sort_order')}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                {fieldError('description')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                <input type="text" value={data.seo_title} onChange={(e) => setData('seo_title', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('seo_title')}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('meta_description')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.is_active}
                onChange={(e) => setData('is_active', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Aktif</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={processing} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {processing ? 'Menyimpan...' : 'Simpan Kategori'}
            </button>
            <Link href="/admin/categories" className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
