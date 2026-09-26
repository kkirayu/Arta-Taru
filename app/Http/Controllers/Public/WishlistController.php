<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $productIds = $request->input('product_ids', []);

        $products = Product::active()
            ->whereIn('id', $productIds)
            ->with('primaryImage')
            ->get();

        return Inertia::render('Wishlist/Index', [
            'products' => $products,
        ]);
    }
}
