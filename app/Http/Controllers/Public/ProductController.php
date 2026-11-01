<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\AnalyticsEvent;
use App\Models\DailyStat;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\ShippingRate;
use App\Models\SystemSetting;
use App\Support\StoreSettings;
use Illuminate\Support\Facades\Auth;
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
                'images' => fn ($q) => $q->orderBy('sort_order'),
                'specifications',
                'activeVariants.image',
                'approvedReviews' => fn ($q) => $q->limit(10),
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
        DailyStat::bump(now(), 'product_views');

        $user = Auth::guard('customer')->user();
        $reviewableItem = null;

        if ($user) {
            $reviewableItem = OrderItem::query()
                ->where('product_id', $product->id)
                ->whereHas('order', function ($query) use ($user) {
                    $query->where('user_id', $user->id)
                        ->where('status', Order::STATUS_COMPLETED);
                })
                ->whereDoesntHave('review')
                ->with('order')
                ->first();
        }

        $reviewCount = Review::where('product_id', $product->id)->where('is_approved', true)->count();

        return Inertia::render('Product/Show', [
            'product' => $product,
            'related_products' => $relatedProducts,
            'whatsapp_number' => SystemSetting::get('whatsapp_number', ''),
            'reviews' => $product->approvedReviews,
            'review_summary' => [
                'count' => $reviewCount,
                'average' => round((float) Review::where('product_id', $product->id)->where('is_approved', true)->avg('rating'), 1),
            ],
            'reviewable_item' => $reviewableItem,
            'shipping_rates' => ShippingRate::query()->active()->orderBy('cost')->limit(3)->get(['province', 'city', 'cost', 'eta_min_days', 'eta_max_days']),
            'free_shipping_min_total' => StoreSettings::freeShippingMinTotal(),
            'is_wishlisted' => $user
                ? \App\Models\Wishlist::where('user_id', $user->id)->where('product_id', $product->id)->exists()
                : false,
        ]);
    }
}
