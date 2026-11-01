import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Star, X } from 'lucide-react';
import AccountLayout from '@/layouts/AccountLayout';
import type { AccountAddressesProps, CustomerAddress } from '@/types';

const emptyForm = {
  label: 'Rumah',
  recipient_name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  postal_code: '',
  address_line: '',
  notes: '',
  is_default: false,
};

export default function AccountAddresses({ addresses, destinations }: AccountAddressesProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerAddress | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cities = useMemo(() => {
    const match = destinations.find((d) => d.province === form.province);
    return match?.cities ?? [];
  }, [destinations, form.province]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, is_default: addresses.length === 0 });
    setErrors({});
    setOpen(true);
  };

  const openEdit = (address: CustomerAddress) => {
    setEditing(address);
    setForm({
      label: address.label,
      recipient_name: address.recipient_name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district || '',
      postal_code: address.postal_code || '',
      address_line: address.address_line,
      notes: address.notes || '',
      is_default: address.is_default,
    });
    setErrors({});
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const options = {
      preserveScroll: true,
      onSuccess: () => { setOpen(false); setErrors({}); },
      onError: (errs: Record<string, string>) => setErrors(errs),
    };

    if (editing) {
      router.put(`/akun/alamat/${editing.id}`, form, options);
    } else {
      router.post('/akun/alamat', form, options);
    }
  };

  const remove = (address: CustomerAddress) => {
    if (confirm(`Hapus alamat "${address.label}"?`)) {
      router.delete(`/akun/alamat/${address.id}`, { preserveScroll: true });
    }
  };

  const setDefault = (address: CustomerAddress) => {
    router.post(`/akun/alamat/${address.id}/utama`, {}, { preserveScroll: true });
  };

  const field = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AccountLayout title="Alamat" description="Kelola alamat pengiriman Anda.">
      <Head title="Alamat" />

      <div className="flex justify-end mb-4">
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Tambah Alamat
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Belum ada alamat tersimpan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addresses.map((address) => (
            <div key={address.id} className={`bg-white rounded-2xl border p-4 ${address.is_default ? 'border-blue-300 ring-1 ring-blue-100' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    {address.label}
                    {address.is_default && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">Utama</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{address.recipient_name} · {address.phone}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(address)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" aria-label="Edit">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => remove(address)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label="Hapus">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                {address.full_address || `${address.address_line}, ${address.city}, ${address.province}`}
              </p>
              {address.notes && <p className="text-[11px] text-gray-400 mt-1">Catatan: {address.notes}</p>}
              {!address.is_default && (
                <button onClick={() => setDefault(address)} className="mt-2 inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline">
                  <Star className="w-3 h-3" /> Jadikan alamat utama
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <form onSubmit={submit} className="relative bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">{editing ? 'Edit Alamat' : 'Tambah Alamat'}</h3>
              <button type="button" onClick={() => setOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                  <input value={form.label} onChange={(e) => field('label', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
                  {errors.label && <p className="text-[11px] text-red-600 mt-0.5">{errors.label}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nama Penerima</label>
                  <input value={form.recipient_name} onChange={(e) => field('recipient_name', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
                  {errors.recipient_name && <p className="text-[11px] text-red-600 mt-0.5">{errors.recipient_name}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
                <input value={form.phone} onChange={(e) => field('phone', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
                {errors.phone && <p className="text-[11px] text-red-600 mt-0.5">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Provinsi</label>
                  <select
                    value={form.province}
                    onChange={(e) => { field('province', e.target.value); field('city', ''); }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                    required
                  >
                    <option value="">Pilih</option>
                    {destinations.map((d) => <option key={d.province} value={d.province}>{d.province}</option>)}
                  </select>
                  {errors.province && <p className="text-[11px] text-red-600 mt-0.5">{errors.province}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kota/Kabupaten</label>
                  <select
                    value={form.city}
                    onChange={(e) => field('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                    disabled={!form.province}
                    required
                  >
                    <option value="">Pilih</option>
                    {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                  </select>
                  {errors.city && <p className="text-[11px] text-red-600 mt-0.5">{errors.city}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kecamatan</label>
                  <input value={form.district} onChange={(e) => field('district', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kode Pos</label>
                  <input value={form.postal_code} onChange={(e) => field('postal_code', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea value={form.address_line} onChange={(e) => field('address_line', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
                {errors.address_line && <p className="text-[11px] text-red-600 mt-0.5">{errors.address_line}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Catatan</label>
                <input value={form.notes} onChange={(e) => field('notes', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Patokan, jam pengiriman, dll." />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.is_default} onChange={(e) => field('is_default', e.target.checked)} className="rounded border-gray-300 text-blue-600" />
                Jadikan alamat utama
              </label>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t border-gray-100">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Batal</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
                {editing ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AccountLayout>
  );
}
