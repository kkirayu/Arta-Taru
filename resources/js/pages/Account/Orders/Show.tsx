import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Package, MapPin, Truck, FileText, Star, XCircle, Upload, AlertCircle } from 'lucide-react';
import AccountLayout from '@/layouts/AccountLayout';
import { formatDate, formatPrice, orderStatusClasses } from '@/lib/format';
import type { AccountOrderProps } from '@/types';

export default function AccountOrderShow({ order, bank_accounts, can_review }: AccountOrderProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reviewItem, setReviewItem] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const proofForm = useForm<{ proof: File | null; bank_name: string }>({
    proof: null,
    bank_name: bank_accounts[0]?.bank || '',
  });

  const canCancel = ['pending_payment', 'waiting_confirmation'].includes(order.status);
  const canUpload = ['pending_payment', 'waiting_confirmation'].includes(order.status);

  const submitCancel = () => {
    router.post(`/akun/pesanan/${order.order_number}/batal`, {}, { preserveScroll: true });
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewItem) return;
    router.post('/ulasan', { order_item_id: reviewItem, rating, comment }, {
      preserveScroll: true,
      onSuccess: () => {
        setReviewItem(null);
        setComment('');
        setRating(5);
      },
    });
  };

  const submitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofForm.data.proof) return;
    proofForm.post(`/pesanan/${order.order_number}/bukti`, { forceFormData: true, preserveScroll: true });
  };

  const latestPayment = order.payments?.[0] ?? null;

  return (
    <AccountLayout title={`Pesanan ${order.order_number}`} description={formatDate(order.created_at)}>
      <Head title={`Pesanan ${order.order_number}`} />

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${orderStatusClasses[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            {order.status_label || order.status}
          </span>
          <div className="flex items-center gap-2">
            <a
              href={`/pesanan/${order.order_number}/invoice`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-50"
            >
              <FileText className="w-3.5 h-3.5" /> Invoice
            </a>
            {canCancel && (
              <button
                onClick={() => setCancelOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50"
              >
                <XCircle className="w-3.5 h-3.5" /> Batalkan
              </button>
            )}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Pembayaran</h2>
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400">Status</p>
              <p className="font-medium text-gray-900 mt-0.5">{order.payment_status_label || order.payment_status}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400">Total</p>
              <p className="font-bold text-blue-600 mt-0.5">{formatPrice(order.grand_total)}</p>
            </div>
          </div>

          {latestPayment && (
            <div className="p-3 border border-gray-100 rounded-xl text-sm mb-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Bukti transfer</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  latestPayment.status === 'verified' ? 'bg-green-100 text-green-700' :
                  latestPayment.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {latestPayment.status_label || latestPayment.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{formatDate(latestPayment.created_at)}</p>
              {latestPayment.rejection_reason && <p className="text-xs text-red-600 mt-2">Alasan: {latestPayment.rejection_reason}</p>}
            </div>
          )}

          {canUpload && (
            <form onSubmit={submitProof} className="border-t border-gray-100 pt-3 space-y-2">
              {proofForm.errors.proof && (
                <p className="text-xs text-red-600 flex items-start gap-1"><AlertCircle className="w-3.5 h-3.5 mt-0.5" /> {proofForm.errors.proof}</p>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => proofForm.setData('proof', e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
                required
              />
              <button
                type="submit"
                disabled={proofForm.processing || !proofForm.data.proof}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                <Upload className="w-3.5 h-3.5" /> {proofForm.processing ? 'Mengunggah...' : 'Unggah Bukti'}
              </button>
            </form>
          )}
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" /> Produk
          </h2>
          <div className="divide-y divide-gray-100">
            {(order.items || []).map((item) => (
              <div key={item.id} className="py-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                  <p className="text-xs text-gray-500">{item.variant_label ? `${item.variant_label} · ` : ''}{item.quantity} × {formatPrice(item.price)}</p>
                  {can_review && !item.review && (
                    <button
                      onClick={() => setReviewItem(item.id)}
                      className="mt-1 inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                    >
                      <Star className="w-3 h-3" /> Beri ulasan
                    </button>
                  )}
                  {item.review && (
                    <p className="text-[11px] text-green-600 mt-1">Ulasan terkirim ({item.review.rating}★)</p>
                  )}
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
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" /> Pengiriman
          </h2>
          <p className="text-sm text-gray-700">{order.shipping_method === 'pickup' ? 'Ambil di toko' : 'Kirim ke alamat'}</p>
          {order.shipping_courier && <p className="text-xs text-gray-500 mt-1">Kurir: {order.shipping_courier}</p>}
          {order.tracking_number && <p className="text-xs text-gray-500 mt-1">Resi: <span className="font-mono">{order.tracking_number}</span></p>}
          {order.address && (
            <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
              <p className="font-medium text-gray-900 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {order.address.recipient_name}</p>
              <p className="text-xs mt-1">{order.address.phone}</p>
              <p className="text-xs mt-1 leading-relaxed">{order.address.full_address || order.address.address_line}</p>
            </div>
          )}
        </div>

        {/* Review modal */}
        {reviewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setReviewItem(null)} />
            <form onSubmit={submitReview} className="relative bg-white rounded-2xl p-5 w-full max-w-md shadow-xl">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Beri Ulasan Produk</h3>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="p-0.5">
                    <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Bagaimana kualitas produk ini?"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setReviewItem(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">Kirim Ulasan</button>
              </div>
            </form>
          </div>
        )}

        {/* Cancel confirm */}
        {cancelOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setCancelOpen(false)} />
            <div className="relative bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Batalkan pesanan?</h3>
              <p className="text-sm text-gray-500 mb-4">Stok akan dikembalikan. Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setCancelOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Tidak</button>
                <button onClick={submitCancel} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700">Ya, batalkan</button>
              </div>
            </div>
          </div>
        )}

        <Link href="/akun/pesanan" className="inline-block text-sm text-blue-600 hover:underline">← Kembali ke daftar pesanan</Link>
      </div>
    </AccountLayout>
  );
}
