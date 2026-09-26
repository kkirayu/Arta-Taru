import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import type { SettingsProps } from '@/types';

export default function SettingsIndex({ settings, errors }: SettingsProps) {
  const { data, setData, post, processing } = useForm({
    store_name: settings.store_name || '',
    store_phone: settings.store_phone || '',
    store_address: settings.store_address || '',
    store_hours: settings.store_hours || '',
    whatsapp_number: settings.whatsapp_number || '',
    inquiry_template: settings.inquiry_template || '',
    site_title: settings.site_title || '',
    site_description: settings.site_description || '',
    default_og_image: settings.default_og_image || '',
    instagram_url: settings.instagram_url || '',
    facebook_url: settings.facebook_url || '',
    youtube_url: settings.youtube_url || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/settings');
  };

  const fieldError = (name: string) =>
    errors[name] ? <p className="mt-1 text-sm text-red-600">{errors[name]}</p> : null;

  return (
    <AdminLayout>
      <Head title="Settings" />

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Toko</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label>
                <input type="text" value={data.store_name} onChange={(e) => setData('store_name', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('store_name')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                <input type="text" value={data.store_phone} onChange={(e) => setData('store_phone', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('store_phone')}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea value={data.store_address} onChange={(e) => setData('store_address', e.target.value)} rows={2} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('store_address')}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Operasional</label>
                <input type="text" value={data.store_hours} onChange={(e) => setData('store_hours', e.target.value)} placeholder="Senin - Sabtu: 08:00 - 17:00" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('store_hours')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
                <input type="text" value={data.whatsapp_number} onChange={(e) => setData('whatsapp_number', e.target.value)} placeholder="62812xxxxxxx" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('whatsapp_number')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Pesan</label>
                <textarea value={data.inquiry_template} onChange={(e) => setData('inquiry_template', e.target.value)} rows={2} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('inquiry_template')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Situs</label>
                <input type="text" value={data.site_title} onChange={(e) => setData('site_title', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('site_title')}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Situs</label>
                <textarea value={data.site_description} onChange={(e) => setData('site_description', e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('site_description')}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Default OG Image URL</label>
                <input type="text" value={data.default_og_image} onChange={(e) => setData('default_og_image', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('default_og_image')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                <input type="url" value={data.instagram_url} onChange={(e) => setData('instagram_url', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('instagram_url')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input type="url" value={data.facebook_url} onChange={(e) => setData('facebook_url', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('facebook_url')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                <input type="url" value={data.youtube_url} onChange={(e) => setData('youtube_url', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('youtube_url')}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {processing ? 'Menyimpan...' : 'Simpan Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
