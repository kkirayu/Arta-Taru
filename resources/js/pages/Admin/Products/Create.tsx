import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import type { ProductFormProps } from '@/types';

export default function ProductCreate({ categories, brands, errors }: ProductFormProps) {
  const { data, setData, post, processing } = useForm({
    name: '',
    sku: '',
    category_id: '',
    brand_id: '',
    short_description: '',
    description: '',
    price: '',
    sale_price: '',
    stock: '0',
    low_stock_threshold: '5',
    stock_status: 'available',
    specifications: [{ key: '', value: '' }],
    seo_title: '',
    meta_description: '',
    canonical_url: '',
    is_featured: false,
    is_active: true,
    published_at: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/products');
  };

  const addSpec = () => {
    setData('specifications', [...data.specifications, { key: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    setData(
      'specifications',
      data.specifications.filter((_, i) => i !== index)
    );
  };

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...data.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setData('specifications', newSpecs);
  };

  const parentCategories = categories.filter((c) => !c.parent_id);

  const fieldError = (name: string) => errors[name] ? (
    <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
  ) : null;

  return (
    <AdminLayout>
      <Head title="Tambah Produk" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Produk</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('name')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                <input type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('sku')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="">Pilih Kategori</option>
                  {parentCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                  {categories.filter((c) => c.parent_id).map((cat) => (
                    <option key={cat.id} value={cat.id}>-- {cat.name}</option>
                  ))}
                </select>
                {fieldError('category_id')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select value={data.brand_id} onChange={(e) => setData('brand_id', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="">Pilih Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
                {fieldError('brand_id')}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea value={data.short_description} onChange={(e) => setData('short_description', e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('short_description')}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={6} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('description')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Harga & Inventaris</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga *</label>
                <input type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('price')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Sale</label>
                <input type="number" value={data.sale_price} onChange={(e) => setData('sale_price', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('sale_price')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stok *</label>
                <input type="number" value={data.stock} onChange={(e) => setData('stock', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('stock')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batas Stok Rendah</label>
                <input type="number" value={data.low_stock_threshold} onChange={(e) => setData('low_stock_threshold', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('low_stock_threshold')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Stok</label>
                <select value={data.stock_status} onChange={(e) => setData('stock_status', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="available">Tersedia</option>
                  <option value="low_stock">Stok Rendah</option>
                  <option value="out_of_stock">Habis</option>
                  <option value="pre_order">Pre-Order</option>
                </select>
                {fieldError('stock_status')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Spesifikasi</h2>
              <button type="button" onClick={addSpec} className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </div>
            <div className="space-y-3">
              {data.specifications.map((spec, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => updateSpec(index, 'key', e.target.value)}
                    placeholder="Nama spesifikasi"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpec(index, 'value', e.target.value)}
                    placeholder="Nilai"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {data.specifications.length > 1 && (
                    <button type="button" onClick={() => removeSpec(index)} className="p-2 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {fieldError('specifications')}
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                <input type="text" value={data.canonical_url} onChange={(e) => setData('canonical_url', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('canonical_url')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Publikasi</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-gray-700">Produk Unggulan</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-gray-700">Aktif</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Publikasi</label>
                <input type="datetime-local" value={data.published_at} onChange={(e) => setData('published_at', e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                {fieldError('published_at')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={processing} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {processing ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
            <Link href="/admin/products" className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
