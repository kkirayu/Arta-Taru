import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Heart, Trash2, Package, ArrowRight } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import type { Product } from '@/types';

export default function WishlistIndex() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      const ids: number[] = JSON.parse(stored);
      setWishlistIds(ids);
      if (ids.length > 0) {
        const params = ids.map(id => `product_ids[]=${id}`).join('&');
        fetch(`/wishlist?${params}`, {
          headers: { Accept: 'text/html', 'X-Inertia': 'true', 'X-Inertia-Version': '' },
        })
          .then(res => res.json())
          .then(data => {
            setProducts(data.props?.products || []);
          })
          .catch(() => setProducts([]))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const removeItem = (id: number) => {
    const newIds = wishlistIds.filter((wid) => wid !== id);
    setWishlistIds(newIds);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    localStorage.setItem('wishlist', JSON.stringify(newIds));
    window.dispatchEvent(new Event('storage'));
  };

  const clearAll = () => {
    setWishlistIds([]);
    setProducts([]);
    localStorage.removeItem('wishlist');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <PublicLayout>
      <Head title="Wishlist Saya" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Wishlist Saya</h1>
            <p className="text-gray-400 text-sm mt-1">
              {wishlistIds.length > 0 ? `${wishlistIds.length} produk tersimpan` : 'Simpan produk favorit Anda'}
            </p>
          </div>
          {products.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Hapus dari wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20">
            <EmptyState
              icon={Heart}
              title="Wishlist masih kosong"
              description="Tambahkan produk ke wishlist dengan menekan ikon hati pada produk yang Anda sukai."
              action={{ label: 'Jelajahi Katalog', href: '/katalog' }}
            />
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
