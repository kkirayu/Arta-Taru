<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    public function store(Request $request, $product_id)
    {
        // Vercel rejects request bodies over 4.5 MB, so cap uploads at 4 MB.
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        $disk = config('filesystems.product_disk', 'public');

        $file = $request->file('image');
        $path = $file->store('products', $disk);

        $isPrimary = ! ProductImage::where('product_id', $product_id)->exists();

        $image = ProductImage::create([
            'product_id' => $product_id,
            'path' => $path,
            'alt_text' => $request->input('alt_text', ''),
            'is_primary' => $isPrimary,
            'sort_order' => (int) ProductImage::where('product_id', $product_id)->max('sort_order') + 1,
        ]);

        ActivityLog::log('product_image_uploaded', $image, null, $image->toArray());

        return response()->json($image, 201);
    }

    public function destroy($product_id, $image_id)
    {
        $image = ProductImage::where('product_id', $product_id)->findOrFail($image_id);

        Storage::disk(config('filesystems.product_disk', 'public'))->delete($image->path);
        $image->delete();

        ActivityLog::log('product_image_deleted', $image, $image->toArray(), null);

        return response()->json(['message' => 'Gambar berhasil dihapus.']);
    }

    public function setPrimary($product_id, $image_id)
    {
        ProductImage::where('product_id', $product_id)
            ->where('is_primary', true)
            ->update(['is_primary' => false]);

        $image = ProductImage::where('product_id', $product_id)->findOrFail($image_id);
        $image->update(['is_primary' => true]);

        return response()->json($image);
    }

    public function reorder(Request $request, $product_id)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*.id' => 'required|exists:product_images,id',
            'images.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($request->input('images') as $item) {
            ProductImage::where('id', $item['id'])
                ->where('product_id', $product_id)
                ->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Urutan gambar diperbarui.']);
    }

    public function updateAltText(Request $request, $product_id, $image_id)
    {
        $request->validate([
            'alt_text' => 'nullable|string|max:255',
        ]);

        $image = ProductImage::where('product_id', $product_id)->findOrFail($image_id);
        $image->update(['alt_text' => $request->input('alt_text', '')]);

        return response()->json($image);
    }
}
