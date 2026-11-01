<?php

namespace App\Http\Middleware;

use App\Services\CartService;
use App\Support\StoreSettings;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $admin = $request->user();
        $customer = Auth::guard('customer')->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $admin ? [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'role' => $admin->role,
                    'email_verified_at' => $admin->email_verified_at?->toISOString(),
                    'two_factor_enabled' => $admin->hasTwoFactorEnabled(),
                    'two_factor_confirmed_at' => $admin->two_factor_confirmed_at?->toISOString(),
                ] : null,
                'customer' => $customer ? [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                ] : null,
            ],
            'cart_count' => fn () => $this->cartCount($request),
            'wishlist_count' => fn () => $customer
                ? (int) $customer->wishlistItems()->count()
                : 0,
            'unread_notifications' => fn () => $admin
                ? (int) $admin->unreadNotifications()->count()
                : 0,
            'store' => fn () => [
                'name' => StoreSettings::storeName(),
                'phone' => (string) StoreSettings::get('store_phone', ''),
                'whatsapp_number' => StoreSettings::whatsappNumber(),
                'address' => (string) StoreSettings::get('store_address', ''),
                'hours' => (string) StoreSettings::get('store_hours', ''),
                'instagram_url' => (string) StoreSettings::get('instagram_url', ''),
                'facebook_url' => (string) StoreSettings::get('facebook_url', ''),
                'free_shipping_min_total' => StoreSettings::freeShippingMinTotal(),
                'payment_expiry_hours' => StoreSettings::paymentExpiryHours(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'ziggy' => fn () => [
                'url' => $request->url(),
                'route' => $request->route()?->getName(),
                'params' => $request->route()?->parameters(),
            ],
        ];
    }

    private function cartCount(Request $request): int
    {
        try {
            $cart = app(CartService::class)->current($request);

            return $cart ? (int) $cart->items()->sum('quantity') : 0;
        } catch (\Throwable $e) {
            report($e);

            return 0;
        }
    }
}
