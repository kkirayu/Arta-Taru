import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Warehouse, Package, Save } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import type { InventoryProps } from '@/types';

export default function InventoryIndex({ products }: InventoryProps) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [stockValue, setStockValue] = useState('');

  const handleSearch = (value: string) => {
    setSearch(value);
    const params: Record<string, string> = {};
    if (value) params.search = value;
    router.get('/admin/inventory', params, { preserveState: true, replace: true });
  };

  const startEdit = (productId: number, currentStock: number) => {
    setEditingId(productId);
    setStockValue(String(currentStock));
  };

  const saveStock = (productId: number) => {
    router.patch(
      `/admin/inventory/${productId}`,
      { stock: Number(stockValue) },
      { preserveState: true, onSuccess: () => setEditingId(null) }
    );
  };

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    params.page = String(page);
    router.get('/admin/inventory', params, { preserveState: true, replace: true });
  };

  return (
    <AdminLayout>
      <Head title="Inventaris" />

      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventaris</h1>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="w-64">
              <SearchInput value={search} onChange={handleSearch} placeholder="Cari produk..." />
            </div>
          </div>

          {products.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Produk</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">SKU</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Stok</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500 hidden md:table-cell">Batas Rendah</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-right px-5 py-3 font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.data.map((product) => {
                    const isLowStock = product.stock <= product.low_stock_threshold;
                    const isEditing = editingId === product.id;

                    return (
                      <tr key={product.id} className={`border-b border-gray-50 ${isLowStock ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
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
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{product.sku}</td>
                        <td className="px-5 py-3">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={stockValue}
                                onChange={(e) => setStockValue(e.target.value)}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveStock(product.id);
                                  if (e.key === 'Escape') setEditingId(null);
                                }}
                              />
                              <button onClick={() => saveStock(product.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                <Save className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(product.id, product.stock)}
                              className={`font-medium hover:underline ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}
                            >
                              {product.stock}
                            </button>
                          )}
                        </td>
                        <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{product.low_stock_threshold}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              product.stock <= 0
                                ? 'bg-red-100 text-red-800'
                                : isLowStock
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {product.stock <= 0 ? 'Habis' : isLowStock ? 'Rendah' : 'Aman'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          {!isEditing && (
                            <button
                              onClick={() => startEdit(product.id, product.stock)}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Edit Stok
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={Warehouse} title="Tidak ada produk" description="Tidak ditemukan produk untuk dikelola." />
          )}

          {products.last_page > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination currentPage={products.current_page} lastPage={products.last_page} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
