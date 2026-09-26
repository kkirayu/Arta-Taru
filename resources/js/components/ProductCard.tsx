import { Link } from '@inertiajs/react';
import { Package, Heart, Eye } from 'lucide-react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStockInfo(product: Product): { text: string; className: string; dot: string } {
  if (product.stock_status === 'out_of_stock' || product.stock <= 0) {
    return { text: 'Habis', className: 'text-red-700 bg-red-50 border-red-200', dot: 'bg-red-500' };
  }
  if (product.stock_status === 'low_stock' || product.stock <= product.low_stock_threshold) {
    return { text: 'Stok Terbatas', className: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500' };
  }
  return { text: 'Tersedia', className: 'text-green-700 bg-green-50 border-green-200', dot: 'bg-green-500' };
}

export default function ProductCard({ product }: ProductCardProps) {
  const stock = getStockInfo(product);
  const imageUrl = product.primary_image?.path;
  const price = product.effective_price ?? product.sale_price ?? product.price;
  const hasSale = product.sale_price !== null && product.sale_price < product.price;
  const discount = hasSale
    ? Math.round(((product.price - (product.sale_price || 0)) / product.price) * 100)
    : 0;

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('wishlist');
      const ids: number[] = stored ? JSON.parse(stored) : [];
      const newIds = ids.includes(product.id)
        ? ids.filter((id) => id !== product.id)
        : [...ids, product.id];
      localStorage.setItem('wishlist', JSON.stringify(newIds));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const isWishlisted = (() => {
    try {
      const stored = localStorage.getItem('wishlist');
      return stored ? JSON.parse(stored).includes(product.id) : false;
    } catch { return false; }
  })();

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.primary_image?.alt_text || product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-200 group-hover:text-gray-300 transition-colors" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasSale && (
            <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded-md shadow-sm uppercase tracking-wide">
              -{discount}%
            </span>
          )}
          {product.is_featured && (
            <span className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md shadow-sm uppercase tracking-wide">
              Pilihan
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white/90 backdrop-blur text-gray-400 hover:text-red-500 hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="flex items-center justify-center gap-1.5 text-white text-xs font-medium">
            <Eye className="w-3.5 h-3.5" />
            Lihat Detail
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {product.category && (
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1">
            {product.category.name}
          </p>
        )}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">{formatPrice(price)}</span>
          {hasSale && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border ${stock.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${stock.dot}`} />
            {stock.text}
          </span>
          {product.brand && (
            <span className="text-[10px] text-gray-400 font-medium">{product.brand.name}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
