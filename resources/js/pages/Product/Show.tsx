import { useEffect, useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
  ChevronRight, Package, Share2, MessageCircle, Heart, Check, Copy, Truck,
  Shield, Headphones, Minus, Plus, ChevronLeft, ShoppingBag, Star,
} from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import ProductCard from '@/components/ProductCard';
import { formatDate, formatPrice, whatsappLink } from '@/lib/format';
import type { PageProps, ProductShowProps } from '@/types';

export default function ProductShow({
  product,
  related_products,
  whatsapp_number,
  reviews = [],
  review_summary,
  reviewable_item,
  free_shipping_min_total,
  is_wishlisted,
}: ProductShowProps) {
  const { props } = usePage<PageProps>();
  const customer = props.auth?.customer;

  const variants = useMemo(() => (product.active_variants || product.variants || []).filter((v) => v.is_active !== false), [product]);
  const [activeImage, setActiveImage] = useState(product.primary_image || product.images?.[0] || null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(variants[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [wishlisted, setWishlisted] = useState(!!is_wishlisted);
  const [adding, setAdding] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const variant = variants.find((v) => v.id === selectedVariant) || null;
  const images = product.images || [];
  const basePrice = variant?.price != null ? Number(variant.price) : (product.effective_price ?? product.sale_price ?? product.price);
  const hasSale = variant?.price == null && product.sale_price !== null && product.sale_price < product.price;
  const discount = hasSale ? Math.round(((product.price - (product.sale_price || 0)) / product.price) * 100) : 0;
  const stock = variant ? variant.stock : product.stock;
  const isOutOfStock = stock <= 0;

  useEffect(() => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    fetch('/api/v1/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken, 'X-Requested-With': 'XMLHttpRequest' },
      body: JSON.stringify({ event_name: 'product_view', product_id: product.id }),
    }).catch(() => {});
  }, [product.id]);

  useEffect(() => {
    if (variant?.image?.url) setActiveImage(variant.image);
  }, [variant?.id]);

  const stockStatus = (() => {
    if (isOutOfStock) return { text: 'Habis', className: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' };
    if (stock <= product.low_stock_threshold) return { text: 'Stok Terbatas', className: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    return { text: 'Tersedia', className: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' };
  })();

  const handleWhatsApp = () => {
    const message = `Halo Toko Arta Taru,\n\nSaya ingin menanyakan produk:\n\nNama: ${product.name}\nSKU: ${variant?.sku || product.sku}\nHarga: ${formatPrice(basePrice)}\n\nApakah produk tersebut masih tersedia?\n\nTerima kasih.`;
    window.open(whatsappLink(whatsapp_number, message), '_blank');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleWishlist = async () => {
    if (!customer) {
      router.visit('/masuk');
      return;
    }

    try {
      const res = await fetch('/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ product_id: product.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setWishlisted(!!data.in_wishlist);
        router.reload({ only: ['wishlist_count'] });
      }
    } catch {}
  };

  const addToCart = () => {
    if (isOutOfStock) return;

    setAdding(true);
    router.post('/keranjang', {
      product_id: product.id,
      variant_id: selectedVariant,
      quantity,
    }, {
      preserveScroll: true,
      onFinish: () => setAdding(false),
    });
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewable_item) return;

    setReviewing(true);
    router.post('/ulasan', {
      order_item_id: reviewable_item.id,
      rating,
      comment,
    }, {
      preserveScroll: true,
      onFinish: () => setReviewing(false),
      onSuccess: () => { setComment(''); setRating(5); },
    });
  };

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
    sku: variant?.sku || product.sku,
    image: activeImage?.url,
    brand: product.brand ? { '@type': 'Brand', name: product.brand.name } : undefined,
    offers: {
      '@type': 'Offer',
      price: basePrice,
      priceCurrency: 'IDR',
      availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(review_summary && review_summary.count > 0
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: review_summary.average, reviewCount: review_summary.count } }
      : {}),
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
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                <img src={activeImage.url} alt={activeImage.alt_text || product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-200" />
                </div>
              )}

              {hasSale && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-md uppercase tracking-wide">
                  -{discount}%
                </span>
              )}

              {images.length > 1 && (
                <>
                  <button onClick={() => navigateImage('prev')} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-gray-600 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Gambar sebelumnya">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => navigateImage('next')} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-gray-600 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Gambar berikutnya">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-2">
                {images.map((img) => (
                  <button key={img.id} onClick={() => setActiveImage(img)} className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage?.id === img.id ? 'border-blue-500 shadow-sm scale-105' : 'border-gray-200 hover:border-gray-300'}`}>
                    <img src={img.url} alt={img.alt_text || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:pt-2">
            {product.brand && (
              <Link href={`/katalog?brand=${product.brand.slug}`} className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 mb-2">
                {product.brand.name}
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${stockStatus.className}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${stockStatus.dot}`} />
                {stockStatus.text}
              </span>
              <span className="text-xs text-gray-400">SKU: {variant?.sku || product.sku}</span>
              {review_summary && review_summary.count > 0 && (
                <span className="flex items-center gap-1 text-xs text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-current" /> {review_summary.average} ({review_summary.count} ulasan)
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mb-5 pb-5 border-b border-gray-100">
              {hasSale ? (
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-red-600">{formatPrice(product.sale_price!)}</span>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded">Hemat {discount}%</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">{formatPrice(basePrice)}</span>
              )}
              {free_shipping_min_total && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Gratis ongkir untuk belanja minimal {formatPrice(free_shipping_min_total)}
                </p>
              )}
            </div>

            {product.short_description && (
              <p className="text-gray-600 mb-5 leading-relaxed">{product.short_description}</p>
            )}

            {/* Variants */}
            {variants.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-medium text-gray-900 mb-2">Pilih Varian</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const disabled = v.stock <= 0;
                    return (
                      <button
                        key={v.id}
                        onClick={() => { setSelectedVariant(v.id); setQuantity(1); }}
                        disabled={disabled}
                        className={`px-3.5 py-2 rounded-xl border text-sm transition-all ${
                          selectedVariant === v.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                            : disabled
                              ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {v.label || v.name}
                        {v.price != null && <span className="block text-[10px] text-gray-400">{formatPrice(Number(v.price))}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity + CTA */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40" disabled={quantity <= 1}>
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(stock || 1, q + 1))} className="p-2.5 text-gray-500 hover:bg-gray-50 disabled:opacity-40" disabled={quantity >= stock}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={addToCart}
                disabled={isOutOfStock || adding}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-500/20"
              >
                <ShoppingBag className="w-5 h-5" />
                {isOutOfStock ? 'Stok Habis' : adding ? 'Menambahkan...' : 'Tambah ke Keranjang'}
              </button>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Tanya via WhatsApp
              </button>
              <button
                onClick={toggleWishlist}
                className={`p-3 rounded-xl border transition-all ${wishlisted ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
              <button onClick={handleShare} className="p-3 rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all" aria-label="Bagikan">
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
              </button>
            </div>

            {copied && (
              <p className="text-sm text-green-600 mb-4 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Link produk disalin ke clipboard
              </p>
            )}

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

            {product.description && (
              <div className="border-t border-gray-100 pt-6 mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Deskripsi Produk</h2>
                <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

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

        {/* Reviews */}
        <section className="mt-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" /> Ulasan Pembeli
            </h2>
            {review_summary && review_summary.count > 0 && (
              <span className="text-sm text-gray-500">{review_summary.average} / 5 · {review_summary.count} ulasan</span>
            )}
          </div>

          {reviewable_item && (
            <form onSubmit={submitReview} className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
              <p className="text-sm font-medium text-gray-900 mb-2">Beri ulasan untuk produk ini</p>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="p-0.5">
                    <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ceritakan pengalaman Anda menggunakan produk ini (opsional)"
              />
              <button type="submit" disabled={reviewing} className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60">
                {reviewing ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
              <p className="text-[11px] text-gray-400 mt-2">Ulasan tampil setelah disetujui admin.</p>
            </form>
          )}

          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada ulasan untuk produk ini.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900">{review.reviewer_name}</p>
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />
                      ))}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-2">{formatDate(review.created_at, false)}</p>
                  {review.comment && <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related products */}
        {related_products && related_products.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-400" /> Produk Terkait
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
