<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::guard('customer')->user();

        if (! $user) {
            return Inertia::render('Wishlist/Index', [
                'products' => [],
                'product_ids' => [],
                'is_guest' => true,
            ]);
        }

        $ids = Wishlist::where('user_id', $user->id)->pluck('product_id');

        return Inertia::render('Wishlist/Index', [
            'products' => Product::active()->whereIn('id', $ids)->with('primaryImage')->get(),
            'product_ids' => $ids,
            'is_guest' => false,
        ]);
    }

    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);

        $user = Auth::guard('customer')->user();

        if (! $user) {
            return response()->json([
                'in_wishlist' => false,
                'requires_login' => true,
                'message' => 'Masuk ke akun untuk menyimpan wishlist.',
            ], 401);
        }

        $existing = Wishlist::where('user_id', $user->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existing) {
            $existing->delete();
            $inWishlist = false;
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $validated['product_id'],
            ]);
            $inWishlist = true;
        }

        return response()->json([
            'in_wishlist' => $inWishlist,
            'count' => Wishlist::where('user_id', $user->id)->count(),
        ]);
    }

    public function merge(Request $request)
    {
        $user = Auth::guard('customer')->user();

        if (! $user) {
            return response()->json(['merged' => 0], 401);
        }

        $validated = $request->validate([
            'product_ids' => ['array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
        ]);

        $ids = collect($validated['product_ids'] ?? [])->unique();

        foreach ($ids as $id) {
            Wishlist::firstOrCreate([
                'user_id' => $user->id,
                'product_id' => $id,
            ]);
        }

        return response()->json([
            'merged' => $ids->count(),
            'count' => Wishlist::where('user_id', $user->id)->count(),
        ]);
    }
}
