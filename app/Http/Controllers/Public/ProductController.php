<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\AnalyticsEvent;
use App\Models\Product;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show($slug)
    {
        $product = Product::active()
            ->where('slug', $slug)
            ->with([
                'category',
                'brand',
                'images' => fn($q) => $q->orderBy('sort_order'),
                'specifications',
            ])
            ->firstOrFail();

        $relatedProducts = Product::active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with('primaryImage')
            ->limit(4)
            ->get();

        AnalyticsEvent::create([
            'event_name' => 'product_view',
            'product_id' => $product->id,
            'session_id' => session()->getId(),
        ]);

        return Inertia::render('Product/Show', [
            'product' => $product,
            'related_products' => $relatedProducts,
            'whatsapp_number' => SystemSetting::get('whatsapp_number', ''),
        ]);
    }
}
