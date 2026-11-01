import { Head, useForm } from '@inertiajs/react';
import { User as UserIcon, Mail, Phone, Lock, Save } from 'lucide-react';
import AccountLayout from '@/layouts/AccountLayout';
import type { AccountProfileProps } from '@/types';

export default function AccountProfile({ user }: AccountProfileProps) {
  const profile = useForm({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  const password = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    profile.put('/akun/profil', { preserveScroll: true });
  };

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    password.put('/akun/password', {
      preserveScroll: true,
      onSuccess: () => password.reset(),
    });
  };

  return (
    <AccountLayout title="Profil" description="Perbarui data kontak dan password akun Anda.">
      <Head title="Profil" />

      <div className="space-y-5">
        <form onSubmit={submitProfile} className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-gray-400" /> Data Pribadi
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={profile.data.name}
                  onChange={(e) => profile.setData('name', e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              {profile.errors.name && <p className="text-xs text-red-600 mt-1">{profile.errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={profile.data.email}
                  onChange={(e) => profile.setData('email', e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              {profile.errors.email && <p className="text-xs text-red-600 mt-1">{profile.errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={profile.data.phone}
                  onChange={(e) => profile.setData('phone', e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              {profile.errors.phone && <p className="text-xs text-red-600 mt-1">{profile.errors.phone}</p>}
            </div>

            <button
              type="submit"
              disabled={profile.processing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60"
            >
              <Save className="w-4 h-4" /> {profile.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>

        <form onSubmit={submitPassword} className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-400" /> Ubah Password
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Saat Ini</label>
              <input
                type="password"
                value={password.data.current_password}
                onChange={(e) => password.setData('current_password', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
              {password.errors.current_password && <p className="text-xs text-red-600 mt-1">{password.errors.current_password}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Baru</label>
                <input
                  type="password"
                  value={password.data.password}
                  onChange={(e) => password.setData('password', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
                {password.errors.password && <p className="text-xs text-red-600 mt-1">{password.errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password</label>
                <input
                  type="password"
                  value={password.data.password_confirmation}
                  onChange={(e) => password.setData('password_confirmation', e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={password.processing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-60"
            >
              <Lock className="w-4 h-4" /> {password.processing ? 'Menyimpan...' : 'Ubah Password'}
            </button>
          </div>
        </form>
      </div>
    </AccountLayout>
  );
}
