import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Search, UserCog, Pencil, Trash2, X, ShieldCheck } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import { formatDate } from '@/lib/format';
import type { AdminUsersProps, PageProps, User } from '@/types';

interface UserForm {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  is_active: boolean;
}

const emptyForm: UserForm = {
  name: '',
  email: '',
  phone: '',
  role: 'staff',
  password: '',
  is_active: true,
};

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  staff: 'Staff',
};

export default function UsersIndex({ users, filters }: AdminUsersProps) {
  const { props } = usePage<PageProps>();
  const isSuperAdmin = props.auth.user?.role === 'super_admin';

  const [search, setSearch] = useState(filters.search || '');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const apply = (overrides: Record<string, string> = {}) => {
    const params: Record<string, string> = {};
    const values = { search, ...overrides };
    Object.entries(values).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    router.get('/admin/users', params, { preserveState: true, replace: true });
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setErrors({});
    setOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      password: '',
      is_active: user.is_active !== false,
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
      const payload: {
        name: string;
        email: string;
        role: string;
        is_active: boolean;
        password?: string;
      } = {
        name: form.name,
        email: form.email,
        role: form.role,
        is_active: form.is_active,
      };
      if (form.password) payload.password = form.password;
      router.put(`/admin/users/${editing.id}`, payload, options);
    } else {
      router.post('/admin/users', {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        role: form.role,
        password: form.password,
      }, options);
    }
  };

  const remove = (user: User) => {
    if (confirm(`Hapus pengguna ${user.name}?`)) {
      router.delete(`/admin/users/${user.id}`, { preserveScroll: true });
    }
  };

  const field = <K extends keyof UserForm>(key: K, value: UserForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <Head title="Pengguna" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengguna Back-Office</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola akses admin dan staff toko.</p>
          </div>
          {isSuperAdmin && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Tambah Pengguna
            </button>
          )}
        </div>

        {!isSuperAdmin && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Hanya super admin yang dapat menambah, mengubah, atau menghapus pengguna.
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <form onSubmit={(e) => { e.preventDefault(); apply(); }} className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau email..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </form>
          </div>

          {users.data.length === 0 ? (
            <div className="py-16 text-center">
              <UserCog className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Belum ada pengguna back-office.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Nama</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Dibuat</th>
                    {isSuperAdmin && <th className="text-right px-4 py-3 font-medium text-gray-500">Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {users.data.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.phone || '-'}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          user.role === 'super_admin'
                            ? 'bg-purple-100 text-purple-700'
                            : user.role === 'admin'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          {roleLabels[user.role] || user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          user.is_active === false ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {user.is_active === false ? 'Nonaktif' : 'Aktif'}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-500">{formatDate(user.created_at, false)}</td>
                      {isSuperAdmin && (
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEdit(user)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => remove(user)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Hapus">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {users.last_page > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination
                currentPage={users.current_page}
                lastPage={users.last_page}
                onPageChange={(page) => apply({ page: String(page) })}
              />
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <form onSubmit={submit} className="relative bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">{editing ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
              <button type="button" onClick={() => setOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nama *</label>
                <input value={form.name} onChange={(e) => field('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                {errors.name && <p className="text-[11px] text-red-600 mt-0.5">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => field('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                {errors.email && <p className="text-[11px] text-red-600 mt-0.5">{errors.email}</p>}
              </div>

              {!editing && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nomor Telepon</label>
                  <input value={form.phone} onChange={(e) => field('phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Opsional" />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role *</label>
                <select value={form.role} onChange={(e) => field('role', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white" required>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                {errors.role && <p className="text-[11px] text-red-600 mt-0.5">{errors.role}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {editing ? 'Password Baru (kosongkan bila tidak diubah)' : 'Password *'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => field('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Minimal 8 karakter"
                  required={!editing}
                />
                {errors.password && <p className="text-[11px] text-red-600 mt-0.5">{errors.password}</p>}
              </div>

              {editing && (
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => field('is_active', e.target.checked)} className="rounded border-gray-300 text-blue-600" />
                  Akun aktif
                </label>
              )}
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
