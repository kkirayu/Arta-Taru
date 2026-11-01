<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query()->whereIn('role', ['super_admin', 'admin', 'staff']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => $query->orderBy('name')->paginate(20)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize('super-admin');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(['admin', 'staff'])],
            'phone' => ['nullable', 'string', 'max:32'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        return back()->with('success', 'Pengguna back-office ditambahkan.');
    }

    public function update(Request $request, User $user)
    {
        Gate::authorize('super-admin');
        abort_unless(in_array($user->role, ['super_admin', 'admin', 'staff'], true), 404);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in(['super_admin', 'admin', 'staff'])],
            'is_active' => ['sometimes', 'boolean'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if ($user->isSuperAdmin() && $validated['role'] !== 'super_admin') {
            $remaining = User::where('role', 'super_admin')->whereKeyNot($user->id)->count();

            if ($remaining === 0) {
                return back()->with('error', 'Harus ada minimal satu super admin.');
            }
        }

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'is_active' => $validated['is_active'] ?? $user->is_active,
        ]);

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return back()->with('success', 'Data pengguna diperbarui.');
    }

    public function destroy(User $user)
    {
        Gate::authorize('super-admin');
        abort_unless($user->id !== auth()->id(), 422, 'Tidak bisa menghapus akun sendiri.');

        if ($user->isSuperAdmin()) {
            $remaining = User::where('role', 'super_admin')->whereKeyNot($user->id)->count();

            if ($remaining === 0) {
                return back()->with('error', 'Harus ada minimal satu super admin.');
            }
        }

        $user->delete();

        return back()->with('success', 'Pengguna dihapus.');
    }
}
