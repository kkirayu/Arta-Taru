import { Head, useForm } from '@inertiajs/react';
import { Package, Smartphone, Shield, AlertCircle, Key, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import type { TwoFactorChallengeProps } from '@/types';

export default function TwoFactorChallenge({ recoveryCodesEnabled, errors }: TwoFactorChallengeProps) {
  const { data, setData, post, processing } = useForm({
    code: '',
    recovery_code: '',
  });
  const [showRecoveryCode, setShowRecoveryCode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showRecoveryCode) {
      post('/admin/recovery-code-challenge');
    } else {
      post('/admin/two-factor-challenge');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Toko Arta Taru</h1>
          <p className="text-blue-200 text-sm mt-1">Autentikasi dua faktor</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {!showRecoveryCode ? (
            <>
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
                <Smartphone className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">Masukkan kode 6 digit</p>
                  <p className="text-sm text-blue-700">Dari aplikasi authenticator Anda (Google Authenticator, Authy, dll)</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1.5">Kode 2FA</label>
                  <div className="relative">
                    <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="code"
                      type="text"
                      value={data.code}
                      onChange={(e) => setData('code', e.target.value)}
                      maxLength={6}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-center tracking-widest text-2xl font-mono"
                      placeholder="000000"
                      autoComplete="one-time-code"
                      inputMode="numeric"
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
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-md shadow-blue-500/25"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="animate-spin w-4 h-4" />
                      Memverifikasi...
                    </span>
                  ) : 'Verifikasi'}
                </button>
              </form>

              {recoveryCodesEnabled && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowRecoveryCode(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    Gunakan kode recovery
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                <Key className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-900">Masukkan kode recovery</p>
                  <p className="text-sm text-amber-700">Kode 8 karakter dari daftar kode cadangan Anda (hanya bisa digunakan sekali)</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="recovery_code" className="block text-sm font-medium text-gray-700 mb-1.5">Kode Recovery</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="recovery_code"
                      type="text"
                      value={data.recovery_code}
                      onChange={(e) => setData('recovery_code', e.target.value.toUpperCase())}
                      maxLength={8}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-center tracking-wider font-mono uppercase"
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
                <button
                  type="button"
                  onClick={() => setShowRecoveryCode(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Kembali ke kode 2FA
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-blue-200/60 text-xs mt-6">Dilindungi keamanan enkripsi</p>
      </div>
    </div>
  );
}