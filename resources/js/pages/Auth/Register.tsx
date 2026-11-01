import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, User as UserIcon, Phone, UserPlus } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import type { RegisterProps } from '@/types';

export default function Register(_props: RegisterProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    agree: false,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/daftar');
  };

  return (
    <PublicLayout>
      <Head title="Daftar" />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="text-center mb-7">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <UserPlus className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Buat Akun Baru</h1>
              <p className="text-sm text-gray-500 mt-1">Checkout lebih cepat dan pantau pesanan Anda.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Nama Anda"
                    autoComplete="name"
                    required
                  />
                </div>
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="nama@email.com"
                    autoComplete="email"
                    required
                  />
                </div>
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="08xxxxxxxxxx"
                    autoComplete="tel"
                    required
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                    required
                  />
                </div>
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ulangi password"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={data.agree}
                  onChange={(e) => setData('agree', e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span>
                  Saya menyetujui{' '}
                  <Link href="/syarat-ketentuan" className="text-blue-600 hover:underline">syarat & ketentuan</Link>{' '}
                  dan{' '}
                  <Link href="/kebijakan-privasi" className="text-blue-600 hover:underline">kebijakan privasi</Link>.
                </span>
              </label>
              {errors.agree && <p className="text-xs text-red-600">{errors.agree}</p>}

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                {processing ? 'Memproses...' : 'Daftar'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Sudah punya akun?{' '}
              <Link href="/masuk" className="text-blue-600 font-semibold hover:underline">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
