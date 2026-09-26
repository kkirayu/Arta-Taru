import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { BannerFormProps } from '@/types';

export default function BannerEdit({ banner, errors }: BannerFormProps) {
  const { data, setData, put, processing } = useForm({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    desktop_image: null as File | null,
    mobile_image: null as File | null,
    cta_label: banner?.cta_label || '',
    cta_url: banner?.cta_url || '',
    start_at: banner?.start_at ? banner.start_at.slice(0, 16) : '',
    end_at: banner?.end_at ? banner.end_at.slice(0, 16) : '',
    sort_order: banner?.sort_order !== undefined ? String(banner.sort_order) : '0',
    is_active: banner?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (banner) {
      put(`/admin/banners/${banner.id}`);
    }
  };

  const fieldError = (name: string) =>
    errors[name] ? <p className="mt-1 text-sm text-red-600">{errors[name]}</p> : null;

  if (!banner) return null;

  return (
    <AdminLayout>
      <Head title={`Edit - ${banner.title}`} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/banners" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Banner</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Banner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('title')}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input type="text" value={data.subtitle} onChange={(e) => setData('subtitle', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('subtitle')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Desktop Baru</label>
                <input type="file" accept="image/*" onChange={(e) => setData('desktop_image', e.target.files?.[0] || null)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
                {banner.desktop_image && <img src={banner.desktop_image} alt="" className="mt-2 w-32 h-20 rounded-lg object-cover" />}
                {fieldError('desktop_image')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Mobile Baru</label>
                <input type="file" accept="image/*" onChange={(e) => setData('mobile_image', e.target.files?.[0] || null)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
                {banner.mobile_image && <img src={banner.mobile_image} alt="" className="mt-2 w-20 h-20 rounded-lg object-cover" />}
                {fieldError('mobile_image')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label CTA</label>
                <input type="text" value={data.cta_label} onChange={(e) => setData('cta_label', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('cta_label')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL CTA</label>
                <input type="text" value={data.cta_url} onChange={(e) => setData('cta_url', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('cta_url')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                <input type="datetime-local" value={data.start_at} onChange={(e) => setData('start_at', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('start_at')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                <input type="datetime-local" value={data.end_at} onChange={(e) => setData('end_at', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('end_at')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                <input type="number" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('sort_order')}
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
            <Link href="/admin/banners" className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
