import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Warehouse,
  Image,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  CreditCard,
  Users,
  Truck,
  Star,
  UserCog,
  Bell,
} from 'lucide-react';
import FlashMessage from '@/components/FlashMessage';
import type { PageProps, User } from '@/types';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface SidebarItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  {
    label: 'Penjualan',
    icon: ShoppingCart,
    children: [
      { label: 'Pesanan', href: '/admin/orders' },
      { label: 'Pembayaran', href: '/admin/payments' },
      { label: 'Laporan', href: '/admin/reports' },
    ],
  },
  {
    label: 'Pelanggan',
    icon: Users,
    children: [
      { label: 'Daftar Pelanggan', href: '/admin/customers' },
      { label: 'Ulasan', href: '/admin/reviews' },
    ],
  },
  {
    label: 'Katalog',
    icon: Package,
    children: [
      { label: 'Produk', href: '/admin/products' },
      { label: 'Kategori', href: '/admin/categories' },
      { label: 'Brand', href: '/admin/brands' },
      { label: 'Inventaris', href: '/admin/inventory' },
    ],
  },
  {
    label: 'Pengiriman',
    icon: Truck,
    children: [{ label: 'Tarif Ongkir', href: '/admin/shipping-rates' }],
  },
  {
    label: 'Konten',
    icon: Image,
    children: [{ label: 'Banner', href: '/admin/banners' }],
  },
  {
    label: 'Analitik',
    icon: BarChart3,
    children: [{ label: 'Analytics', href: '/admin/analytics' }],
  },
  {
    label: 'Sistem',
    icon: Settings,
    children: [
      { label: 'Pengguna', href: '/admin/users' },
      { label: 'Activity Logs', href: '/admin/activity-logs' },
      { label: 'Settings', href: '/admin/settings' },
    ],
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { url, props } = usePage<PageProps>();
  const user = props.auth.user as User | null;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  useEffect(() => {
    const current = sidebarItems.find((item) =>
      item.children?.some((child) => url.startsWith(child.href))
    );
    if (current) {
      setExpandedGroups((prev) =>
        prev.includes(current.label) ? prev : [...prev, current.label]
      );
    }
  }, [url]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [url]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) =>
    href === '/admin' ? url === '/admin' : url.startsWith(href);

  const handleLogout = () => {
    router.post('/admin/logout');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link href="/admin" className="text-lg font-bold text-blue-600">
            Arta Taru
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-gray-400 hover:bg-gray-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {sidebarItems.map((item) => (
            <div key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {item.label}
                    </span>
                    {expandedGroups.includes(item.label) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedGroups.includes(item.label) && item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive(child.href)
                              ? 'text-blue-600 bg-blue-50 font-medium'
                              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <Link
              href="/admin/payments"
              className="relative p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Pembayaran menunggu verifikasi"
            >
              <Bell className="w-5 h-5" />
              {(props.unread_notifications ?? 0) > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {props.unread_notifications}
                </span>
              )}
            </Link>
            <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <FlashMessage />

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
