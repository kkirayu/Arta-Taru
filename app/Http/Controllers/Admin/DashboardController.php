<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AnalyticsEvent;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $nonDeleted = Product::withoutTrashed();

        $totalProducts = (clone $nonDeleted)->count();
        $activeProducts = (clone $nonDeleted)->where('is_active', true)->count();
        $hiddenProducts = (clone $nonDeleted)->where('is_active', false)->count();
        $outOfStock = (clone $nonDeleted)->where('stock_status', 'out_of_stock')->count();

        $lowStockThreshold = (int) SystemSetting::get('low_stock_threshold', 5);
        $lowStock = (clone $nonDeleted)->where('stock', '>', 0)
            ->where('stock', '<=', $lowStockThreshold)->count();

        $totalCategories = Category::withoutTrashed()->count();
        $totalBrands = Brand::withoutTrashed()->count();
        $totalProductViews = AnalyticsEvent::where('event_name', 'product_view')->count();
        $totalWhatsappClicks = AnalyticsEvent::where('event_name', 'whatsapp_click')->count();

        $popularProducts = Product::withoutTrashed()
            ->select('products.*', DB::raw('(SELECT COUNT(*) FROM analytics_events WHERE analytics_events.product_id = products.id AND event_name = \'product_view\') as view_count'))
            ->orderByDesc('view_count')
            ->limit(5)
            ->get();

        $whatsappPopular = Product::withoutTrashed()
            ->select('products.*', DB::raw('(SELECT COUNT(*) FROM analytics_events WHERE analytics_events.product_id = products.id AND event_name = \'whatsapp_click\') as click_count'))
            ->orderByDesc('click_count')
            ->limit(5)
            ->get();

        $lowStockProducts = Product::withoutTrashed()
            ->where('stock', '>', 0)
            ->where('stock', '<=', $lowStockThreshold)
            ->limit(5)
            ->get();

        $recentProducts = Product::withoutTrashed()
            ->latest()
            ->limit(5)
            ->get();

        $recentActivity = ActivityLog::with('user')
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_products' => $totalProducts,
                'active_products' => $activeProducts,
                'hidden_products' => $hiddenProducts,
                'out_of_stock' => $outOfStock,
                'low_stock' => $lowStock,
                'total_categories' => $totalCategories,
                'total_brands' => $totalBrands,
                'total_product_views' => $totalProductViews,
                'whatsapp_clicks' => $totalWhatsappClicks,
            ],
            'most_viewed_products' => $popularProducts,
            'most_whatsapp_products' => $whatsappPopular,
            'low_stock_products' => $lowStockProducts,
            'latest_products' => $recentProducts,
            'recent_logs' => $recentActivity,
        ]);
    }
}
