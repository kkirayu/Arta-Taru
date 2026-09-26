<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::active()->with(['category', 'brand', 'primaryImage']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categorySlug = $request->input('category')) {
            $category = Category::active()->where('slug', $categorySlug)->first();
            if ($category) {
                $categoryIds = $category->children()->pluck('id')->push($category->id);
                $query->whereIn('category_id', $categoryIds);
            }
        }

        if ($brandSlug = $request->input('brand')) {
            $brand = Brand::active()->where('slug', $brandSlug)->first();
            if ($brand) {
                $query->where('brand_id', $brand->id);
            }
        }

        if ($minPrice = $request->input('min_price')) {
            $query->where('price', '>=', $minPrice);
        }

        if ($maxPrice = $request->input('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        if ($stockStatus = $request->input('stock_status')) {
            $query->where('stock_status', $stockStatus);
        }

        $sort = $request->input('sort', 'latest');
        $query = match ($sort) {
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            default => $query->latest('published_at'),
        };

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('Catalog/Index', [
            'products' => $products,
            'categories' => Category::active()->roots()->with('children')->get(),
            'brands' => Brand::active()->get(),
            'filters' => $request->only(['search', 'category', 'brand', 'min_price', 'max_price', 'stock_status', 'sort']),
        ]);
    }

    public function category(Request $request, $slug)
    {
        $category = Category::active()->where('slug', $slug)->firstOrFail();

        $categoryIds = $category->children()->pluck('id')->push($category->id);

        $query = Product::active()
            ->whereIn('category_id', $categoryIds)
            ->with(['category', 'brand', 'primaryImage']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($brandSlug = $request->input('brand')) {
            $brand = Brand::active()->where('slug', $brandSlug)->first();
            if ($brand) {
                $query->where('brand_id', $brand->id);
            }
        }

        if ($minPrice = $request->input('min_price')) {
            $query->where('price', '>=', $minPrice);
        }

        if ($maxPrice = $request->input('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        if ($stockStatus = $request->input('stock_status')) {
            $query->where('stock_status', $stockStatus);
        }

        $sort = $request->input('sort', 'latest');
        $query = match ($sort) {
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            default => $query->latest('published_at'),
        };

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('Catalog/Category', [
            'category' => $category,
            'products' => $products,
            'categories' => Category::active()->roots()->with('children')->get(),
            'brands' => Brand::active()->get(),
            'filters' => $request->only(['search', 'brand', 'min_price', 'max_price', 'stock_status', 'sort']),
        ]);
    }
}
