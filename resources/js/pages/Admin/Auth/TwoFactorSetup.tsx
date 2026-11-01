import { Head, useForm } from '@inertiajs/react';
import { Package, Shield, Smartphone, QrCode, Key, Check, AlertCircle, Copy, RefreshCw, Download, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { TwoFactorSetupProps } from '@/types';

export default function TwoFactorSetup({ secret, qr_code_url, recovery_codes, errors }: TwoFactorSetupProps) {
  const { data, setData, post, processing } = useForm({
    code: '',
  });
  const [showCodes, setShowCodes] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/two-factor');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadCodes = () => {
    const content = `Arta Taru - Kode Recovery 2FA\n\n${recovery_codes.join('\n')}\n\nSimpan kode ini dengan aman. Setiap kode hanya bisa digunakan sekali.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'artataru-2fa-recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Toko Arta Taru</h1>
          <p className="text-blue-200 text-sm mt-1">Aktifkan autentikasi dua faktor (2FA)</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 space-y-8">
          {/* Step 1: Scan QR Code */}
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
              Pindai kode QR
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600 mb-3 text-center">Pindai dengan aplikasi authenticator</p>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <img
                      src={qr_code_url}
                      alt="QR Code untuk 2FA"
                      className="w-48 h-48"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">Google Authenticator, Authy, Microsoft Authenticator, dll</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-3">Atau masukkan kunci rahasia secara manual:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={secret}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-center tracking-wider focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(secret, 'secret')}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      {copied === 'secret' ? 'Tersalin!' : 'Salin'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Recovery Codes */}
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">2</span>
              Simpan kode recovery
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Key className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900">Penting: Simpan kode ini dengan aman!</p>
                  <p className="text-sm text-amber-700 mt-1">Setiap kode hanya bisa digunakan <strong>sekali</strong>. Jika kehilangan akses ke aplikasi authenticator, gunakan salah satu kode ini untuk masuk.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4" role="list">
                {recovery_codes.map((code, index) => (
                  <div
                    key={code}
                    className="bg-white border border-amber-200 rounded-lg p-3 text-center relative group"
                    role="listitem"
                  >
                    <span className="font-mono text-lg font-semibold text-amber-800 tracking-wider">{code}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(code, `code-${index}`)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-amber-500 hover:text-amber-700 transition-opacity p-1"
                      aria-label={`Salin kode ${code}`}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copied === `code-${index}` && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        Tersalin!
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={downloadCodes}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-amber-200 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Unduh File
                </button>
                <button
                  type="button"
                  onClick={() => recovery_codes.forEach((c, i) => copyToClipboard(c, `code-${i}`))}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Salin Semua
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Verify & Enable */}
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">3</span>
              Verifikasi & aktifkan
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-sm text-gray-600 mb-4">
                Masukkan kode 6 digit dari aplikasi authenticator Anda untuk mengaktifkan 2FA.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-center tracking-widest text-2xl font-mono"
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
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-md shadow-green-500/25"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="animate-spin w-4 h-4" />
                      Memverifikasi...
                    </span>
                  ) : 'Aktifkan 2FA'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <p className="text-center text-blue-200/60 text-xs mt-6">Dilindungi keamanan enkripsi</p>
      </div>
    </div>
  );
}