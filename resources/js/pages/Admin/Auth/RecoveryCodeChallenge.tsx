import { Head, useForm } from '@inertiajs/react';
import { Package, Key, Shield, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import type { RecoveryCodeChallengeProps } from '@/types';

export default function RecoveryCodeChallenge({ errors }: RecoveryCodeChallengeProps) {
  const { data, setData, post, processing } = useForm({
    code: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/recovery-code-challenge');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/25">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Toko Arta Taru</h1>
          <p className="text-amber-200 text-sm mt-1">Masuk dengan kode recovery</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
            <Key className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-900">Masukkan kode recovery</p>
              <p className="text-sm text-amber-700">Kode 8 karakter dari daftar kode cadangan Anda (hanya bisa digunakan sekali)</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1.5">Kode Recovery</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="code"
                  type="text"
                  value={data.code}
                  onChange={(e) => setData('code', e.target.value.toUpperCase())}
                  maxLength={8}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors text-center tracking-wider font-mono uppercase"
                  placeholder="ABCD1234"
                  autoComplete="one-time-code"
                />
              </div>
              {errors.code && <p className="mt-1.5 text-sm text-red-600">{errors.code}</p>}
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
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-semibold rounded-xl hover:from-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-md shadow-amber-500/25"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin w-4 h-4" />
                  Memverifikasi...
                </span>
              ) : 'Verifikasi'}
            </button>
          </form>

          <div className="mt-6">
            <a
              href="/admin/two-factor-challenge"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Shield className="w-4 h-4" />
              Kembali ke kode 2FA
            </a>
          </div>
        </div>

        <p className="text-center text-amber-200/60 text-xs mt-6">Dilindungi keamanan enkripsi</p>
      </div>
    </div>
  );
}