import { Head, useForm, Link } from '@inertiajs/react';
import { Lock, Mail, Package, ArrowLeft, AlertCircle } from 'lucide-react';
import type { ForgotPasswordProps } from '@/types';

export default function ForgotPassword({ errors, status }: ForgotPasswordProps) {
  const { data, setData, post, processing } = useForm({
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Toko Arta Taru</h1>
          <p className="text-blue-200 text-sm mt-1">Lupa password? Kami akan kirim link reset</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {status && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-6">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-700">{status}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="admin@artataru.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
            </div>

            {errors.general && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-md shadow-blue-500/25"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-0V9a8 8 0 00-16 0v3z" />
                  </svg>
                  Mengirim...
                </span>
              ) : 'Kirim Link Reset'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            <Link href="/admin/login" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 justify-center">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Link>
          </p>
        </div>

        <p className="text-center text-blue-200/60 text-xs mt-6">Dilindungi keamanan enkripsi</p>
      </div>
    </div>
  );
}