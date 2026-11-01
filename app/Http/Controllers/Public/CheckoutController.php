<?php

namespace App\Http\Controllers\Public;

use App\Exceptions\CheckoutException;
use App\Exceptions\InsufficientStockException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCheckoutRequest;
use App\Models\ShippingRate;
use App\Services\CartService;
use App\Services\OrderService;
use App\Services\ShippingRateResolver;
use App\Support\StoreSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CartService $cart,
        private readonly OrderService $orders,
        private readonly ShippingRateResolver $shipping,
    ) {}

    public function index(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $cart = $this->cart->current($request);
        $summary = $this->cart->summary($cart);

        if (empty($summary['items'])) {
            return redirect()->route('cart.index')->with('error', 'Keranjang Anda masih kosong.');
        }

        $user = Auth::guard('customer')->user();
        $defaultAddress = $user?->defaultAddress;

        return Inertia::render('Checkout/Index', [
            'cart' => $summary,
            'destinations' => $this->shipping->destinations(),
            'rates' => ShippingRate::query()->active()->get()->map(fn (ShippingRate $rate) => [
                'province' => $rate->province,
                'city' => $rate->city,
                'cost' => (float) $rate->cost,
                'free_shipping_min_total' => $rate->free_shipping_min_total !== null ? (float) $rate->free_shipping_min_total : null,
                'eta_label' => $rate->eta_label,
            ])->values()->all(),
            'bank_accounts' => StoreSettings::bankAccounts(),
            'unique_code_enabled' => StoreSettings::uniqueCodeEnabled(),
            'default_address' => $defaultAddress,
            'customer' => $user ? [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ] : null,
            'settings' => [
                'store_name' => StoreSettings::storeName(),
                'whatsapp_number' => StoreSettings::whatsappNumber(),
                'store_address' => StoreSettings::get('store_address', ''),
                'store_hours' => StoreSettings::get('store_hours', ''),
                'payment_expiry_hours' => StoreSettings::paymentExpiryHours(),
                'free_shipping_min_total' => StoreSettings::freeShippingMinTotal(),
            ],
        ]);
    }

    public function store(StoreCheckoutRequest $request)
    {
        $cart = $this->cart->current($request);

        if (! $cart) {
            return redirect()->route('cart.index')->with('error', 'Keranjang Anda masih kosong.');
        }

        $user = Auth::guard('customer')->user();

        try {
            $order = $this->orders->createFromCart($cart, $request->validated(), $user);
        } catch (CheckoutException|InsufficientStockException $e) {
            return back()->with('error', $e->getMessage())->withInput();
        }

        $request->session()->put('order_access.'.$order->id, true);

        if ($user && $request->boolean('save_address') && $request->input('shipping_method') === 'delivery') {
            $user->addresses()->update(['is_default' => false]);
            $user->addresses()->create([
                'label' => 'Alamat pengiriman',
                'recipient_name' => $request->input('name'),
                'phone' => $request->input('phone'),
                'province' => $request->input('province'),
                'city' => $request->input('city'),
                'district' => $request->input('district'),
                'postal_code' => $request->input('postal_code'),
                'address_line' => $request->input('address_line'),
                'is_default' => true,
            ]);
        }

        return redirect()->route('order.success', [
            'order' => $order->order_number,
            'token' => $order->guest_token,
        ])->with('success', 'Pesanan berhasil dibuat. Silakan selesaikan pembayaran.');
    }
}
