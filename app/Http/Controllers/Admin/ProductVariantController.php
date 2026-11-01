<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductVariantController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $data = $this->validated($request, $product);

        $variant = $product->variants()->create($data);

        $this->syncProductStock($product);

        ActivityLog::log('product_variant_created', $variant, null, $variant->toArray());

        return back()->with('success', 'Varian produk ditambahkan.');
    }

    public function update(Request $request, Product $product, ProductVariant $variant)
    {
        abort_unless($variant->product_id === $product->id, 404);

        $data = $this->validated($request, $product, $variant);

        $variant->update($data);

        $this->syncProductStock($product);

        ActivityLog::log('product_variant_updated', $variant, null, $variant->toArray());

        return back()->with('success', 'Varian produk diperbarui.');
    }

    public function destroy(Product $product, ProductVariant $variant)
    {
        abort_unless($variant->product_id === $product->id, 404);

        $variant->delete();

        $this->syncProductStock($product);

        ActivityLog::log('product_variant_deleted', $variant, $variant->toArray(), null);

        return back()->with('success', 'Varian produk dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, Product $product, ?ProductVariant $variant = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sku' => [
                'required', 'string', 'max:128',
                Rule::unique('product_variants', 'sku')->ignore($variant?->id),
            ],
            'size' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:50'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'product_image_id' => ['nullable', 'integer', 'exists:product_images,id'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $data['is_active'] = $request->boolean('is_active', true);
        $data['sort_order'] = $data['sort_order'] ?? 0;

        return $data;
    }

    /**
     * Product stock is the aggregate of its variants when variants exist.
     */
    private function syncProductStock(Product $product): void
    {
        $product->load('variants');

        if ($product->variants->isEmpty()) {
            return;
        }

        $product->stock = (int) $product->variants->sum('stock');
        $product->syncStockStatus();
        $product->save();
    }
}
