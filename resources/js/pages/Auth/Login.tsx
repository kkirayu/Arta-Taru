import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import type { LoginProps } from '@/types';

export default function Login({ alreadyLoggedIn }: LoginProps) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/masuk');
  };

  return (
    <PublicLayout>
      <Head title="Masuk" />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="text-center mb-7">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <LogIn className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Masuk ke Akun</h1>
              <p className="text-sm text-gray-500 mt-1">Lihat riwayat pesanan dan alamat tersimpan.</p>
            </div>

            {alreadyLoggedIn && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                Anda sudah masuk.{' '}
                <Link href="/akun" className="font-semibold underline">Buka akun saya</Link>
              </div>
            )}

            {errors.email && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{errors.email}</span>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
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
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link href="/lupa-password" className="text-xs text-blue-600 hover:underline">Lupa password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Ingat saya
              </label>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                {processing ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Belum punya akun?{' '}
              <Link href="/daftar" className="text-blue-600 font-semibold hover:underline">Daftar sekarang</Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Ingin belanja tanpa akun?{' '}
            <Link href="/katalog" className="underline hover:text-gray-600">Lanjut sebagai tamu</Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
