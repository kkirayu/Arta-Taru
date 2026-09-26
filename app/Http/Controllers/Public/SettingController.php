<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;

class SettingController extends Controller
{
    public function index()
    {
        $publicKeys = [
            'store_name', 'store_phone', 'whatsapp_number',
            'store_address', 'store_hours', 'store_email',
        ];

        $settings = [];
        foreach ($publicKeys as $key) {
            $settings[$key] = SystemSetting::get($key, '');
        }

        return response()->json($settings);
    }
}
