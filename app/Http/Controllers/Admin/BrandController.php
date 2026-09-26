<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::withoutTrashed()
            ->withCount('products')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Brands/Index', [
            'brands' => $brands,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Brands/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:brands,slug',
            'logo' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'is_active' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $brand = Brand::create($validated);

        ActivityLog::log('brand_created', $brand, null, $brand->toArray());

        return redirect()->route('admin.brands.index')->with('success', 'Brand berhasil dibuat.');
    }

    public function show($id)
    {
        $brand = Brand::withoutTrashed()
            ->withCount('products')
            ->with('products.primaryImage')
            ->findOrFail($id);

        return Inertia::render('Admin/Brands/Show', [
            'brand' => $brand,
        ]);
    }

    public function edit($id)
    {
        $brand = Brand::withoutTrashed()->findOrFail($id);

        return Inertia::render('Admin/Brands/Edit', [
            'brand' => $brand,
        ]);
    }

    public function update(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:brands,slug,' . $id,
            'logo' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'is_active' => 'boolean',
        ]);

        $old = $brand->toArray();
        $brand->update($validated);

        ActivityLog::log('brand_updated', $brand, $old, $brand->toArray());

        return redirect()->route('admin.brands.index')->with('success', 'Brand berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);
        $old = $brand->toArray();
        $brand->delete();

        ActivityLog::log('brand_deleted', $brand, $old, null);

        return redirect()->route('admin.brands.index')->with('success', 'Brand berhasil dihapus.');
    }

    public function toggleActive($id)
    {
        $brand = Brand::findOrFail($id);
        $old = ['is_active' => $brand->is_active];

        $brand->is_active = !$brand->is_active;
        $brand->save();

        ActivityLog::log('brand_toggled_active', $brand, $old, $brand->toArray());

        return back()->with('success', 'Status brand diperbarui.');
    }
}
