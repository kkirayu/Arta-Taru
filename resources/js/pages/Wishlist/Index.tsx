import { useEffect, useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Heart, Trash2 } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import type { Product, PageProps } from '@/types';

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
  };

  return (
    <PublicLayout>
      <Head title="Wishlist" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Wishlist Saya</h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="Wishlist kosong"
            description="Belum ada produk yang ditambahkan ke wishlist."
            action={{ label: 'Jelajahi Katalog', href: '/katalog' }}
          />
        )}
      </div>
    </PublicLayout>
  );
}
