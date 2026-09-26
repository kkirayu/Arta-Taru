import { useState, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Package } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import ProductCard from '@/components/ProductCard';
import SearchInput from '@/components/SearchInput';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import type { CatalogProps, Category, Brand } from '@/types';

interface FilterState {
  search: string;
  category: string;
  brand: string;
  sort: string;
  min_price: string;
  max_price: string;
  in_stock: string;
}

const sortOptions = [
  { value: '', label: 'Terbaru' },
  { value: 'name_asc', label: 'Nama A-Z' },
  { value: 'name_desc', label: 'Nama Z-A' },
  { value: 'price_asc', label: 'Harga Termurah' },
  { value: 'price_desc', label: 'Harga Termahal' },
];

interface CategoryAccordionProps {
  categories: Category[];
  selected: string;
  onSelect: (slug: string) => void;
}

function CategoryAccordion({ categories, selected, onSelect }: CategoryAccordionProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const parentCategories = categories.filter((c) => !c.parent_id);

  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelect('')}
        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
          !selected ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Semua Kategori
      </button>
      {parentCategories.map((cat) => (
        <div key={cat.id}>
          <div className="flex items-center">
            <button
              onClick={() => onSelect(cat.slug)}
              className={`flex-1 text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selected === cat.slug
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
            {cat.children && cat.children.length > 0 && (
              <button
                onClick={() => toggleExpand(cat.id)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                {expanded[cat.id] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
          {expanded[cat.id] && cat.children && (
            <div className="ml-4 space-y-1">
              {cat.children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => onSelect(child.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                    selected === child.slug
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function CatalogIndex({
  products,
  categories,
  brands,
  filters,
}: CatalogProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>({
    search: filters.search || '',
    category: filters.category || '',
    brand: filters.brand || '',
    sort: filters.sort || '',
    min_price: filters.min_price || '',
    max_price: filters.max_price || '',
    in_stock: filters.in_stock || '',
  });

  const applyFilters = useCallback(
    (newFilters: FilterState) => {
      const params: Record<string, string> = {};
      if (newFilters.search) params.search = newFilters.search;
      if (newFilters.category) params.category = newFilters.category;
      if (newFilters.brand) params.brand = newFilters.brand;
      if (newFilters.sort) params.sort = newFilters.sort;
      if (newFilters.min_price) params.min_price = newFilters.min_price;
      if (newFilters.max_price) params.max_price = newFilters.max_price;
      if (newFilters.in_stock) params.in_stock = newFilters.in_stock;
      router.get('/katalog', params, { preserveState: true, replace: true });
    },
    []
  );

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    applyFilters(newFilters);
  };

  const removeFilter = (key: keyof FilterState) => {
    updateFilter(key, '');
  };

  const clearAll = () => {
    const empty: FilterState = { search: '', category: '', brand: '', sort: '', min_price: '', max_price: '', in_stock: '' };
    setLocalFilters(empty);
    applyFilters(empty);
  };

  const activeFilters = Object.entries(localFilters).filter(
    ([key, val]) => val && key !== 'sort'
  );

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = {};
    Object.entries(localFilters).forEach(([key, val]) => {
      if (val) params[key] = val;
    });
    params.page = String(page);
    router.get('/katalog', params, { preserveState: true, replace: true });
  };

  const activeBrands = localFilters.brand ? localFilters.brand.split(',') : [];

  return (
    <PublicLayout>
      <Head title="Katalog Produk" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Katalog Produk</h1>
          <div className="flex items-center gap-3">
            <div className="w-64">
              <SearchInput
                value={localFilters.search}
                onChange={(val) => updateFilter('search', val)}
                placeholder="Cari produk..."
              />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Kategori</h3>
              <CategoryAccordion
                categories={categories}
                selected={localFilters.category}
                onSelect={(val) => updateFilter('category', val)}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Brand</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeBrands.includes(brand.slug)}
                      onChange={(e) => {
                        let newBrands: string[];
                        if (e.target.checked) {
                          newBrands = [...activeBrands, brand.slug];
                        } else {
                          newBrands = activeBrands.filter((b) => b !== brand.slug);
                        }
                        updateFilter('brand', newBrands.join(','));
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Harga</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={localFilters.min_price}
                  onChange={(e) => updateFilter('min_price', e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={localFilters.max_price}
                  onChange={(e) => updateFilter('max_price', e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Stok</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.in_stock === '1'}
                  onChange={(e) => updateFilter('in_stock', e.target.checked ? '1' : '')}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Hanya yang tersedia</span>
              </label>
            </div>
          </aside>

          {filterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/30" onClick={() => setFilterOpen(false)} />
              <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-xl overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold text-gray-900">Filter</h3>
                  <button onClick={() => setFilterOpen(false)} className="p-1 text-gray-400 hover:bg-gray-100 rounded">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Kategori</h3>
                    <CategoryAccordion
                      categories={categories}
                      selected={localFilters.category}
                      onSelect={(val) => updateFilter('category', val)}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Brand</h3>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={activeBrands.includes(brand.slug)}
                            onChange={(e) => {
                              let newBrands: string[];
                              if (e.target.checked) {
                                newBrands = [...activeBrands, brand.slug];
                              } else {
                                newBrands = activeBrands.filter((b) => b !== brand.slug);
                              }
                              updateFilter('brand', newBrands.join(','));
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">{brand.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Harga</h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={localFilters.min_price}
                        onChange={(e) => updateFilter('min_price', e.target.value)}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        value={localFilters.max_price}
                        onChange={(e) => updateFilter('max_price', e.target.value)}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Stok</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.in_stock === '1'}
                        onChange={(e) => updateFilter('in_stock', e.target.checked ? '1' : '')}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">Hanya yang tersedia</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{products.total} produk ditemukan</p>
              <select
                value={localFilters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map(([key, val]) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                  >
                    {key === 'brand' ? `Brand: ${val}` : key === 'category' ? `Kategori: ${val}` : val}
                    <button onClick={() => removeFilter(key as keyof FilterState)} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAll}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Hapus semua
                </button>
              </div>
            )}

            {products.data.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products.data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <div className="mt-8">
                  <Pagination
                    currentPage={products.current_page}
                    lastPage={products.last_page}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <EmptyState
                icon={Package}
                title="Tidak ada produk"
                description="Tidak ditemukan produk yang sesuai dengan filter Anda."
              />
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
