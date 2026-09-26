<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AnalyticsEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());

        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        $events = AnalyticsEvent::whereBetween('created_at', [$start, $end]);

        $productViews = (clone $events)->where('event_name', 'product_view')->count();
        $categoryViews = (clone $events)->where('event_name', 'category_view')->count();
        $searches = (clone $events)->where('event_name', 'search')->count();
        $whatsappClicks = (clone $events)->where('event_name', 'whatsapp_click')->count();

        $dailyViews = (clone $events)
            ->where('event_name', 'product_view')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $dailyWhatsapp = AnalyticsEvent::whereBetween('created_at', [$start, $end])
            ->where('event_name', 'whatsapp_click')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $popularProducts = AnalyticsEvent::where('event_name', 'product_view')
            ->whereBetween('created_at', [$start, $end])
            ->whereNotNull('product_id')
            ->select('product_id', DB::raw('count(*) as count'))
            ->groupBy('product_id')
            ->orderByDesc('count')
            ->limit(10)
            ->with('product')
            ->get();

        $popularSearches = AnalyticsEvent::where('event_name', 'search')
            ->whereBetween('created_at', [$start, $end])
            ->select(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.query')) as search_term"), DB::raw('count(*) as count'))
            ->groupBy('search_term')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Analytics/Index', [
            'product_views' => $productViews,
            'category_views' => $categoryViews,
            'searches' => $searches,
            'whatsapp_clicks' => $whatsappClicks,
            'daily_views' => $dailyViews,
            'daily_whatsapp' => $dailyWhatsapp,
            'popular_products' => $popularProducts,
            'popular_searches' => $popularSearches,
            'filters' => ['start_date' => $startDate, 'end_date' => $endDate],
        ]);
    }
}
