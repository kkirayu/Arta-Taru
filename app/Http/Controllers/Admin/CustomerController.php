<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query()
            ->where('role', 'customer')
            ->withCount('orders')
            ->withSum(['orders as total_spent' => fn ($q) => $q->where('payment_status', Order::PAYMENT_PAID)], 'grand_total');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->input('status') === 'active') {
            $query->where('is_active', true);
        } elseif ($request->input('status') === 'inactive') {
            $query->where('is_active', false);
        }

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $query->latest()->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(User $customer): Response
    {
        abort_unless($customer->role === 'customer', 404);

        $customer->load(['addresses']);
        $orders = $customer->orders()->withCount('items')->latest()->paginate(10);

        return Inertia::render('Admin/Customers/Show', [
            'customer' => $customer,
            'orders' => $orders,
            'summary' => [
                'orders_count' => $customer->orders()->count(),
                'total_spent' => (float) $customer->orders()->where('payment_status', Order::PAYMENT_PAID)->sum('grand_total'),
                'last_order_at' => $customer->orders()->latest()->value('created_at'),
            ],
        ]);
    }

    public function toggleActive(User $customer)
    {
        abort_unless($customer->role === 'customer', 404);

        $customer->update(['is_active' => ! $customer->is_active]);

        return back()->with('success', $customer->is_active ? 'Akun diaktifkan.' : 'Akun dinonaktifkan.');
    }
}
