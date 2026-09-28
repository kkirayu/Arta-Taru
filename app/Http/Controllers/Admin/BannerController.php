<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::query()->orderBy('sort_order')->paginate(15)->withQueryString();
        return Inertia::render('Admin/Banners/Index', ['banners' => $banners]);
    }

    public function create()
    {
        return Inertia::render('Admin/Banners/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'desktop_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'mobile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'cta_label' => 'nullable|string|max:255',
            'cta_url' => 'nullable|string|max:255',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('desktop_image')) {
            $validated['desktop_image'] = $request->file('desktop_image')->store('banners', 'public');
        } else {
            unset($validated['desktop_image']);
        }
        if ($request->hasFile('mobile_image')) {
            $validated['mobile_image'] = $request->file('mobile_image')->store('banners', 'public');
        } else {
            unset($validated['mobile_image']);
        }

        $banner = Banner::create($validated);
        ActivityLog::log('banner_created', $banner, null, $banner->toArray());

        return redirect()->route('admin.banners.index')->with('success', 'Banner berhasil dibuat.');
    }

    public function edit($id)
    {
        $banner = Banner::findOrFail($id);
        return Inertia::render('Admin/Banners/Edit', ['banner' => $banner]);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);
        $old = $banner->toArray();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'desktop_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'mobile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'cta_label' => 'nullable|string|max:255',
            'cta_url' => 'nullable|string|max:255',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('desktop_image')) {
            $validated['desktop_image'] = $request->file('desktop_image')->store('banners', 'public');
        } else {
            unset($validated['desktop_image']);
        }
        if ($request->hasFile('mobile_image')) {
            $validated['mobile_image'] = $request->file('mobile_image')->store('banners', 'public');
        } else {
            unset($validated['mobile_image']);
        }

        $banner->update($validated);
        ActivityLog::log('banner_updated', $banner, $old, $banner->toArray());

        return redirect()->route('admin.banners.index')->with('success', 'Banner berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        $old = $banner->toArray();
        $banner->delete();
        ActivityLog::log('banner_deleted', $banner, $old, null);
        return redirect()->route('admin.banners.index')->with('success', 'Banner berhasil dihapus.');
    }

    public function toggleActive($id)
    {
        $banner = Banner::findOrFail($id);
        $old = ['is_active' => $banner->is_active];
        $banner->is_active = !$banner->is_active;
        $banner->save();
        ActivityLog::log('banner_toggled_active', $banner, $old, $banner->toArray());
        return redirect()->route('admin.banners.index')->with('success', 'Status banner diperbarui.');
    }
}
