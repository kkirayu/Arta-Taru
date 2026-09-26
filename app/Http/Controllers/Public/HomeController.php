<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use App\Models\SystemSetting;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home/Index', [
            'banners' => Banner::active()->orderBy('sort_order')->get(),
            'featured_products' => Product::active()->featured()
                ->with('primaryImage')
                ->limit(8)
                ->get(),
            'latest_products' => Product::active()
                ->whereNotNull('published_at')
                ->with('primaryImage')
                ->latest('published_at')
                ->limit(8)
                ->get(),
            'categories' => Category::active()->roots()
                ->withCount('children')
                ->get(),
            'store_settings' => [
                'store_name' => SystemSetting::get('store_name', ''),
                'store_phone' => SystemSetting::get('store_phone', ''),
                'whatsapp_number' => SystemSetting::get('whatsapp_number', ''),
                'store_address' => SystemSetting::get('store_address', ''),
                'store_hours' => SystemSetting::get('store_hours', ''),
            ],
        ]);
    }
}
