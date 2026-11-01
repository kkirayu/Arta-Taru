import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Star, CheckCircle2, Trash2, MessageSquare, Filter } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import { formatDate } from '@/lib/format';
import type { AdminReviewsProps } from '@/types';

export default function ReviewsIndex({ reviews, counts, filters }: AdminReviewsProps) {
  const [rating, setRating] = useState(filters.rating || '');

  const apply = (overrides: Record<string, string> = {}) => {
    const params: Record<string, string> = {};
    const values = { status: filters.status || '', rating, ...overrides };
    Object.entries(values).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    router.get('/admin/reviews', params, { preserveState: true, replace: true });
  };

  const approve = (id: number) => {
    router.post(`/admin/reviews/${id}/approve`, {}, { preserveScroll: true });
  };

  const remove = (id: number) => {
    if (confirm('Hapus ulasan ini?')) {
      router.delete(`/admin/reviews/${id}`, { preserveScroll: true });
    }
  };

  const tabs = [
    { value: '', label: 'Semua' },
    { value: 'pending', label: `Menunggu (${counts.pending})` },
    { value: 'approved', label: `Disetujui (${counts.approved})` },
  ];

  return (
    <AdminLayout>
      <Head title="Ulasan" />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ulasan Produk</h1>
          <p className="text-sm text-gray-500 mt-1">Moderasi ulasan sebelum tampil di halaman produk.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => apply({ status: tab.value })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  (filters.status || '') === tab.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={rating}
              onChange={(e) => { setRating(e.target.value); apply({ rating: e.target.value }); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="">Semua Rating</option>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={String(value)}>{value} Bintang</option>
              ))}
            </select>
          </div>
        </div>

        {reviews.data.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Belum ada ulasan pada filter ini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.data.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{review.reviewer_name}</span>
                      <span className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-400 fill-current' : 'text-gray-200'}`}
                          />
                        ))}
                      </span>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        review.is_approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {review.is_approved ? 'Disetujui' : 'Menunggu'}
                      </span>
                    </div>
                    {review.product && (
                      <Link href={`/produk/${review.product.slug}`} className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                        {review.product.name}
                      </Link>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(review.created_at)}{review.user ? ` · ${review.user.email}` : ''}
                    </p>
                    {review.comment && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!review.is_approved && (
                      <button
                        onClick={() => approve(review.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
                      </button>
                    )}
                    <button
                      onClick={() => remove(review.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {reviews.last_page > 1 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <Pagination
                  currentPage={reviews.current_page}
                  lastPage={reviews.last_page}
                  onPageChange={(page) => apply({ page: String(page) })}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
