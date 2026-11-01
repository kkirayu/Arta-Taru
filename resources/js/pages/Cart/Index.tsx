import { Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, AlertTriangle, Package } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import { formatPrice } from '@/lib/format';
import type { CartPageProps } from '@/types';

export default function CartIndex({ cart }: CartPageProps) {
  const updateQty = (itemId: number, quantity: number) => {
    router.patch(`/keranjang/${itemId}`, { quantity }, { preserveScroll: true });
  };

  const removeItem = (itemId: number) => {
    router.delete(`/keranjang/${itemId}`, { preserveScroll: true });
  };

  const isEmpty = cart.items.length === 0;

  return (
    <PublicLayout>
      <Head title="Keranjang Belanja" />
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-gray-400" /> Keranjang Belanja
          </h1>

          {isEmpty ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Keranjang masih kosong</h2>
              <p className="text-sm text-gray-500 mb-6">Yuk, pilih produk yang Anda butuhkan.</p>
              <Link href="/katalog" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">
                Mulai Belanja <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                {cart.issues.length > 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 space-y-1">
                    {cart.issues.map((issue, i) => (
                      <p key={i} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {issue}
                      </p>
                    ))}
                  </div>
                )}

                {cart.items.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
                    <Link href={`/produk/${item.product_slug}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-200" />
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link href={`/produk/${item.product_slug}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
                            {item.product_name}
                          </Link>
                          {item.variant_label && (
                            <p className="text-xs text-gray-500 mt-0.5">{item.variant_label}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">Stok tersedia: {item.available_stock}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          aria-label="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                            disabled={item.quantity >= item.available_stock}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{formatPrice(item.line_total)}</p>
                          <p className="text-[11px] text-gray-400">{formatPrice(item.price)} / item</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <Link href="/katalog" className="text-sm text-blue-600 hover:underline">← Lanjut belanja</Link>
                  <button
                    onClick={() => router.delete('/keranjang', { preserveScroll: true })}
                    className="text-xs text-gray-400 hover:text-red-600"
                  >
                    Kosongkan keranjang
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:sticky lg:top-24">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Ringkasan</h2>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Jumlah item</span>
                      <span className="font-medium">{cart.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-xs">
                      <span>Ongkir</span>
                      <span>Dihitung saat checkout</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-baseline">
                    <span className="text-sm text-gray-500">Total sementara</span>
                    <span className="text-lg font-bold text-gray-900">{formatPrice(cart.subtotal)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Lanjut ke Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-gray-400 text-center mt-3">
                    Pembayaran transfer bank · Konfirmasi manual oleh admin
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
