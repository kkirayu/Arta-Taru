import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ArrowLeft, Package, MapPin, Truck, Building2, FileText, CheckCircle2, XCircle,
  Clock, User as UserIcon, Mail, Phone, ExternalLink, AlertCircle,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { formatDate, formatPrice, orderStatusClasses, paymentStatusClasses, whatsappLink } from '@/lib/format';
import type { AdminOrderShowProps } from '@/types';

export default function AdminOrderShow({ order, statuses, payment_statuses, bank_accounts }: AdminOrderShowProps) {
  const [shipOpen, setShipOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [courier, setCourier] = useState(order.shipping_courier || '');
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [shipNote, setShipNote] = useState('');

  const canShip = order.status === 'processing';
  const canComplete = order.status === 'shipped';
  const canCancel = !['completed', 'cancelled', 'expired'].includes(order.status);

  const verifyPayment = (paymentId: number) => {
    if (!confirm('Verifikasi pembayaran ini? Pesanan akan diproses.')) return;
    router.post(`/admin/orders/${order.order_number}/payments/${paymentId}/verify`, {}, { preserveScroll: true });
  };

  const rejectPayment = () => {
    if (!rejectingId) return;
    router.post(
      `/admin/orders/${order.order_number}/payments/${rejectingId}/reject`,
      { reason: rejectReason },
      {
        preserveScroll: true,
        onSuccess: () => { setRejectingId(null); setRejectReason(''); },
      }
    );
  };

  const submitShip = (e: React.FormEvent) => {
    e.preventDefault();
    router.post(
      `/admin/orders/${order.order_number}/ship`,
      { courier, tracking_number: trackingNumber, note: shipNote },
      {
        preserveScroll: true,
        onSuccess: () => { setShipOpen(false); setShipNote(''); },
      }
    );
  };

  const completeOrder = () => {
    if (!confirm('Tandai pesanan ini sebagai selesai?')) return;
    router.post(`/admin/orders/${order.order_number}/complete`, {}, { preserveScroll: true });
  };

  const cancelOrder = () => {
    router.post(
      `/admin/orders/${order.order_number}/cancel`,
      { reason: cancelReason },
      {
        preserveScroll: true,
        onSuccess: () => { setCancelOpen(false); setCancelReason(''); },
      }
    );
  };

  return (
    <AdminLayout>
      <Head title={`Pesanan ${order.order_number}`} />

      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke pesanan
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{order.order_number}</h1>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${orderStatusClasses[order.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {order.status_label || statuses[order.status] || order.status}
              </span>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${paymentStatusClasses[order.payment_status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {order.payment_status_label || payment_statuses[order.payment_status] || order.payment_status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Dibuat {formatDate(order.created_at)}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`/admin/orders/${order.order_number}/invoice`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              <FileText className="w-4 h-4" /> Invoice
            </a>
            {canShip && (
              <button
                onClick={() => setShipOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <Truck className="w-4 h-4" /> Kirim
              </button>
            )}
            {canComplete && (
              <button
                onClick={completeOrder}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4" /> Selesaikan
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => setCancelOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" /> Batalkan
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {/* Items */}
            <section className="bg-white rounded-xl border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-900">Produk Dipesan</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="px-5 py-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0">
                      {item.product?.primary_image?.url ? (
                        <img src={item.product.primary_image.url} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-xs text-gray-500">
                        SKU {item.sku}{item.variant_label ? ` · ${item.variant_label}` : ''}
                      </p>
                      <p className="text-xs text-gray-500">{item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Ongkir</span><span>{formatPrice(order.shipping_total)}</span></div>
                {Number(order.discount_total) > 0 && (
                  <div className="flex justify-between"><span className="text-gray-500">Diskon</span><span>-{formatPrice(order.discount_total)}</span></div>
                )}
                {Number(order.unique_code) > 0 && (
                  <div className="flex justify-between"><span className="text-gray-500">Kode unik</span><span>{formatPrice(order.unique_code)}</span></div>
                )}
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span><span>{formatPrice(order.grand_total)}</span>
                </div>
              </div>
            </section>

            {/* Payments */}
            <section className="bg-white rounded-xl border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-900">Pembayaran</h2>
              </div>

              <div className="px-5 py-4">
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400">Metode</p>
                    <p className="font-medium text-gray-900 mt-0.5">Transfer Bank</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400">Batas pembayaran</p>
                    <p className="font-medium text-gray-900 mt-0.5">{formatDate(order.expires_at)}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {bank_accounts.map((bank, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 border border-gray-100 rounded-lg text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{bank.bank}</p>
                        <p className="text-xs text-gray-500">a.n. {bank.account_name}</p>
                      </div>
                      <span className="font-mono text-gray-700">{bank.account_number}</span>
                    </div>
                  ))}
                </div>

                {(order.payments || []).length === 0 ? (
                  <p className="text-sm text-gray-400">Belum ada bukti transfer diunggah.</p>
                ) : (
                  <div className="space-y-3">
                    {(order.payments || []).map((payment) => (
                      <div key={payment.id} className="p-3 border border-gray-100 rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {payment.bank_name || 'Transfer bank'} · {formatPrice(payment.amount)}
                            </p>
                            <p className="text-xs text-gray-500">Diunggah {formatDate(payment.created_at)}</p>
                            {payment.verified_at && (
                              <p className="text-xs text-green-600">Diverifikasi {formatDate(payment.verified_at)}</p>
                            )}
                            {payment.rejection_reason && (
                              <p className="text-xs text-red-600 mt-1">Alasan ditolak: {payment.rejection_reason}</p>
                            )}
                          </div>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            payment.status === 'verified' ? 'bg-green-100 text-green-700' :
                            payment.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {payment.status_label || payment.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          {payment.proof_path && (
                            <a
                              href={`/admin/orders/${order.order_number}/payments/${payment.id}/proof`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-50"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Lihat bukti
                            </a>
                          )}
                          {payment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => verifyPayment(payment.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Verifikasi
                              </button>
                              <button
                                onClick={() => setRejectingId(payment.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Tolak
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Status history */}
            <section className="bg-white rounded-xl border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-900">Riwayat Status</h2>
              </div>
              <div className="px-5 py-4 space-y-4">
                {(order.status_histories || []).slice().reverse().map((history) => (
                  <div key={history.id} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{history.to_status_label || statuses[history.to_status] || history.to_status}</p>
                      {history.note && <p className="text-xs text-gray-500">{history.note}</p>}
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {formatDate(history.created_at)}{history.user ? ` · ${history.user.name}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
                {(!order.status_histories || order.status_histories.length === 0) && (
                  <p className="text-sm text-gray-400">Belum ada riwayat status.</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <section className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-400" /> Pelanggan
              </h2>
              <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1"><Mail className="w-3.5 h-3.5" /> {order.customer_email}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1"><Phone className="w-3.5 h-3.5" /> {order.customer_phone}</p>
              {order.user_id ? (
                <Link href={`/admin/customers/${order.user_id}`} className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                  Lihat akun pelanggan
                </Link>
              ) : (
                <p className="text-xs text-gray-400 mt-2">Checkout sebagai tamu</p>
              )}
              <a
                href={whatsappLink(order.customer_phone, `Halo ${order.customer_name}, terkait pesanan ${order.order_number}.`)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700"
              >
                Hubungi WhatsApp
              </a>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-400" /> Pengiriman
              </h2>
              <p className="text-sm text-gray-700">
                {order.shipping_method === 'pickup' ? 'Ambil di toko' : 'Kirim ke alamat'}
              </p>
              {order.shipping_courier && <p className="text-xs text-gray-500 mt-1">Kurir: {order.shipping_courier}</p>}
              {order.tracking_number && (
                <p className="text-xs text-gray-500 mt-1">Resi: <span className="font-mono">{order.tracking_number}</span></p>
              )}
              {order.address && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                  <p className="font-medium text-gray-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> {order.address.recipient_name}
                  </p>
                  <p className="text-xs mt-1">{order.address.phone}</p>
                  <p className="text-xs mt-1 leading-relaxed">
                    {order.address.full_address || `${order.address.address_line}, ${order.address.city}, ${order.address.province}`}
                  </p>
                </div>
              )}
            </section>

            {(order.notes || order.admin_notes) && (
              <section className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-400" /> Catatan
                </h2>
                {order.notes && <p className="text-sm text-gray-600">{order.notes}</p>}
                {order.admin_notes && <p className="text-xs text-gray-500 mt-2">Admin: {order.admin_notes}</p>}
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Ship modal */}
      {shipOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShipOpen(false)} />
          <form onSubmit={submitShip} className="relative bg-white rounded-xl p-5 w-full max-w-md shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Kirim Pesanan</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Kurir *</label>
                <input
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="JNE / J&T / SiCepat / Ambil sendiri"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nomor Resi *</label>
                <input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Nomor resi pengiriman"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Catatan</label>
                <textarea
                  value={shipNote}
                  onChange={(e) => setShipNote(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShipOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Batal</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">Tandai Dikirim</button>
            </div>
          </form>
        </div>
      )}

      {/* Reject payment modal */}
      {rejectingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRejectingId(null)} />
          <div className="relative bg-white rounded-xl p-5 w-full max-w-md shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Tolak Bukti Transfer</h3>
            <p className="text-sm text-gray-500 mb-3">Berikan alasan agar pelanggan dapat mengunggah ulang bukti yang benar.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Contoh: nominal tidak sesuai"
              required
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setRejectingId(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Batal</button>
              <button
                onClick={rejectPayment}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel modal */}
      {cancelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCancelOpen(false)} />
          <div className="relative bg-white rounded-xl p-5 w-full max-w-md shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Batalkan Pesanan</h3>
            <p className="text-sm text-gray-500 mb-3">Stok produk akan dikembalikan otomatis.</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Alasan pembatalan (opsional)"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setCancelOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Tidak</button>
              <button onClick={cancelOrder} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700">Ya, batalkan</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
