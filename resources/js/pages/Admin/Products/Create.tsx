import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, Package, DollarSign, Settings, Search, FileText, Save, ChevronRight } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { useState } from 'react';
import type { ProductFormProps } from '@/types';

type Tab = 'basic' | 'pricing' | 'specs' | 'seo' | 'publish';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'basic', label: 'Informasi Dasar', icon: Package },
  { id: 'pricing', label: 'Harga & Stok', icon: DollarSign },
  { id: 'specs', label: 'Spesifikasi', icon: Settings },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'publish', label: 'Publikasi', icon: FileText },
];

export default function ProductCreate({ categories, brands, errors }: ProductFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>('basic');
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
    setData('specifications', data.specifications.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...data.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setData('specifications', newSpecs);
  };

  const parentCategories = categories.filter((c) => !c.parent_id);
  const fieldError = (name: string) => errors[name] ? <p className="mt-1.5 text-xs text-red-600">{errors[name]}</p> : null;

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <AdminLayout>
      <Head title="Tambah Produk" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tambah Produk</h1>
              <p className="text-sm text-gray-400 mt-0.5">Lengkapi informasi produk baru</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/products" className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
              Batal
            </Link>
            <button onClick={handleSubmit} disabled={processing} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
              <Save className="w-4 h-4" />
              {processing ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tab navigation */}
          <div className="bg-white rounded-2xl border border-gray-100 p-1.5 shadow-sm">
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab: Basic */}
          {activeTab === 'basic' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Informasi Dasar</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Nama Produk *</label>
                  <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className={inputClass} placeholder="Contoh: HT Baofeng UV-5R" />
                  {fieldError('name')}
                </div>
                <div>
                  <label className={labelClass}>SKU *</label>
                  <input type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)} className={inputClass} placeholder="Contoh: AK-001" />
                  {fieldError('sku')}
                </div>
                <div>
                  <label className={labelClass}>Kategori *</label>
                  <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className={inputClass}>
                    <option value="">Pilih Kategori</option>
                    {parentCategories.map((cat) => (
                      <optgroup key={cat.id} label={cat.name}>
                        <option value={cat.id}>{cat.name}</option>
                        {cat.children?.map((child) => (
                          <option key={child.id} value={child.id}>-- {child.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {fieldError('category_id')}
                </div>
                <div>
                  <label className={labelClass}>Brand</label>
                  <select value={data.brand_id} onChange={(e) => setData('brand_id', e.target.value)} className={inputClass}>
                    <option value="">Pilih Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                  {fieldError('brand_id')}
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Deskripsi Singkat</label>
                  <textarea value={data.short_description} onChange={(e) => setData('short_description', e.target.value)} rows={2} className={inputClass} placeholder="Deskripsi singkat yang tampil di kartu produk" />
                  {fieldError('short_description')}
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Deskripsi Lengkap</label>
                  <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={5} className={inputClass} placeholder="Deskripsi lengkap produk" />
                  {fieldError('description')}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Pricing */}
          {activeTab === 'pricing' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Harga & Inventaris</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Harga (Rp) *</label>
                  <input type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} className={inputClass} placeholder="0" />
                  {fieldError('price')}
                </div>
                <div>
                  <label className={labelClass}>Harga Sale (Rp)</label>
                  <input type="number" value={data.sale_price} onChange={(e) => setData('sale_price', e.target.value)} className={inputClass} placeholder="Kosongkan jika tidak ada" />
                  {fieldError('sale_price')}
                </div>
                <div>
                  <label className={labelClass}>Stok *</label>
                  <input type="number" value={data.stock} onChange={(e) => setData('stock', e.target.value)} className={inputClass} placeholder="0" />
                  {fieldError('stock')}
                </div>
                <div>
                  <label className={labelClass}>Batas Stok Rendah</label>
                  <input type="number" value={data.low_stock_threshold} onChange={(e) => setData('low_stock_threshold', e.target.value)} className={inputClass} />
                  {fieldError('low_stock_threshold')}
                </div>
                <div>
                  <label className={labelClass}>Status Stok</label>
                  <select value={data.stock_status} onChange={(e) => setData('stock_status', e.target.value)} className={inputClass}>
                    <option value="available">Tersedia</option>
                    <option value="low_stock">Stok Rendah</option>
                    <option value="out_of_stock">Habis</option>
                    <option value="pre_order">Pre-Order</option>
                  </select>
                  {fieldError('stock_status')}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Specs */}
          {activeTab === 'specs' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Spesifikasi</h2>
                </div>
                <button type="button" onClick={addSpec} className="inline-flex items-center gap-1 px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors">
                  <Plus className="w-4 h-4" /> Tambah Baru
                </button>
              </div>
              <div className="space-y-3">
                {data.specifications.map((spec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <input type="text" value={spec.key} onChange={(e) => updateSpec(index, 'key', e.target.value)} placeholder="Nama (contoh: Frekuensi)" className={inputClass} />
                    </div>
                    <div className="flex-1">
                      <input type="text" value={spec.value} onChange={(e) => updateSpec(index, 'value', e.target.value)} placeholder="Nilai (contoh: 400-470 MHz)" className={inputClass} />
                    </div>
                    {data.specifications.length > 1 && (
                      <button type="button" onClick={() => removeSpec(index)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {fieldError('specifications')}
            </div>
          )}

          {/* Tab: SEO */}
          {activeTab === 'seo' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">SEO</h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>SEO Title</label>
                  <input type="text" value={data.seo_title} onChange={(e) => setData('seo_title', e.target.value)} className={inputClass} placeholder="Title untuk mesin pencari" />
                  <p className="mt-1 text-xs text-gray-400">Kosongkan untuk menggunakan nama produk</p>
                  {fieldError('seo_title')}
                </div>
                <div>
                  <label className={labelClass}>Meta Description</label>
                  <textarea value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} rows={3} className={inputClass} placeholder="Deskripsi untuk mesin pencari" />
                  <p className="mt-1 text-xs text-gray-400">Maks 160 karakter untuk hasil optimal</p>
                  {fieldError('meta_description')}
                </div>
                <div>
                  <label className={labelClass}>Canonical URL</label>
                  <input type="text" value={data.canonical_url} onChange={(e) => setData('canonical_url', e.target.value)} className={inputClass} placeholder="https://..." />
                  {fieldError('canonical_url')}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Publish */}
          {activeTab === 'publish' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Publikasi</h2>
              </div>
              <div className="space-y-4">
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${data.is_featured ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Produk Unggulan</p>
                    <p className="text-xs text-gray-400">Tampil di homepage sebagai featured product</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${data.is_active ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Aktif</p>
                    <p className="text-xs text-gray-400">Produk tampil di katalog publik</p>
                  </div>
                </label>
                <div>
                  <label className={labelClass}>Tanggal Publikasi</label>
                  <input type="datetime-local" value={data.published_at} onChange={(e) => setData('published_at', e.target.value)} className={inputClass} />
                  <p className="mt-1 text-xs text-gray-400">Kosongkan untuk publikasi langsung</p>
                  {fieldError('published_at')}
                </div>
              </div>
            </div>
          )}

          {/* Bottom nav */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {tabs.map((t, i) => (
                <button key={t.id} type="button" onClick={() => setActiveTab(t.id)} className={`w-2 h-2 rounded-full transition-all ${activeTab === t.id ? 'w-8 bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`} />
              ))}
            </div>
            <div className="flex items-center gap-3">
              {activeTab !== 'publish' && (
                <button type="button" onClick={() => {
                  const idx = tabs.findIndex(t => t.id === activeTab);
                  if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
                }} className="inline-flex items-center gap-1 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
                  Selanjutnya <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <button type="submit" disabled={processing} className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm">
                <Save className="w-4 h-4" />
                {processing ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
