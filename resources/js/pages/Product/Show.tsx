import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  ChevronRight,
  Package,
  Share2,
  MessageCircle,
  Heart,
  Check,
  Copy,
  Truck,
  Shield,
  Headphones,
  Minus,
  Plus,
  ChevronLeft,
} from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import ProductCard from '@/components/ProductCard';
import type { ProductShowProps } from '@/types';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProductShow({ product, related_products, whatsapp_number }: ProductShowProps) {
  const [activeImage, setActiveImage] = useState(product.primary_image || product.images?.[0] || null);
  const [copied, setCopied] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    fetch('/api/v1/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken, 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify({ event_name: 'product_view', product_id: product.id }),
    }).catch(() => {});
  }, [product.id]);

  const images = product.images || [];
  const price = product.effective_price ?? product.sale_price ?? product.price;
  const hasSale = product.sale_price !== null && product.sale_price < product.price;
  const discount = hasSale
    ? Math.round(((product.price - (product.sale_price || 0)) / product.price) * 100)
    : 0;

  const stockStatus = (() => {
    if (product.stock_status === 'out_of_stock' || product.stock <= 0)
      return { text: 'Habis', className: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' };
    if (product.stock_status === 'low_stock' || product.stock <= product.low_stock_threshold)
      return { text: 'Stok Terbatas', className: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    return { text: 'Tersedia', className: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' };
  })();

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Halo Toko Arta Taru,\n\nSaya ingin menanyakan produk:\n\nNama: ${product.name}\nSKU: ${product.sku}\nHarga: ${formatPrice(price)}\n\nApakah produk tersebut masih tersedia?\n\nTerima kasih.`
    );
    const phone = whatsapp_number || '';
    const url = phone
      ? `https://wa.me/${phone}?text=${message}`
      : `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
    fetch('/api/v1/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' },
      body: JSON.stringify({ event_name: 'whatsapp_click', product_id: product.id }),
    }).catch(() => {});
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleWishlist = () => {
    let newWishlist: number[];
    if (wishlist.includes(product.id)) {
      newWishlist = wishlist.filter((id) => id !== product.id);
    } else {
      newWishlist = [...wishlist, product.id];
    }
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    window.dispatchEvent(new Event('storage'));
  };

  const isWishlisted = wishlist.includes(product.id);

  const breadcrumb = [
    { label: 'Beranda', href: '/' },
    product.category ? { label: product.category.name, href: `/kategori/${product.category.slug}` } : null,
    { label: product.name, href: '' },
  ].filter(Boolean) as { label: string; href: string }[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description || product.description,
    sku: product.sku,
    image: activeImage?.url,
    brand: product.brand ? { '@type': 'Brand', name: product.brand.name } : undefined,
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'IDR',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href ? `${window.location.origin}${item.href}` : undefined,
    })),
  };

  const currentImageIndex = images.findIndex((img) => img.id === activeImage?.id);

  const navigateImage = (dir: 'prev' | 'next') => {
    if (images.length === 0) return;
    let newIndex = dir === 'prev' ? currentImageIndex - 1 : currentImageIndex + 1;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    setActiveImage(images[newIndex]);
  };

  return (
    <PublicLayout>
      <Head>
        <title>{product.seo_title || product.name}</title>
        {product.meta_description && <meta name="description" content={product.meta_description} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6 flex-wrap">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-blue-600 transition-colors">{item.label}</Link>
              ) : (
                <span className="text-gray-900 font-medium truncate max-w-[200px]">{item.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden group">
              {activeImage ? (
                <img
                  src={activeImage.url}
                  alt={activeImage.alt_text || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-200" />
                </div>
              )}

              {/* Sale badge */}
              {hasSale && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-md uppercase tracking-wide">
                  -{discount}%
                </span>
              )}

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-gray-600 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Gambar sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-gray-600 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Gambar berikutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-2">
                {images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage?.id === img.id ? 'border-blue-500 shadow-sm scale-105' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img.url} alt={img.alt_text || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:pt-2">
            {product.brand && (
              <Link
                href={`/katalog?brand=${product.brand.slug}`}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 mb-2"
              >
                {product.brand.name}
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 mb-5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${stockStatus.className}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${stockStatus.dot}`} />
                {stockStatus.text}
              </span>
              <span className="text-xs text-gray-400">SKU: {product.sku}</span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              {hasSale ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-red-600">{formatPrice(product.sale_price!)}</span>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded">Hemat {discount}%</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              )}
            </div>

            {product.short_description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{product.short_description}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md shadow-green-500/20"
              >
                <MessageCircle className="w-5 h-5" />
                Tanya via WhatsApp
              </button>
              <button
                onClick={toggleWishlist}
                className={`p-3.5 rounded-xl border transition-all ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-3.5 rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all"
                aria-label="Bagikan"
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
              </button>
            </div>

            {copied && (
              <p className="text-sm text-green-600 mb-4 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Link produk disalin ke clipboard
              </p>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Shield, label: 'Kualitas Terjamin' },
                { icon: Truck, label: 'Pengiriman Cepat' },
                { icon: Headphones, label: 'Respon Cepat' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5 p-3 bg-gray-50 rounded-xl">
                  <item.icon className="w-5 h-5 text-blue-600" />
                  <span className="text-[11px] text-gray-600 font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t border-gray-100 pt-6 mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Deskripsi Produk</h2>
                <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Spesifikasi</h2>
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {product.specifications.map((spec, i) => (
                        <tr key={spec.id} className={i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                          <td className="py-2.5 px-4 text-gray-500 font-medium w-1/3">{spec.key}</td>
                          <td className="py-2.5 px-4 text-gray-900">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related_products && related_products.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" />
              Produk Terkait
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {related_products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicLayout>
  );
}
