import { Head, useForm, Link } from '@inertiajs/react';
import { usePage, router } from '@inertiajs/react';
import { Package, Key, Trash2, Copy, Eye, EyeOff, Plus, Calendar, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { ApiTokensProps } from '@/types';
import FlashMessage from '@/components/FlashMessage';

export default function ApiTokensIndex({ tokens, errors }: ApiTokensProps) {
  const { data, setData, post, processing, reset } = useForm({
    name: '',
    abilities: ['*'],
    expires_at: '',
  });
  const [showToken, setShowToken] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/api-tokens', {
      onSuccess: () => {
        reset('name');
        reset('expires_at');
      },
    });
  };

  const handleDelete = (tokenId: number) => {
    router.delete(`/admin/api-tokens/${tokenId}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Tidak pernah';
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatExpiry = (dateString: string | null) => {
    if (!dateString) return 'Tidak kadaluarsa';
    const expiry = new Date(dateString);
    const now = new Date();
    const isExpired = expiry < now;
    return (
      <span className={`flex items-center gap-1 text-sm ${isExpired ? 'text-red-600' : 'text-gray-600'}`}>
        <Calendar className="w-3 h-3" />
        {expiry.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
        {isExpired && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Kadaluarsa</span>}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Token API</h1>
          <p className="text-gray-600 mt-1">Kelola personal access token untuk akses API</p>
        </div>
        <FlashMessage />
      </div>

      {/* Create Token Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-600" />
          Buat Token Baru
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Nama Token</label>
              <input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Contoh: Mobile App, CI/CD, Third Party"
              />
              {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 mb-1.5">Kadaluarsa (opsional)</label>
              <input
                id="expires_at"
                type="datetime-local"
                value={data.expires_at}
                onChange={(e) => setData('expires_at', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={processing}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-sm"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Membuat...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Buat Token
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Show generated token */}
        {showToken && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-green-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Token berhasil dibuat!
              </span>
              <button
                type="button"
                onClick={() => setShowToken(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={showToken}
                readOnly
                className="w-full px-3 py-2 bg-white border border-green-200 rounded-lg text-sm font-mono text-center"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(showToken)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800"
              >
                {copied === showToken ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-green-700 mt-2 text-center">
              <strong>Simpan token ini sekarang!</strong> Token tidak akan ditampilkan lagi.
            </p>
          </div>
        )}
      </div>

      {/* Tokens List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kemampuan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Terakhir Digunakan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kadaluarsa</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dibuat</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tokens.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <Key className="w-12 h-12 text-gray-300" />
                      <p className="text-lg font-medium">Belum ada token API</p>
                      <p className="text-sm">Buat token pertama Anda untuk memulai akses API</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tokens.data.map((token) => (
                  <tr key={token.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{token.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {token.abilities.includes('*') ? (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Full Access</span>
                        ) : (
                          token.abilities.map((ability) => (
                            <span key={ability} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {ability}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {token.last_used_at ? (
                        <>
                          <Clock className="w-4 h-4 inline mr-1" />
                          {formatDate(token.last_used_at)}
                        </>
                      ) : (
                        <span className="text-gray-400">Belum pernah</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{formatExpiry(token.expires_at)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(token.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {deleteConfirm === token.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(token.id)}
                            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Hapus
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(token.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center justify-end gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {tokens.last_page > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Menampilkan {tokens.from} sampai {tokens.to} dari {tokens.total} token
              </div>
              <div className="flex gap-2">
                {tokens.prev_page_url && (
                  <Link
                    href={tokens.prev_page_url}
                    className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Sebelumnya
                  </Link>
                )}
                {tokens.next_page_url && (
                  <Link
                    href={tokens.next_page_url}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Selanjutnya
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}