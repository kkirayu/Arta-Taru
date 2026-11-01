import { Head, useForm, Link } from '@inertiajs/react';
import { Lock, Mail, Package, Eye, EyeOff, AlertCircle, Smartphone, Key, Shield, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type { LoginProps } from '@/types';

export default function Login({ errors, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors: formErrors } = useForm({
    email: '',
    password: '',
    remember: false,
    two_factor_code: '',
    recovery_code: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showRecoveryCode, setShowRecoveryCode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear 2FA fields if not showing
    if (!showTwoFactor) {
      setData('two_factor_code', '');
    }
    if (!showRecoveryCode) {
      setData('recovery_code', '');
    }
    post('/admin/login', {
      forceFormData: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  };

  const toggleTwoFactor = () => {
    setShowTwoFactor(!showTwoFactor);
    if (!showTwoFactor) {
      setShowRecoveryCode(false);
    }
  };

  const toggleRecoveryCode = () => {
    setShowRecoveryCode(!showRecoveryCode);
    if (showRecoveryCode) {
      setShowTwoFactor(false);
    }
  };

  // Handle generic errors
  const generalError = errors.general;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Toko Arta Taru</h1>
          <p className="text-blue-200 text-sm mt-1">Masuk ke panel admin</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
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
                  autoComplete="username"
                />
              </div>
              {(formErrors.email || errors.email) && <p className="mt-1.5 text-sm text-red-600">{formErrors.email || errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {(formErrors.password || errors.password) && <p className="mt-1.5 text-sm text-red-600">{formErrors.password || errors.password}</p>}
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Ingat saya</span>
              </label>
            </div>

            {/* Two-Factor Code Input */}
            {showTwoFactor && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900 text-sm">Kode 2FA (6 digit)</p>
                    <p className="text-xs text-blue-700">Dari aplikasi authenticator Anda</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="two_factor_code" className="block text-sm font-medium text-gray-700 mb-1.5">Kode Verifikasi</label>
                  <div className="relative">
                    <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="two_factor_code"
                      type="text"
                      value={data.two_factor_code}
                      onChange={(e) => setData('two_factor_code', e.target.value)}
                      maxLength={6}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-center tracking-widest text-2xl font-mono"
                      placeholder="000000"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                    />
                  </div>
                  {(formErrors.two_factor_code || errors.two_factor_code) && <p className="mt-1.5 text-sm text-red-600">{formErrors.two_factor_code || errors.two_factor_code}</p>}
                </div>
              </div>
            )}

            {/* Recovery Code Input */}
            {showRecoveryCode && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <Key className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-900 text-sm">Kode Recovery (8 karakter)</p>
                    <p className="text-xs text-amber-700">Dari daftar kode cadangan Anda (hanya sekali pakai)</p>
                  </div>
                </div>
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
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors text-center tracking-wider font-mono uppercase"
                      placeholder="ABCD1234"
                      autoComplete="one-time-code"
                    />
                  </div>
                  {(formErrors.recovery_code || errors.recovery_code) && <p className="mt-1.5 text-sm text-red-600">{formErrors.recovery_code || errors.recovery_code}</p>}
                </div>
              </div>
            )}

            {generalError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in shake duration-300">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{generalError}</p>
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
                  Memproses...
                </span>
              ) : 'Masuk'}
            </button>
          </form>

          {/* 2FA Toggle Links */}
          {!showTwoFactor && !showRecoveryCode && (
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={toggleTwoFactor}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                Gunakan kode 2FA (aplikasi authenticator)
              </button>
              <button
                type="button"
                onClick={toggleRecoveryCode}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Key className="w-4 h-4" />
                Gunakan kode recovery
              </button>
            </div>
          )}

          {!!(showTwoFactor || showRecoveryCode) && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowTwoFactor(false);
                  setShowRecoveryCode(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                Kembali ke login biasa
              </button>
            </div>
          )}

          {canResetPassword && (
            <p className="text-center text-sm text-gray-600 mt-6">
              <Link href="/admin/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                Lupa password?
              </Link>
            </p>
          )}

          <p className="text-center text-sm text-gray-600 mt-4">
            Belum punya akun?{' '}
            <Link href="/admin/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Daftar
            </Link>
          </p>
        </div>

        <p className="text-center text-blue-200/60 text-xs mt-6">Dilindungi keamanan enkripsi</p>
      </div>
    </div>
  );
}