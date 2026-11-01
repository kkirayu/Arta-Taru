import { Head, useForm } from '@inertiajs/react';
import { Package, Mail, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import type { VerifyEmailProps } from '@/types';

export default function VerifyEmail({}: VerifyEmailProps) {
  const { data, setData, post, processing } = useForm({});

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/verification-notification');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Toko Arta Taru</h1>
          <p className="text-blue-200 text-sm mt-1">Verifikasi alamat email Anda</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Periksa Email Anda</h2>
            <p className="text-gray-600 mt-2">
              Kami telah mengirim tautan verifikasi ke alamat email Anda.
              Silakan periksa kotak masuk (dan folder spam) lalu klik tautan tersebut.
            </p>
          </div>

          <form onSubmit={handleResend} className="space-y-4">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-md shadow-blue-500/25"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin w-4 h-4" />
                  Mengirim...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Kirim Ulang Link Verifikasi
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Link verifikasi berlaku selama 60 menit.
          </p>
        </div>

        <p className="text-center text-blue-200/60 text-xs mt-6">Dilindungi keamanan enkripsi</p>
      </div>
    </div>
  );
}