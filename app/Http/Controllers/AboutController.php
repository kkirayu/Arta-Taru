<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        return Inertia::render('Public/About', [
            'store_settings' => [
                'store_name' => SystemSetting::get('store_name', ''),
                'store_address' => SystemSetting::get('store_address', ''),
                'store_phone' => SystemSetting::get('store_phone', ''),
                'store_hours' => SystemSetting::get('store_hours', ''),
                'about_description' => SystemSetting::get('about_description', ''),
            ],
        ]);
    }
}
