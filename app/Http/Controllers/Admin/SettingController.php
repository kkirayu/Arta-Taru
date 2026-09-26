<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = SystemSetting::all()->groupBy('group');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($request->input('settings') as $key => $value) {
            SystemSetting::set($key, $value['value'] ?? '', $value['type'] ?? 'text', $value['group'] ?? 'general');
        }

        ActivityLog::log('settings_updated', null, null, $request->input('settings'));

        return back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
