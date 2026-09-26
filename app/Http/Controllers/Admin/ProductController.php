<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\ActivityLog;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::withoutTrashed()
            ->with(['category', 'brand', 'primaryImage']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($brandId = $request->input('brand_id')) {
            $query->where('brand_id', $brandId);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($stockStatus = $request->input('stock_status')) {
            $query->where('stock_status', $stockStatus);
        }

        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $allowedSorts = ['name', 'price', 'stock', 'created_at', 'updated_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        }

        $products = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => Category::active()->get(),
            'brands' => Brand::active()->get(),
            'filters' => $request->only(['search', 'category_id', 'brand_id', 'is_active', 'stock_status', 'sort_field', 'sort_direction']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::active()->roots()->with('children')->get(),
            'brands' => Brand::active()->get(),
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        // Auto-generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = $this->generateUniqueSlug($data['name']);
        }

        // Set published_at if is_active and not set
        if (!empty($data['is_active']) && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $product = Product::create($data);

        if ($specifications = $request->input('specifications')) {
            foreach ($specifications as $spec) {
                if (!empty($spec['key']) && !empty($spec['value'])) {
                    $product->specifications()->create($spec);
                }
            }
        }

        ActivityLog::log('product_created', $product, null, $product->toArray());

        return redirect()->route('admin.products.show', $product->id)
            ->with('success', 'Produk berhasil dibuat. Silakan tambahkan gambar produk.');
    }

    private function generateUniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $original = $slug;
        $count = 1;
        while (Product::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $original . '-' . $count++;
        }
        return $slug;
    }

    public function show($id)
    {
        $product = Product::withoutTrashed()
            ->with(['category', 'brand', 'images' => fn($q) => $q->orderBy('sort_order'), 'specifications'])
            ->findOrFail($id);

        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    public function edit($id)
    {
        $product = Product::withoutTrashed()
            ->with(['specifications'])
            ->findOrFail($id);

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => Category::active()->roots()->with('children')->get(),
            'brands' => Brand::active()->get(),
        ]);
    }

    public function update(UpdateProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);
        $old = $product->toArray();

        $data = $request->validated();

        // Update slug if name changed and slug is empty
        if (empty($data['slug']) && $product->name !== $data['name']) {
            $data['slug'] = $this->generateUniqueSlug($data['name']);
        }

        // Handle published_at
        if (!empty($data['is_active']) && empty($data['published_at'])) {
            $data['published_at'] = $product->published_at ?? now();
        }

        $product->update($data);

        if ($request->has('specifications')) {
            $product->specifications()->delete();
            foreach ($request->input('specifications', []) as $spec) {
                if (!empty($spec['key']) && !empty($spec['value'])) {
                    $product->specifications()->create($spec);
                }
            }
        }

        ActivityLog::log('product_updated', $product, $old, $product->toArray());

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $old = $product->toArray();
        $product->delete();

        ActivityLog::log('product_deleted', $product, $old, null);

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil dihapus.');
    }

    public function restore($id)
    {
        $product = Product::withTrashed()->findOrFail($id);
        $product->restore();

        ActivityLog::log('product_restored', $product, null, $product->toArray());

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil dipulihkan.');
    }

    public function togglePublish($id)
    {
        $product = Product::findOrFail($id);
        $old = ['is_active' => $product->is_active, 'published_at' => $product->published_at];

        $product->is_active = !$product->is_active;
        $product->published_at = $product->is_active ? now() : null;
        $product->save();

        ActivityLog::log('product_toggled_publish', $product, $old, $product->toArray());

        return back()->with('success', 'Status publikasi diperbarui.');
    }

    public function toggleFeatured($id)
    {
        $product = Product::findOrFail($id);
        $old = ['is_featured' => $product->is_featured];

        $product->is_featured = !$product->is_featured;
        $product->save();

        ActivityLog::log('product_toggled_featured', $product, $old, $product->toArray());

        return back()->with('success', 'Status featured diperbarui.');
    }

    public function duplicate($id)
    {
        $original = Product::findOrFail($id);
        $clone = $original->replicate();
        $clone->name = $original->name . ' (Copy)';
        $clone->sku = $original->sku . '-copy-' . Str::random(5);
        $clone->is_active = false;
        $clone->published_at = null;
        $clone->save();

        ActivityLog::log('product_duplicated', $clone, null, $clone->toArray());

        return redirect()->route('admin.products.edit', $clone)->with('success', 'Produk berhasil diduplikasi.');
    }
}
