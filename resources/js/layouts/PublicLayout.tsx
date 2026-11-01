import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
  Menu, X, Heart, Search, ChevronRight, Phone, MapPin, Clock, MessageCircle,
  Camera, Globe, Video, ShoppingBag, Package, User as UserIcon, LogOut, ChevronDown,
  Truck, HelpCircle,
} from 'lucide-react';
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
  const [accountOpen, setAccountOpen] = useState(false);
  const { url, props } = usePage<PageProps>();
  const customer = props.auth?.customer ?? null;
  const cartCount = props.cart_count ?? 0;
  const wishlistCount = props.wishlist_count ?? 0;
  const store = props.store;

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
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

  const handleLogout = () => {
    router.post('/keluar');
  };

  const isActive = (href: string) => {
    if (href === '/') return url === '/';
    return url.startsWith(href);
  };

  const storeName = store?.name || 'Toko Arta Taru';
  const storePhone = store?.phone || '0888-2869-727';
  const storeHours = store?.hours || 'Senin - Sabtu, 08:00 - 21:00 WIB';
  const storeAddress = store?.address || 'Jl. Malioboro No. 45, Yogyakarta';
  const whatsapp = store?.whatsapp_number || '628882869727';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top bar */}
      <div className="hidden md:block bg-gray-900 text-gray-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> {storePhone}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> {storeHours}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/lacak-pesanan" className="flex items-center gap-1 hover:text-white transition-colors">
              <Truck className="w-3 h-3" /> Lacak Pesanan
            </Link>
            <a href={`https://wa.me/${whatsapp}`} className="flex items-center gap-1 hover:text-white transition-colors">
              <MessageCircle className="w-3 h-3" /> WhatsApp
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
                <span className="text-lg font-bold text-gray-900 block leading-none tracking-tight">{storeName}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Peralatan & Perlengkapan</span>
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
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/keranjang"
                className="relative p-2.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Keranjang"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="hidden sm:flex items-center gap-1.5 p-2.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  aria-label="Akun"
                >
                  <UserIcon className="w-5 h-5" />
                  <ChevronDown className="w-3 h-3" />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                    {customer ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900 truncate">{customer.name}</p>
                          <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                        </div>
                        <Link href="/akun" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <UserIcon className="w-4 h-4" /> Akun Saya
                        </Link>
                        <Link href="/akun/pesanan" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <Package className="w-4 h-4" /> Pesanan Saya
                        </Link>
                        <Link href="/wishlist" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          <Heart className="w-4 h-4" /> Wishlist
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" /> Keluar
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/masuk" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          Masuk
                        </Link>
                        <Link href="/daftar" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                          Daftar Akun
                        </Link>
                        <Link href="/lacak-pesanan" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100 mt-1">
                          <Truck className="w-4 h-4" /> Lacak Pesanan
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link
                href="/keranjang"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Keranjang
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
            <div className="pb-4">
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
              <Link href="/keranjang" className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Keranjang
                  {cartCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">{cartCount}</span>
                  )}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/wishlist" className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Wishlist
                  {wishlistCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{wishlistCount}</span>
                  )}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/lacak-pesanan" className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Lacak Pesanan</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/faq" className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4" /> FAQ</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
              <div className="border-t border-gray-100 mt-2 pt-2">
                {customer ? (
                  <>
                    <Link href="/akun" className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <span className="flex items-center gap-2"><UserIcon className="w-4 h-4" /> Akun Saya</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 px-2 py-2">
                    <Link href="/masuk" className="text-center px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700">Masuk</Link>
                    <Link href="/daftar" className="text-center px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium">Daftar</Link>
                  </div>
                )}
              </div>
            </nav>
            <div className="p-5 border-t border-gray-100 space-y-3">
              <a
                href={`https://wa.me/${whatsapp}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Hubungi WhatsApp
              </a>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 justify-center">
                <Phone className="w-3 h-3" /> {storePhone}
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
                  <span className="text-lg font-bold text-white block leading-none">{storeName}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Peralatan & Perlengkapan</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-5">
                Toko peralatan dan perlengkapan lengkap. Melayani kebutuhan rumah tangga, pertukangan, komunikasi, dan industri.
              </p>
              <div className="flex items-center gap-2">
                <a href={store?.instagram_url || '#'} className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-colors" aria-label="Instagram">
                  <Camera className="w-4 h-4" />
                </a>
                <a href={store?.facebook_url || '#'} className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors" aria-label="Facebook">
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
                  <Link href="/lacak-pesanan" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                    <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-white transition-colors" />
                    Lacak Pesanan
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Informasi</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/syarat-ketentuan" className="hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
                <li><Link href="/kebijakan-privasi" className="hover:text-white transition-colors">Kebijakan Privasi</Link></li>
                <li><Link href="/pengembalian" className="hover:text-white transition-colors">Pengembalian</Link></li>
                <li><Link href="/akun/pesanan" className="hover:text-white transition-colors">Pesanan Saya</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Kontak</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>{storeAddress}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>{storePhone}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>{storeHours}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <span>&copy; {new Date().getFullYear()} {storeName}. Hak cipta dilindungi.</span>
            <div className="flex items-center gap-4">
              <span>Pembayaran transfer bank · Pengiriman seluruh Indonesia</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
