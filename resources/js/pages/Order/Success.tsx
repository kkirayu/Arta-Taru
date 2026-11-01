import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle2, Copy, Check, Upload, Building2, Clock, MessageCircle, ArrowRight, FileText, AlertCircle } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import { formatDate, formatPrice, whatsappLink } from '@/lib/format';
import type { OrderPageProps } from '@/types';

export default function OrderSuccess({ order, bank_accounts, whatsapp_number, guest_token }: OrderPageProps) {
  const [copied, setCopied] = useState(false);
  const { data, setData, post, processing, errors, progress } = useForm<{ proof: File | null; bank_name: string }>({
    proof: null,
    bank_name: bank_accounts[0]?.bank || '',
  });

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.proof) return;
    const tokenQuery = guest_token ? `?token=${guest_token}` : '';
    post(`/pesanan/${order.order_number}/bukti${tokenQuery}`, {
      forceFormData: true,
      preserveScroll: true,
    });
  };

  return (
    <PublicLayout>
      <Head title={`Pesanan ${order.order_number}`} />
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Pesanan Berhasil Dibuat</h1>
            <p className="text-sm text-gray-500 mt-1">Terima kasih! Selesaikan pembayaran agar pesanan segera diproses.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Nomor Pesanan</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-gray-900">{order.order_number}</span>
                  <button onClick={copyOrderNumber} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg" aria-label="Salin">
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Transfer</p>
                <p className="text-xl font-bold text-blue-600">{formatPrice(order.grand_total)}</p>
                {Number(order.unique_code) > 0 && (
                  <p className="text-[11px] text-amber-600">Termasuk kode unik {formatPrice(order.unique_code)}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Bayar sebelum <strong>{formatDate(order.expires_at)}</strong> atau pesanan dibatalkan otomatis.</span>
            </div>

            <div className="mt-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" /> Transfer ke salah satu rekening
              </h2>
              <div className="space-y-2">
                {bank_accounts.map((bank, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{bank.bank}</p>
                      <p className="text-xs text-gray-500">a.n. {bank.account_name}</p>
                    </div>
                    <span className="font-mono text-gray-700">{bank.account_number}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Transfer <strong>tepat</strong> sebesar {formatPrice(order.grand_total)} agar verifikasi lebih cepat.
              </p>
            </div>
          </div>

          {/* Upload proof */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-gray-400" /> Unggah Bukti Transfer
            </h2>
            <p className="text-xs text-gray-500 mb-4">Format JPG, PNG, WEBP, atau PDF. Maksimal 4 MB.</p>

            {errors.proof && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5" /> {errors.proof}
              </div>
            )}

            <form onSubmit={submitProof} className="space-y-3">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => setData('proof', e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
              <select
                value={data.bank_name}
                onChange={(e) => setData('bank_name', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
              >
                <option value="">Bank pengirim (opsional)</option>
                {bank_accounts.map((bank) => (
                  <option key={bank.bank} value={bank.bank}>{bank.bank}</option>
                ))}
              </select>
              {progress && (
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress.percentage}%` }} />
                </div>
              )}
              <button
                type="submit"
                disabled={processing || !data.proof}
                className="w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60"
              >
                {processing ? 'Mengunggah...' : 'Kirim Bukti Transfer'}
              </button>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/pesanan/${order.order_number}${guest_token ? `?token=${guest_token}` : ''}`}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800"
            >
              <FileText className="w-4 h-4" /> Detail Pesanan
            </Link>
            <a
              href={whatsappLink(whatsapp_number || '', `Halo, saya ingin konfirmasi pesanan ${order.order_number} sebesar ${formatPrice(order.grand_total)}.`)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700"
            >
              <MessageCircle className="w-4 h-4" /> Konfirmasi via WhatsApp
            </a>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
            Simpan nomor pesanan Anda. <Link href="/lacak-pesanan" className="underline hover:text-gray-600">Lacak pesanan</Link>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
