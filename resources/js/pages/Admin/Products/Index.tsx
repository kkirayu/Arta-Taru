import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Package, Search, MoreVertical, Eye, Edit, Copy, Trash2, EyeOff, Eye as EyeIcon } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import SearchInput from '@/components/SearchInput';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import type { ProductIndexProps, Product } from '@/types';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductsIndex({ products, categories, brands, filters }: ProductIndexProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [actionMenu, setActionMenu] = useState<number | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
    const params: Record<string, string> = {};
    if (value) params.search = value;
    if (filters.category) params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;
    if (filters.status) params.status = filters.status;
    router.get('/admin/products', params, { preserveState: true, replace: true });
  };

  const handleFilterChange = (key: string, value: string) => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (key === 'category' ? value : filters.category) params.category = key === 'category' ? value : (filters.category || '');
    if (key === 'brand' ? value : filters.brand) params.brand = key === 'brand' ? value : (filters.brand || '');
    if (key === 'status' ? value : filters.status) params.status = key === 'status' ? value : (filters.status || '');
    router.get('/admin/products', params, { preserveState: true, replace: true });
  };

  const handleDelete = () => {
    if (deleteId) {
      router.delete(`/admin/products/${deleteId}`);
      setDeleteId(null);
    }
  };

  const handleDuplicate = (product: Product) => {
    router.post(`/admin/products/${product.id}/duplicate`);
  };

  const handleTogglePublish = (product: Product) => {
    router.patch(`/admin/products/${product.id}/toggle-publish`);
  };

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (filters.category) params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;
    if (filters.status) params.status = filters.status;
    params.page = String(page);
    router.get('/admin/products', params, { preserveState: true, replace: true });
  };

  return (
    <AdminLayout>
      <Head title="Produk" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Produk</h1>
          <Link
            href="/admin/products/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-full sm:w-64">
                <SearchInput value={search} onChange={handleSearch} placeholder="Cari produk..." />
              </div>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
              <select
                value={filters.brand || ''}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="">Semua Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.slug}>{brand.name}</option>
                ))}
              </select>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Hidden</option>
              </select>
            </div>
          </div>

          {products.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Produk</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Kategori</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Brand</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Harga</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Stok</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.data.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.primary_image?.path ? (
                              <img src={product.primary_image.path} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{product.category?.name || '-'}</td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{product.brand?.name || '-'}</td>
                      <td className="px-4 py-3 text-gray-900">
                        {formatPrice(product.effective_price ?? product.sale_price ?? product.price)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${product.stock <= product.low_stock_threshold ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {product.is_active ? 'Aktif' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setActionMenu(actionMenu === product.id ? null : product.id)}
                            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {actionMenu === product.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActionMenu(null)} />
                              <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                                <Link
                                  href={`/produk/${product.slug}`}
                                  target="_blank"
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Eye className="w-4 h-4" /> Lihat
                                </Link>
                                <Link
                                  href={`/admin/products/${product.id}/edit`}
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit className="w-4 h-4" /> Edit
                                </Link>
                                <button
                                  onClick={() => { handleDuplicate(product); setActionMenu(null); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Copy className="w-4 h-4" /> Duplikat
                                </button>
                                <button
                                  onClick={() => { handleTogglePublish(product); setActionMenu(null); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {product.is_active ? <EyeOff className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                  {product.is_active ? 'Sembunyikan' : 'Tampilkan'}
                                </button>
                                <button
                                  onClick={() => { setDeleteId(product.id); setActionMenu(null); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" /> Hapus
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={Package} title="Tidak ada produk" description="Belum ada produk yang ditambahkan." action={{ label: 'Tambah Produk', href: '/admin/products/create' }} />
          )}

          {products.last_page > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination currentPage={products.current_page} lastPage={products.last_page} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus Produk"
        message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        variant="danger"
      />
    </AdminLayout>
  );
}
