<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withoutTrashed()
            ->withCount('children')
            ->roots()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Create', [
            'parentCategories' => Category::active()->roots()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'seo_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category = Category::create($validated);

        ActivityLog::log('category_created', $category, null, $category->toArray());

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil dibuat.');
    }

    public function show($id)
    {
        $category = Category::withoutTrashed()
            ->withCount('products')
            ->with('children')
            ->findOrFail($id);

        return Inertia::render('Admin/Categories/Show', [
            'category' => $category,
        ]);
    }

    public function edit($id)
    {
        $category = Category::withoutTrashed()->findOrFail($id);

        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
            'parentCategories' => Category::active()->roots()->where('id', '!=', $id)->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug,' . $id,
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'seo_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $old = $category->toArray();
        $category->update($validated);

        ActivityLog::log('category_updated', $category, $old, $category->toArray());

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        if ($category->products()->count() > 0) {
            return back()->withErrors(['error' => 'Tidak dapat menghapus kategori yang masih memiliki produk.']);
        }

        $old = $category->toArray();
        $category->delete();

        ActivityLog::log('category_deleted', $category, $old, null);

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil dihapus.');
    }

    public function restore($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $category->restore();

        ActivityLog::log('category_restored', $category, null, $category->toArray());

        return redirect()->route('admin.categories.index')->with('success', 'Kategori berhasil dipulihkan.');
    }
}
