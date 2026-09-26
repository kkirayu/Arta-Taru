import { useState, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Package, LayoutGrid, List, Filter } from 'lucide-react';
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
        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          !selected ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        Semua Kategori
      </button>
      {parentCategories.map((cat) => (
        <div key={cat.id}>
          <div className="flex items-center">
            <button
              onClick={() => onSelect(cat.slug)}
              className={`flex-1 text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selected === cat.slug
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
            {cat.children && cat.children.length > 0 && (
              <button
                onClick={() => toggleExpand(cat.id)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
              >
                {expanded[cat.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
          {expanded[cat.id] && cat.children && (
            <div className="ml-4 space-y-0.5 mt-0.5">
              {cat.children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => onSelect(child.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                    selected === child.slug
                      ? 'text-blue-600 bg-blue-50 font-medium'
                      : 'text-gray-500 hover:bg-gray-50'
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

  const handlePageChange = (pageF: number) => {
    const params: Record<string, string> = {};
    Object.entries(localFilters).forEach(([key, val]) => {
      if (val) params[key] = val;
    });
    params.page = String(handlePageChange);
    router.get('/katalog', params, { preserveState: true, replace: true });
  };

  const handlePageChangePag = (page: number) => {
    const params: Record<string, string> = {};
    Object.entries(localFilters).forEach(([key, val]) => {
      if (val) params[key] = val;
    });
    params.page = String(page);
    router.get('/katalog', params, { preserveState: true, replace: true });
  };

  const activeBrands = localFilters.brand ? localFilters.brand.split(',') : [];

  const filterCount = activeFilters.length;

  return (
    <PublicLayout>
      <Head title="Katalog Produk" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Katalog Produk</h1>
          <p className="text-gray-400 mt-1">Temukan peralatan yang Anda butuhkan</p>
        </div>

        {/* Search + Sort + Filter toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-80 lg:w-96">
            <SearchInput
              value={localFilters.search}
              onChange={(val) => updateFilter('search', val)}
              placeholder="Cari produk, brand, atau SKU..."
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={localFilters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`lg:hidden flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${
                filterCount > 0 ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="" />
              Filter
              {filterCount > 0 && (
                <span className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {filterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active filter tags */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map(([key, val]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100"
              >
                {key === 'brand' ? `Brand: ${val}` : key === 'category' ? `Kategori: ${val}` : key === 'in_stock' ? 'Tersedia' : val}
                <button onClick={() => removeFilter(key as keyof FilterState)} className="hover:text-blue-900 ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-gray-700 underline px-2 py-1.5"
            >
              Hapus semua
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                  Filter
                </h3>
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Kategori</h4>
                    <CategoryAccordion
                      categories={categories}
                      selected={localFilters.category}
                      onSelect={(val) => updateFilter('category', val)}
                    />
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Brand</h4>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {brands.map((brand) => (
                        <label key={brand.id} className="flex items-center gap-2 cursor-pointer group">
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
                          <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{brand.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Harga</h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={localFilters.min_price}
                        onChange={(e) => updateFilter('min_price', e.target.value)}
                        placeholder="Min"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <span className="text-gray-300">-</span>
                      <input
                        type="number"
                        value={localFilters.max_price}
                        onChange={(e) => updateFilter('max_price', e.target.value)}
                        placeholder="Max"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={localFilters.in_stock === '1'}
                        onChange={(e) => updateFilter('in_stock', e.target.checked ? '1' : '')}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">Hanya yang tersedia</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile filter drawer */}
          {filterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
              <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                  <h3 className="font-semibold text-gray-900">Filter</h3>
                  <button onClick={() => setFilterOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5 space-y-6">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Kategori</h4>
                    <CategoryAccordion
                      categories={categories}
                      selected={localFilters.category}
                      onSelect={(val) => updateFilter('category', val)}
                    />
                  </div>
                  <div className="border-t border-gray-100 pt-5">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Brand</h4>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={activeBrands.includes(brand.slug)}
                            onChange={(e) => {
                              const newBrands = e.target.checked
                                ? [...activeBrands, brand.slug]
                                : activeBrands.filter((b) => b !== brand.slug);
                              updateFilter('brand', newBrands.join(','));
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600">{brand.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-5">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Harga</h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={localFilters.min_price}
                        onChange={(e) => updateFilter('min_price', e.target.value)}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                      <span className="text-gray-300">-</span>
                      <input
                        type="number"
                        value={localFilters.max_price}
                        onChange={(e) => updateFilter('max_price', e.target.value)}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-5">
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

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                Menampilkan <span className="font-medium text-gray-700">{products.from || 0}-{products.to || 0}</span> dari <span className="font-medium text-gray-700">{products.total}</span> produk
              </p>
            </div>

            {products.data.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                  {products.data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <div className="mt-10">
                  <Pagination
                    currentPage={products.current_page}
                    lastPage={products.last_page}
                    onPageChange={handlePageChangePag}
                  />
                </div>
              </>
            ) : (
              <div className="py-20">
                <EmptyState
                  icon={Package}
                  title="Tidak ada produk ditemukan"
                  description="Coba ubah filter atau kata kunci pencarian Anda."
                  action={{ label: 'Lihat Semua Produk', href: '/katalog' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
