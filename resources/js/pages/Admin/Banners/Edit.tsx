import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Image, Save } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

export default function BannerEdit({ banner }: { banner: any }) {
  const { data, setData, post, processing, errors } = useForm({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    desktop_image: null as File | null,
    mobile_image: null as File | null,
    cta_label: banner?.cta_label || '',
    cta_url: banner?.cta_url || '',
    sort_order: String(banner?.sort_order || 0),
    is_active: banner?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (banner) {
      post(`/admin/banners/${banner.id}`, { forceFormData: true, _method: 'put' });
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
  const imgUrl = (path: string) => path?.startsWith('http') ? path : `/storage/${path}`;

  if (!banner) return null;

  return (
    <AdminLayout>
      <Head title={`Edit - ${banner.title}`} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/banners" className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Banner</h1>
              <p className="text-sm text-gray-400 mt-0.5">{banner.title}</p>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={processing} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            {processing ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Informasi Banner</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelClass}>Judul *</label>
                <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass} />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Subtitle</label>
                <input type="text" value={data.subtitle} onChange={(e) => setData('subtitle', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gambar Desktop</label>
                <input type="file" accept="image/*" onChange={(e) => setData('desktop_image', e.target.files?.[0] || null)} className={inputClass} />
                {banner.desktop_image && <img src={imgUrl(banner.desktop_image)} alt="Desktop" className="mt-2 w-full h-24 object-cover rounded-lg border" />}
                {errors.desktop_image && <p className="mt-1 text-xs text-red-600">{errors.desktop_image}</p>}
              </div>
              <div>
                <label className={labelClass}>Gambar Mobile</label>
                <input type="file" accept="image/*" onChange={(e) => setData('mobile_image', e.target.files?.[0] || null)} className={inputClass} />
                {banner.mobile_image && <img src={imgUrl(banner.mobile_image)} alt="Mobile" className="mt-2 w-24 h-24 object-cover rounded-lg border" />}
                {errors.mobile_image && <p className="mt-1 text-xs text-red-600">{errors.mobile_image}</p>}
              </div>
              <div>
                <label className={labelClass}>CTA Label</label>
                <input type="text" value={data.cta_label} onChange={(e) => setData('cta_label', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>CTA URL</label>
                <input type="text" value={data.cta_url} onChange={(e) => setData('cta_url', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Urutan</label>
                <input type="number" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} className={inputClass} />
              </div>
              <div className="flex items-end">
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all w-full ${data.is_active ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Aktif</p>
                    <p className="text-xs text-gray-400">Banner tampil di homepage</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
