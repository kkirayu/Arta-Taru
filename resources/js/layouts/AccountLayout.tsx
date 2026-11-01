import { Link, usePage, router } from '@inertiajs/react';
import { LayoutDashboard, Package, MapPin, Heart, User as UserIcon, LogOut, ChevronRight } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import type { PageProps } from '@/types';

interface AccountLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const menu = [
  { label: 'Ringkasan', href: '/akun', icon: LayoutDashboard },
  { label: 'Pesanan Saya', href: '/akun/pesanan', icon: Package },
  { label: 'Alamat', href: '/akun/alamat', icon: MapPin },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Profil', href: '/akun/profil', icon: UserIcon },
];

export default function AccountLayout({ children, title, description }: AccountLayoutProps) {
  const { url, props } = usePage<PageProps>();
  const customer = props.auth?.customer;

  return (
    <PublicLayout>
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-3 lg:sticky lg:top-24">
                {customer && (
                  <div className="px-3 py-3 mb-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{customer.name}</p>
                    <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                  </div>
                )}
                <nav className="flex lg:flex-col gap-1 overflow-x-auto">
                  {menu.map((item) => {
                    const active = item.href === '/akun' ? url === '/akun' : url.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                          active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                        <ChevronRight className={`w-3.5 h-3.5 ml-auto hidden lg:block ${active ? 'text-blue-500' : 'text-gray-300'}`} />
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => router.post('/keluar')}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 whitespace-nowrap"
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </nav>
              </div>
            </aside>

            <div className="lg:col-span-3 min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
