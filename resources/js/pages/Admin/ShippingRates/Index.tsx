import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus, Search, Truck, Pencil, Trash2, X, Power } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import { formatPrice } from '@/lib/format';
import type { AdminShippingRatesProps, ShippingRate } from '@/types';

interface RateForm {
  province: string;
  city: string;
  district: string;
  cost: string;
  free_shipping_min_total: string;
  eta_min_days: string;
  eta_max_days: string;
  is_active: boolean;
  sort_order: string;
}

const emptyForm: RateForm = {
  province: '',
  city: '',
  district: '',
  cost: '',
  free_shipping_min_total: '',
  eta_min_days: '1',
  eta_max_days: '3',
  is_active: true,
  sort_order: '0',
};

export default function ShippingRatesIndex({ rates, filters }: AdminShippingRatesProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ShippingRate | null>(null);
  const [form, setForm] = useState<RateForm>({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const apply = (overrides: Record<string, string> = {}) => {
    const params: Record<string, string> = {};
    const values = { search, ...overrides };
    Object.entries(values).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    router.get('/admin/shipping-rates', params, { preserveState: true, replace: true });
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setErrors({});
    setOpen(true);
  };

  const openEdit = (rate: ShippingRate) => {
    setEditing(rate);
    setForm({
      province: rate.province,
      city: rate.city || '',
      district: rate.district || '',
      cost: String(rate.cost),
      free_shipping_min_total: rate.free_shipping_min_total != null ? String(rate.free_shipping_min_total) : '',
      eta_min_days: String(rate.eta_min_days),
      eta_max_days: String(rate.eta_max_days),
      is_active: rate.is_active,
      sort_order: String(rate.sort_order ?? 0),
    });
    setErrors({});
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      cost: Number(form.cost || 0),
      free_shipping_min_total: form.free_shipping_min_total === '' ? null : Number(form.free_shipping_min_total),
      eta_min_days: Number(form.eta_min_days || 0),
      eta_max_days: Number(form.eta_max_days || 0),
      sort_order: Number(form.sort_order || 0),
    };
    const options = {
      preserveScroll: true,
      onSuccess: () => { setOpen(false); setErrors({}); },
      onError: (errs: Record<string, string>) => setErrors(errs),
    };

    if (editing) {
      router.put(`/admin/shipping-rates/${editing.id}`, payload, options);
    } else {
      router.post('/admin/shipping-rates', payload, options);
    }
  };

  const remove = (rate: ShippingRate) => {
    if (confirm(`Hapus tarif ${rate.area_label || rate.province}?`)) {
      router.delete(`/admin/shipping-rates/${rate.id}`, { preserveScroll: true });
    }
  };

  const toggle = (rate: ShippingRate) => {
    router.post(`/admin/shipping-rates/${rate.id}/toggle-active`, {}, { preserveScroll: true });
  };

  const field = <K extends keyof RateForm>(key: K, value: RateForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <Head title="Tarif Ongkir" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tarif Ongkir</h1>
            <p className="text-sm text-gray-500 mt-1">Atur biaya pengiriman per provinsi/kota.</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Tambah Tarif
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <form onSubmit={(e) => { e.preventDefault(); apply(); }} className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari provinsi atau kota..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </form>
          </div>

          {rates.data.length === 0 ? (
            <div className="py-16 text-center">
              <Truck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Belum ada tarif ongkir.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Wilayah</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Biaya</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Gratis Ongkir Min.</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Estimasi</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.data.map((rate) => (
                    <tr key={rate.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{rate.province}</p>
                        <p className="text-xs text-gray-500">
                          {[rate.city, rate.district].filter(Boolean).join(' · ') || 'Semua kota'}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{formatPrice(rate.cost)}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                        {rate.free_shipping_min_total != null ? formatPrice(rate.free_shipping_min_total) : '-'}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                        {rate.eta_min_days}–{rate.eta_max_days} hari
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          rate.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {rate.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => toggle(rate)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg" title="Toggle status">
                            <Power className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEdit(rate)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => remove(rate)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {rates.last_page > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination
                currentPage={rates.current_page}
                lastPage={rates.last_page}
                onPageChange={(page) => apply({ page: String(page) })}
              />
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <form onSubmit={submit} className="relative bg-white rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">{editing ? 'Edit Tarif Ongkir' : 'Tambah Tarif Ongkir'}</h3>
              <button type="button" onClick={() => setOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Provinsi *</label>
                  <input value={form.province} onChange={(e) => field('province', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                  {errors.province && <p className="text-[11px] text-red-600 mt-0.5">{errors.province}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kota/Kabupaten</label>
                  <input value={form.city} onChange={(e) => field('city', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Kosongkan untuk semua kota" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Kecamatan</label>
                <input value={form.district} onChange={(e) => field('district', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Opsional" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Biaya (Rp) *</label>
                  <input type="number" min="0" value={form.cost} onChange={(e) => field('cost', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                  {errors.cost && <p className="text-[11px] text-red-600 mt-0.5">{errors.cost}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gratis ongkir min. (Rp)</label>
                  <input type="number" min="0" value={form.free_shipping_min_total} onChange={(e) => field('free_shipping_min_total', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Opsional" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Estimasi min (hari) *</label>
                  <input type="number" min="0" value={form.eta_min_days} onChange={(e) => field('eta_min_days', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Estimasi max (hari) *</label>
                  <input type="number" min="0" value={form.eta_max_days} onChange={(e) => field('eta_max_days', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                  {errors.eta_max_days && <p className="text-[11px] text-red-600 mt-0.5">{errors.eta_max_days}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Urutan</label>
                  <input type="number" min="0" value={form.sort_order} onChange={(e) => field('sort_order', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.is_active} onChange={(e) => field('is_active', e.target.checked)} className="rounded border-gray-300 text-blue-600" />
                Tarif aktif
              </label>
            </div>

            <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Batal</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
                {editing ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
