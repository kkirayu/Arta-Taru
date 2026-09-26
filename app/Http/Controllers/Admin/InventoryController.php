<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Product;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::withoutTrashed()->select('id', 'name', 'sku', 'stock', 'low_stock_threshold', 'stock_status');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $products = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Inventory/Index', [
            'products' => $products,
            'filters' => $request->only(['search']),
        ]);
    }

    public function updateStock(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'stock' => 'required|integer|min:0',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $old = ['stock' => $product->stock, 'stock_status' => $product->stock_status];

        $lowStockThreshold = (int) SystemSetting::get('low_stock_threshold', 5);

        $product->stock = $validated['stock'];
        if ($validated['stock'] <= 0) {
            $product->stock_status = 'out_of_stock';
        } elseif ($validated['stock'] <= $lowStockThreshold) {
            $product->stock_status = 'available';
        } else {
            $product->stock_status = 'available';
        }
        $product->save();

        ActivityLog::log('stock_updated', $product, $old, $product->toArray());

        return back()->with('success', 'Stok berhasil diperbarui.');
    }
}
