import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ChevronRight,
  Package,
  Share2,
  MessageCircle,
  Star,
  Check,
  Copy,
} from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import ProductCard from '@/components/ProductCard';
import type { ProductShowProps, Product } from '@/types';

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

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    router.post('/api/v1/analytics/events', { event_name: 'product_view', product_id: product.id, session_id: '' }, { preserveState: true, preserveScroll: true });
  }, [product.id]);

  const images = product.images || [];
  const price = product.effective_price ?? product.sale_price ?? product.price;
  const hasSale = product.sale_price !== null && product.sale_price < product.price;

  const stockStatus = (() => {
    if (product.stock_status === 'out_of_stock' || product.stock <= 0)
      return { text: 'Habis', className: 'bg-red-100 text-red-700' };
    if (product.stock_status === 'low_stock' || product.stock <= product.low_stock_threshold)
      return { text: 'Stok Terbatas', className: 'bg-yellow-100 text-yellow-700' };
    return { text: 'Tersedia', className: 'bg-green-100 text-green-700' };
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
    image: activeImage?.path,
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

  return (
    <PublicLayout>
      <Head>
        <title>{product.seo_title || product.name}</title>
        {product.meta_description && <meta name="description" content={product.meta_description} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6 flex-wrap">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-blue-600">{item.label}</Link>
              ) : (
                <span className="text-gray-900">{item.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
              {activeImage ? (
                <img
                  src={activeImage.path}
                  alt={activeImage.alt_text || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-300" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage?.id === img.id ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img.path} alt={img.alt_text || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.brand && (
              <p className="text-sm text-gray-500 mb-1">{product.brand.name}</p>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${stockStatus.className}`}>
                {stockStatus.text}
              </span>
              <span className="text-sm text-gray-400">SKU: {product.sku}</span>
            </div>

            <div className="mb-6">
              {hasSale ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-red-600">{formatPrice(product.sale_price!)}</span>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              )}
            </div>

            {product.short_description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{product.short_description}</p>
            )}

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Tanya via WhatsApp
              </button>
              <button
                onClick={toggleWishlist}
                className={`p-3 rounded-lg border transition-colors ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Star className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {product.description && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi</h2>
                <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {product.specifications && product.specifications.length > 0 && (
              <div className="border-t pt-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Spesifikasi</h2>
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((spec) => (
                      <tr key={spec.id} className="border-b border-gray-100">
                        <td className="py-2 text-gray-500 w-1/3">{spec.key}</td>
                        <td className="py-2 text-gray-900">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {related_products && related_products.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Produk Terkait</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
