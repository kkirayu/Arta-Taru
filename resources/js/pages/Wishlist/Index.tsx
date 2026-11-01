import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Heart, Package, ArrowRight, LogIn } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import ProductCard from '@/components/ProductCard';
import type { WishlistProps } from '@/types';

export default function WishlistIndex({ products, product_ids, is_guest }: WishlistProps) {
  const [ids, setIds] = useState<number[]>(product_ids);

  const toggle = async (productId: number) => {
    try {
      const res = await fetch('/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (res.status === 401) {
        router.visit('/masuk');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setIds((prev) => data.in_wishlist ? [...prev, productId] : prev.filter((id) => id !== productId));
      }
    } catch {}
  };

  const visible = products.filter((p) => ids.includes(p.id));

  return (
    <PublicLayout>
      <Head title="Wishlist" />
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" /> Wishlist
          </h1>

          {is_guest ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <LogIn className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Masuk untuk menyimpan wishlist</h2>
              <p className="text-sm text-gray-500 mb-5">Wishlist tersimpan di akun Anda dan bisa diakses kapan saja.</p>
              <div className="flex items-center justify-center gap-2">
                <Link href="/masuk" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl">Masuk</Link>
                <Link href="/daftar" className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl">Daftar</Link>
              </div>
            </div>
          ) : visible.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-5">Belum ada produk di wishlist.</p>
              <Link href="/katalog" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl">
                Jelajahi Katalog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {visible.map((product) => (
                  <div key={product.id} className="relative">
                    <ProductCard product={product} />
                    <button
                      onClick={() => toggle(product.id)}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm"
                      aria-label="Hapus dari wishlist"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">Klik ikon hati untuk menghapus produk dari wishlist.</p>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
