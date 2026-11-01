<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Wishlist;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function __construct(private readonly OrderService $orders) {}

    private function user(Request $request)
    {
        return Auth::guard('customer')->user();
    }

    public function dashboard(Request $request): Response
    {
        $user = $this->user($request);
        $this->orders->expireStale(20);

        return Inertia::render('Account/Dashboard', [
            'summary' => [
                'orders_count' => $user->orders()->count(),
                'active_orders' => $user->orders()->whereNotIn('status', [
                    Order::STATUS_COMPLETED, Order::STATUS_CANCELLED, Order::STATUS_EXPIRED,
                ])->count(),
                'wishlist_count' => Wishlist::where('user_id', $user->id)->count(),
                'total_spent' => (float) $user->orders()->where('payment_status', Order::PAYMENT_PAID)->sum('grand_total'),
            ],
            'recent_orders' => $user->orders()
                ->withCount('items')
                ->latest()
                ->limit(5)
                ->get(),
            'default_address' => $user->defaultAddress,
        ]);
    }

    public function profile(Request $request): Response
    {
        return Inertia::render('Account/Profile', [
            'user' => $this->user($request)->only(['id', 'name', 'email', 'phone', 'avatar']),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $this->user($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:32', 'regex:/^[0-9+\-\s()]+$/'],
        ]);

        $user->update($validated);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    public function updatePassword(Request $request)
    {
        $user = $this->user($request);

        $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        if (! Hash::check($request->input('current_password'), $user->password)) {
            return back()->withErrors(['current_password' => 'Password saat ini tidak sesuai.']);
        }

        $user->update(['password' => Hash::make($request->input('password'))]);

        return back()->with('success', 'Password berhasil diubah.');
    }

    public function orders(Request $request): Response
    {
        $user = $this->user($request);
        $this->orders->expireStale(20);

        $orders = $user->orders()
            ->withCount('items')
            ->when($request->input('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Account/Orders/Index', [
            'orders' => $orders,
            'statuses' => Order::STATUSES,
            'filters' => $request->only(['status']),
        ]);
    }

    public function order(Request $request, Order $order): Response
    {
        abort_unless($order->user_id === $this->user($request)->id, 404);

        $this->orders->expireIfNeeded($order);
        $order->load(['items.product', 'items.review', 'address', 'payments' => fn ($q) => $q->latest(), 'statusHistories']);

        return Inertia::render('Account/Orders/Show', [
            'order' => $order,
            'bank_accounts' => \App\Support\StoreSettings::bankAccounts(),
            'can_review' => $order->status === Order::STATUS_COMPLETED,
        ]);
    }

    public function cancel(Request $request, Order $order)
    {
        abort_unless($order->user_id === $this->user($request)->id, 404);

        if (! in_array($order->status, [Order::STATUS_PENDING_PAYMENT, Order::STATUS_WAITING_CONFIRMATION], true)) {
            return back()->with('error', 'Pesanan ini tidak dapat dibatalkan.');
        }

        $this->orders->cancel($order, 'Dibatalkan oleh pembeli');

        return back()->with('success', 'Pesanan berhasil dibatalkan.');
    }
}
