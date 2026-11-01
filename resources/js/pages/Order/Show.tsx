import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
  Package, Truck, CheckCircle2, Clock, XCircle, Upload, FileText, MessageCircle,
  MapPin, Building2, AlertCircle, Copy, Check, ChevronRight,
} from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import { formatDate, formatPrice, orderStatusClasses, whatsappLink } from '@/lib/format';
import type { OrderPageProps } from '@/types';

const steps = ['pending_payment', 'waiting_confirmation', 'processing', 'shipped', 'completed'];

export default function OrderShow({ order, bank_accounts, whatsapp_number, guest_token, can_upload_proof }: OrderPageProps) {
  const [copied, setCopied] = useState(false);
  const { data, setData, post, processing, errors, progress } = useForm<{ proof: File | null; bank_name: string }>({
    proof: null,
    bank_name: bank_accounts[0]?.bank || '',
  });

  const tokenQuery = guest_token ? `?token=${guest_token}` : '';
  const currentStep = steps.indexOf(order.status);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.proof) return;
    post(`/pesanan/${order.order_number}/bukti${tokenQuery}`, { forceFormData: true, preserveScroll: true });
  };

  const latestPayment = order.payments?.[0] ?? null;

  return (
    <PublicLayout>
      <Head title={`Pesanan ${order.order_number}`} />
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{order.order_number}</h1>
                <button onClick={copyOrderNumber} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg" aria-label="Salin">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">Dibuat {formatDate(order.created_at)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${orderStatusClasses[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {order.status_label || order.status}
              </span>
              <a
                href={`/pesanan/${order.order_number}/invoice${tokenQuery}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white text-xs font-medium rounded-lg hover:bg-gray-50"
              >
                <FileText className="w-3.5 h-3.5" /> Invoice
              </a>
            </div>
          </div>

          {/* Status steps */}
          {!['cancelled', 'expired'].includes(order.status) && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
              <div className="flex items-center justify-between gap-1">
                {steps.map((step, i) => {
                  const labels: Record<string, string> = {
                    pending_payment: 'Dibuat',
                    waiting_confirmation: 'Dikonfirmasi',
                    processing: 'Diproses',
                    shipped: 'Dikirim',
                    completed: 'Selesai',
                  };
                  const done = i <= currentStep;
                  return (
                    <div key={step} className="flex-1 flex flex-col items-center relative">
                      {i > 0 && (
                        <div className={`absolute top-3.5 right-1/2 w-full h-0.5 ${i <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} style={{ zIndex: 0 }} />
                      )}
                      <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${done ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className={`text-[10px] sm:text-xs mt-1.5 text-center ${done ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{labels[step]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {['cancelled', 'expired'].includes(order.status) && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex items-start gap-2 text-sm text-red-700">
              <XCircle className="w-4 h-4 mt-0.5" />
              <span>Pesanan ini {order.status === 'expired' ? 'kedaluwarsa karena melewati batas pembayaran' : 'dibatalkan'}. Jika sudah transfer, hubungi toko untuk pengembalian dana.</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              {/* Payment */}
              <section className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" /> Pembayaran
                </h2>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400">Status pembayaran</p>
                    <p className="font-medium text-gray-900 mt-0.5">{order.payment_status_label || order.payment_status}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400">Total transfer</p>
                    <p className="font-bold text-blue-600 mt-0.5">{formatPrice(order.grand_total)}</p>
                  </div>
                </div>

                {order.status === 'pending_payment' && (
                  <>
                    <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>Batas pembayaran: <strong>{formatDate(order.expires_at)}</strong></span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {bank_accounts.map((bank, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl text-sm">
                          <div>
                            <p className="font-semibold text-gray-900">{bank.bank}</p>
                            <p className="text-xs text-gray-500">a.n. {bank.account_name}</p>
                          </div>
                          <span className="font-mono text-gray-700">{bank.account_number}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {latestPayment && (
                  <div className="mb-4 p-3 border border-gray-100 rounded-xl text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Bukti transfer terakhir</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        latestPayment.status === 'verified' ? 'bg-green-100 text-green-700' :
                        latestPayment.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {latestPayment.status_label || latestPayment.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Diunggah {formatDate(latestPayment.created_at)}</p>
                    {latestPayment.rejection_reason && (
                      <p className="text-xs text-red-600 mt-2">Alasan ditolak: {latestPayment.rejection_reason}</p>
                    )}
                  </div>
                )}

                {can_upload_proof && (
                  <form onSubmit={submitProof} className="space-y-2.5 border-t border-gray-100 pt-4">
                    <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-gray-400" /> Unggah / perbarui bukti transfer
                    </p>
                    {errors.proof && (
                      <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 mt-0.5" /> {errors.proof}
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={(e) => setData('proof', e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
                      required
                    />
                    {progress && (
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress.percentage}%` }} />
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={processing || !data.proof}
                      className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60"
                    >
                      {processing ? 'Mengunggah...' : 'Kirim Bukti Transfer'}
                    </button>
                  </form>
                )}
              </section>

              {/* Items */}
              <section className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" /> Produk Dipesan
                </h2>
                <div className="divide-y divide-gray-100">
                  {(order.items || []).map((item) => (
                    <div key={item.id} className="py-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-gray-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-xs text-gray-500">
                          {item.variant_label ? `${item.variant_label} · ` : ''}{item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-2 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Ongkir</span><span>{formatPrice(order.shipping_total)}</span></div>
                  {Number(order.unique_code) > 0 && (
                    <div className="flex justify-between"><span className="text-gray-500">Kode unik</span><span>{formatPrice(order.unique_code)}</span></div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span><span>{formatPrice(order.grand_total)}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <section className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400" /> Pengiriman
                </h2>
                <p className="text-sm text-gray-700 mb-2">
                  {order.shipping_method === 'pickup' ? 'Ambil di toko' : 'Kirim ke alamat'}
                </p>
                {order.shipping_courier && <p className="text-xs text-gray-500">Kurir: {order.shipping_courier}</p>}
                {order.tracking_number && <p className="text-xs text-gray-500">Resi: <span className="font-mono">{order.tracking_number}</span></p>}
                {order.address && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                    <p className="font-medium text-gray-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" /> {order.address.recipient_name}
                    </p>
                    <p className="text-xs mt-1">{order.address.phone}</p>
                    <p className="text-xs mt-1 leading-relaxed">{order.address.full_address || `${order.address.address_line}, ${order.address.city}`}</p>
                  </div>
                )}
              </section>

              <section className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Riwayat Status</h2>
                <div className="space-y-3">
                  {(order.status_histories || []).slice().reverse().map((history) => (
                    <div key={history.id} className="flex gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-900">{history.to_status_label || history.to_status}</p>
                        {history.note && <p className="text-[11px] text-gray-500">{history.note}</p>}
                        <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(history.created_at)}</p>
                      </div>
                    </div>
                  ))}
                  {(!order.status_histories || order.status_histories.length === 0) && (
                    <p className="text-xs text-gray-400">Belum ada riwayat.</p>
                  )}
                </div>
              </section>

              <a
                href={whatsappLink(whatsapp_number || '', `Halo, saya ingin menanyakan pesanan ${order.order_number}.`)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4" /> Hubungi Toko
              </a>

              <Link href="/katalog" className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-blue-600">
                Lanjut belanja <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
