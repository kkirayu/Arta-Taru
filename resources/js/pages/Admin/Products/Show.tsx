import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Package, Upload, X, Star, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import ConfirmDialog from '@/components/ConfirmDialog';
import type { ProductShowProps } from '@/types';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductShow({ product }: ProductShowProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = () => {
    router.delete(`/admin/products/${product.id}`);
  };

  const handleTogglePublish = () => {
    router.patch(`/admin/products/${product.id}/toggle-publish`);
  };

  const handleToggleFeatured = () => {
    router.patch(`/admin/products/${product.id}/toggle-featured`);
  };

  return (
    <AdminLayout>
      <Head title={product.name} />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Detail Produk</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" /> Edit
            </Link>
            <button
              onClick={handleTogglePublish}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              {product.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {product.is_active ? 'Sembunyikan' : 'Tampilkan'}
            </button>
            <button
              onClick={handleToggleFeatured}
              className={`inline-flex items-center gap-2 px-4 py-2 border text-sm font-medium rounded-lg ${
                product.is_featured ? 'border-yellow-300 bg-yellow-50 text-yellow-700' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Star className={`w-4 h-4 ${product.is_featured ? 'fill-current' : ''}`} />
              {product.is_featured ? 'Unfeatured' : 'Featured'}
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" /> Hapus
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gambar Produk</h2>
              <div className="grid grid-cols-4 gap-3">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img) => (
                    <div key={img.id} className={`relative aspect-square rounded-lg overflow-hidden border-2 ${img.is_primary ? 'border-blue-500' : 'border-gray-200'}`}>
                      <img src={img.path} alt={img.alt_text || ''} className="w-full h-full object-cover" />
                      {img.is_primary && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded">Utama</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                <span>SKU: {product.sku}</span>
                {product.brand && <span>| {product.brand.name}</span>}
                {product.category && (
                  <span>| <Link href={`/admin/products?category=${product.category.slug}`} className="text-blue-600 hover:underline">{product.category.name}</Link></span>
                )}
              </div>

              {product.short_description && (
                <p className="text-gray-600 mb-4">{product.short_description}</p>
              )}

              {product.description && (
                <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.description }} />
              )}
            </div>

            {product.specifications && product.specifications.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Spesifikasi</h2>
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((spec) => (
                      <tr key={spec.id} className="border-b border-gray-100">
                        <td className="py-2.5 text-gray-500 w-1/3">{spec.key}</td>
                        <td className="py-2.5 text-gray-900">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Harga & Stok</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Harga</span>
                  <span className="font-medium text-gray-900">{formatPrice(product.price)}</span>
                </div>
                {product.sale_price && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Harga Sale</span>
                    <span className="font-medium text-red-600">{formatPrice(product.sale_price)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Stok</span>
                  <span className={`font-medium ${product.stock <= product.low_stock_threshold ? 'text-red-600' : 'text-gray-900'}`}>
                    {product.stock}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {product.is_active ? 'Aktif' : 'Hidden'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Unggulan</span>
                  <span className={`font-medium ${product.is_featured ? 'text-yellow-600' : 'text-gray-400'}`}>
                    {product.is_featured ? 'Ya' : 'Tidak'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">SEO Title</span>
                  <p className="text-gray-900 mt-0.5">{product.seo_title || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Meta Description</span>
                  <p className="text-gray-900 mt-0.5">{product.meta_description || '-'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Canonical URL</span>
                  <p className="text-gray-900 mt-0.5">{product.canonical_url || '-'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Info Tambahan</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Dibuat</span>
                  <span className="text-gray-900">{new Date(product.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Diupdate</span>
                  <span className="text-gray-900">{new Date(product.updated_at).toLocaleDateString('id-ID')}</span>
                </div>
                {product.published_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dipublikasi</span>
                    <span className="text-gray-900">{new Date(product.published_at).toLocaleDateString('id-ID')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus Produk"
        message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        variant="danger"
      />
    </AdminLayout>
  );
}
