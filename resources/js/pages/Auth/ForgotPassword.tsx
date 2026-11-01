import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, KeyRound } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import type { ForgotPasswordProps } from '@/types';

export default function ForgotPassword({ status }: ForgotPasswordProps) {
  const { data, setData, post, processing, errors } = useForm({ email: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/lupa-password');
  };

  return (
    <PublicLayout>
      <Head title="Lupa Password" />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Lupa Password</h1>
            <p className="text-sm text-gray-500 mt-1">Masukkan email Anda, kami kirim tautan reset.</p>
          </div>

          {status && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">{status}</div>
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
                  required
                />
              </div>
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {processing ? 'Mengirim...' : 'Kirim Tautan Reset'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Ingat password Anda?{' '}
            <Link href="/masuk" className="text-blue-600 font-semibold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
