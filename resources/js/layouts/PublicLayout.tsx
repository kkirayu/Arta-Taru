import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Menu, X, Heart, Search, ChevronRight, Phone, MapPin, Clock, MessageCircle, Camera, Globe, Video, ShoppingBag, Package } from 'lucide-react';
import FlashMessage from '@/components/FlashMessage';
import type { PageProps } from '@/types';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Katalog', href: '/katalog' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'Kontak', href: '/kontak' },
];

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { url, props } = usePage<PageProps>();
  const wishlistCount = (() => {
    if (typeof window === 'undefined') return 0;
    try {
      const stored = localStorage.getItem('wishlist');
      return stored ? JSON.parse(stored).length : 0;
    } catch { return 0; }
  })();
  const [wishlistNum, setWishlistNum] = useState(0);

  useEffect(() => {
    setWishlistNum(wishlistCount);
  }, [url]);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [url]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.get('/katalog', { search: searchValue.trim() }, { preserveState: true });
    }
    setSearchOpen(false);
  };

  const isActive = (href: string) => {
    if (href === '/') return url === '/';
    return url.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top bar */}
      <div className="hidden md:block bg-gray-900 text-gray-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> 0888-2869-727
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Senin - Sabtu, 08:00 - 21:00 WIB
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">
              <Camera className="w-3 h-3" /> Instagram
            </a>
            <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">
              <Globe className="w-3 h-3" /> Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-40 bg-white border-b transition-all ${scrolled ? 'border-gray-200 shadow-sm' : 'border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900 block leading-none tracking-tight">Arta Taru</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Katalog Peralatan</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Cari produk"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/wishlist"
                className="relative p-2.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistNum > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistNum}
                  </span>
                )}
              </Link>
              <Link
                href="/kontak"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Buka menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar expand */}
          {searchOpen && (
            <div className="pb-4 animate-[fadeIn_0.2s_ease-out]">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Cari produk, brand, atau kategori..."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <span className="font-bold text-gray-900 text-lg">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
              <Link
                href="/wishlist"
                className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Wishlist
                  {wishlistNum > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                      {wishlistNum}
                    </span>
                  )}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            </nav>
            <div className="p-5 border-t border-gray-100 space-y-3">
              <Link
                href="/kontak"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Hubungi WhatsApp
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 justify-center">
                <Phone className="w-3 h-3" /> 0888-2869-727
              </div>
            </div>
          </div>
        </div>
      )}

      <FlashMessage />

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-white block leading-none">Arta Taru</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Katalog Peralatan</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-5">
                Toko peralatan dan perlengkapan lengkap. Melayani kebutuhan rumah tangga, pertukangan, komunikasi, dan industri.
              </p>
              <div className="flex items-center gap-2">
                <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-colors" aria-label="Instagram">
                  <Camera className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors" aria-label="Facebook">
                  <Globe className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-colors" aria-label="YouTube">
                  <Video className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Tautan Cepat</h3>
              <ul className="space-y-2.5 text-sm">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                      <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors" />
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/wishlist" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                    <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors" />
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Kategori</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/kategori/pakaian" className="hover:text-white transition-colors">Pakaian</Link></li>
                <li><Link href="/kategori/alat-komunikasi" className="hover:text-white transition-colors">Alat Komunikasi</Link></li>
                <li><Link href="/kategori/alat-otomotif" className="hover:text-white transition-colors">Alat Otomotif</Link></li>
                <li><Link href="/kategori/peralatan-teknikal" className="hover:text-white transition-colors">Peralatan Teknikal</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Kontak</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>Jl. Malioboro No. 45, Yogyakarta, DI Yogyakarta</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>0888-2869-727</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>Senin - Sabtu: 08:00 - 21:00 WIB</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <span>&copy; {new Date().getFullYear()} Toko Arta Taru. Hak cipta dilindungi.</span>
            <div className="flex items-center gap-4">
              <span>Dibuat dengan dedikasi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
