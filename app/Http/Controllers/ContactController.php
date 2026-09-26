<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Public/Contact', [
            'store_settings' => [
                'store_name' => SystemSetting::get('store_name', ''),
                'store_address' => SystemSetting::get('store_address', ''),
                'store_phone' => SystemSetting::get('store_phone', ''),
                'store_email' => SystemSetting::get('store_email', ''),
                'store_hours' => SystemSetting::get('store_hours', ''),
                'whatsapp_number' => SystemSetting::get('whatsapp_number', ''),
            ],
        ]);
    }
}
