import { Head, Link } from '@inertiajs/react';
import { Phone, MapPin, Clock, ChevronRight, ArrowRight, MessageCircle, FolderOpen, Shield, Truck, Headphones, Tag, Package, Zap } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import ProductCard from '@/components/ProductCard';
import type { HomeProps, Banner, Category } from '@/types';
import { useState, useEffect } from 'react';

function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    // Default hero when no banners
    return (
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-medium text-blue-200 mb-5 border border-white/20">
              <Zap className="w-3 h-3" /> Peralatan Berkualitas, Harga Terjangkau
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
              Katalog Peralatan <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Toko Arta Taru</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
              Temukan peralatan komunikasi, otomotif, teknikal, dan pakaian tactical berkualitas. Hubungi kami via WhatsApp untuk pemesanan.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Lihat Katalog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Tanya via WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const banner = banners[current];

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-medium text-blue-200 mb-5 border border-white/20">
            <Zap className="w-3 h-3" /> Peralatan Berkualitas, Harga Terjangkau
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
              {banner.subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {banner.cta_label && banner.cta_url && (
              <Link
                href={banner.cta_url}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                {banner.cta_label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              Tanya via WhatsApp
            </Link>
          </div>
        </div>
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CategoryIcon({ slug }: { slug: string }) {
  const icons: Record<string, React.ElementType> = {
    pakaian: Tag,
    'alat-komunikasi': MessageCircle,
    'alat-otomotif': Truck,
    'peralatan-teknikal': Package,
  };
  const Icon = icons[slug] || FolderOpen;
  return <Icon className="w-7 h-7" />;
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      key={category.id}
      href={`/kategori/${category.slug}`}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300 text-blue-600">
          <CategoryIcon slug={category.slug} />
        </div>
        {category.products_count !== undefined && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-white/80 backdrop-blur text-gray-600 text-[10px] font-semibold rounded-full">
            {category.products_count} produk
          </span>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
          Lihat produk <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </p>
      </div>
    </Link>
  );
}

export default function Home({ banners, categories, featured_products, latest_products }: HomeProps) {
  return (
    <PublicLayout>
      <Head title="Toko Arta Taru - Peralatan & Perlengkapan Lengkap" />

      <BannerCarousel banners={banners} />

      {/* Trust badges */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: 'Kualitas Terjamin', desc: 'Produk asli & berkualitas' },
              { icon: Truck, title: 'Pengiriman Cepat', desc: 'Diproses setiap hari' },
              { icon: Headphones, title: 'Layanan Responsif', desc: 'Chat WhatsApp langsung' },
              { icon: Tag, title: 'Harga Bersaing', desc: 'Satuan & grosir' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-end justify-between mb-7">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Kategori Produk</h2>
              <p className="text-gray-400 text-sm mt-1">Jelajahi berbagai kategori peralatan</p>
            </div>
            <Link
              href="/katalog"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured_products.length > 0 && (
        <section className="bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex items-end justify-between mb-7">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full text-xs font-semibold text-blue-700 mb-2">
                  <Zap className="w-3 h-3" /> Pilihan Terbaik
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Produk Unggulan</h2>
              </div>
              <Link
                href="/katalog"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
              >
                Lihat Semua
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {featured_products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      {latest_products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-end justify-between mb-7">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full text-xs font-semibold text-green-700 mb-2">
                <Package className="w-3 h-3" /> Baru Ditambahkan
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Produk Terbaru</h2>
            </div>
            <Link
              href="/katalog"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {latest_products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Punya Pertanyaan?</h2>
              <p className="text-green-100 text-lg">Chat langsung dengan tim kami via WhatsApp. Respon cepat saat jam operasional.</p>
            </div>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 px-7 py-4 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors shadow-lg whitespace-nowrap"
            >
              <MessageCircle className="w-5 h-5" />
              Hubungi Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Store Info */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Informasi Toko</h2>
            <p className="text-gray-400">Kunjungi atau hubungi kami untuk informasi lebih lanjut</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Jl. Raya Utama No. 123, Bandung, Jawa Barat</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Jam Operasional</h3>
                <p className="text-sm text-gray-500">Senin - Sabtu: 08:00 - 17:00</p>
                <p className="text-sm text-gray-400">Minggu: Tutup</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Telepon / WhatsApp</h3>
                <p className="text-sm text-gray-500">081234567890</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
