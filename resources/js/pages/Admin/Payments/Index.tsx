import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Search, CreditCard, ExternalLink, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import { formatDate, formatPrice } from '@/lib/format';
import type { AdminPaymentsProps, Payment } from '@/types';

export default function PaymentsIndex({ payments, counts, filters }: AdminPaymentsProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [rejecting, setRejecting] = useState<Payment | null>(null);
  const [reason, setReason] = useState('');

  const apply = (overrides: Record<string, string> = {}) => {
    const params: Record<string, string> = {};
    const values = { status: filters.status || 'pending', search, ...overrides };
    Object.entries(values).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    router.get('/admin/payments', params, { preserveState: true, replace: true });
  };

  const verify = (payment: Payment) => {
    if (!payment.order) return;
    if (!confirm(`Verifikasi pembayaran ${payment.order.order_number}?`)) return;
    router.post(
      `/admin/orders/${payment.order.order_number}/payments/${payment.id}/verify`,
      {},
      { preserveScroll: true }
    );
  };

  const reject = () => {
    if (!rejecting?.order) return;
    router.post(
      `/admin/orders/${rejecting.order.order_number}/payments/${rejecting.id}/reject`,
      { reason },
      {
        preserveScroll: true,
        onSuccess: () => { setRejecting(null); setReason(''); },
      }
    );
  };

  const tabs = [
    { value: 'pending', label: 'Menunggu', count: counts.pending },
    { value: 'verified', label: 'Diverifikasi', count: counts.verified },
    { value: 'rejected', label: 'Ditolak', count: counts.rejected },
  ];

  return (
    <AdminLayout>
      <Head title="Pembayaran" />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pembayaran</h1>
          <p className="text-sm text-gray-500 mt-1">Verifikasi bukti transfer yang diunggah pelanggan.</p>
        </div>

        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => apply({ status: tab.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                (filters.status || 'pending') === tab.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <form
              onSubmit={(e) => { e.preventDefault(); apply(); }}
              className="relative w-full sm:w-80"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nomor pesanan atau nama..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </form>
          </div>

          {payments.data.length === 0 ? (
            <div className="py-16 text-center">
              <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Tidak ada pembayaran pada filter ini.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {payments.data.map((payment) => (
                <div key={payment.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {payment.order ? (
                        <Link href={`/admin/orders/${payment.order.order_number}`} className="text-sm font-semibold text-blue-600 hover:underline">
                          {payment.order.order_number}
                        </Link>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900">#{payment.order_id}</span>
                      )}
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        payment.status === 'verified' ? 'bg-green-100 text-green-700' :
                        payment.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {payment.status_label || payment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {payment.order?.customer_name || '-'} · {payment.bank_name || 'Transfer bank'} · <strong>{formatPrice(payment.amount)}</strong>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Diunggah {formatDate(payment.created_at)}</p>
                    {payment.rejection_reason && (
                      <p className="text-xs text-red-600 mt-1">Alasan ditolak: {payment.rejection_reason}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {payment.proof_path && payment.order && (
                      <a
                        href={`/admin/orders/${payment.order.order_number}/payments/${payment.id}/proof`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-50"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Bukti
                      </a>
                    )}
                    {payment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => verify(payment)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verifikasi
                        </button>
                        <button
                          onClick={() => setRejecting(payment)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Tolak
                        </button>
                      </>
                    )}
                    {payment.order && (
                      <Link
                        href={`/admin/orders/${payment.order.order_number}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-blue-600"
                      >
                        Pesanan <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {payments.last_page > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination
                currentPage={payments.current_page}
                lastPage={payments.last_page}
                onPageChange={(page) => apply({ page: String(page) })}
              />
            </div>
          )}
        </div>
      </div>

      {rejecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRejecting(null)} />
          <div className="relative bg-white rounded-xl p-5 w-full max-w-md shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Tolak Bukti Transfer</h3>
            <p className="text-sm text-gray-500 mb-3">Alasan akan ditampilkan ke pelanggan.</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Contoh: nominal tidak sesuai"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setRejecting(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Batal</button>
              <button
                onClick={reject}
                disabled={!reason.trim()}
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
