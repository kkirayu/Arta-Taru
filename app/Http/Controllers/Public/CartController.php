<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(private readonly CartService $cart) {}

    public function index(Request $request): Response
    {
        $cart = $this->cart->current($request);

        return Inertia::render('Cart/Index', [
            'cart' => $this->cart->summary($cart),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:99'],
        ]);

        $product = Product::query()->active()->findOrFail($validated['product_id']);
        $cart = $this->cart->getOrCreate($request);

        try {
            $this->cart->add(
                $cart,
                $product,
                $validated['variant_id'] ?? null,
                (int) ($validated['quantity'] ?? 1),
            );
        } catch (\RuntimeException $e) {
            if ($request->wantsJson()) {
                return response()->json(['message' => $e->getMessage()], 422);
            }

            return back()->with('error', $e->getMessage());
        }

        \App\Models\DailyStat::bump(now(), 'add_to_cart');

        $summary = $this->cart->summary($cart->fresh());

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Produk ditambahkan ke keranjang.',
                'cart' => $summary,
            ]);
        }

        return back()->with('success', 'Produk ditambahkan ke keranjang.');
    }

    public function update(Request $request, int $item)
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:99'],
        ]);

        $cart = $this->cart->getOrCreate($request);
        $this->cart->updateItem($cart, $item, (int) $validated['quantity']);

        $summary = $this->cart->summary($cart->fresh());

        if ($request->wantsJson()) {
            return response()->json(['cart' => $summary]);
        }

        return back();
    }

    public function destroy(Request $request, int $item)
    {
        $cart = $this->cart->getOrCreate($request);
        $this->cart->removeItem($cart, $item);

        $summary = $this->cart->summary($cart->fresh());

        if ($request->wantsJson()) {
            return response()->json(['message' => 'Produk dihapus dari keranjang.', 'cart' => $summary]);
        }

        return back()->with('success', 'Produk dihapus dari keranjang.');
    }

    public function clear(Request $request)
    {
        $cart = $this->cart->current($request);

        if ($cart) {
            $this->cart->clear($cart);
        }

        return back()->with('success', 'Keranjang dikosongkan.');
    }

    public function mini(Request $request)
    {
        $cart = $this->cart->current($request);

        return response()->json(['cart' => $this->cart->summary($cart)]);
    }
}
