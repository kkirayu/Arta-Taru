<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\SystemSetting;
use App\Support\StoreSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => SystemSetting::query()->pluck('value', 'key'),
            'groups' => SystemSetting::query()
                ->orderBy('group')
                ->get()
                ->groupBy('group')
                ->map(fn ($items) => $items->map(fn (SystemSetting $setting) => [
                    'key' => $setting->key,
                    'value' => $setting->value,
                    'type' => $setting->type,
                    'group' => $setting->group,
                ])->values()),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($request->input('settings') as $key => $value) {
            $existing = SystemSetting::query()->where('key', $key)->first();

            // Accept both a flat key => value map and the legacy {value,type,group} shape.
            if (is_array($value)) {
                $settingValue = $value['value'] ?? '';
                $type = $value['type'] ?? $existing?->type ?? 'text';
                $group = $value['group'] ?? $existing?->group ?? 'general';
            } else {
                $settingValue = $value;
                $type = $existing?->type ?? 'text';
                $group = $existing?->group ?? 'general';
            }

            SystemSetting::set($key, (string) $settingValue, $type, $group);
        }

        StoreSettings::flush();

        ActivityLog::log('settings_updated', null, null, $request->input('settings'));

        return redirect()->route('admin.settings.index')->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
