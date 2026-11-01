<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', 'path', 'alt_text', 'is_primary', 'sort_order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    protected $appends = ['url'];

    /**
     * Resolve the public URL for the configured product image disk.
     * Works with the local "public" disk in development and S3/R2 in production.
     */
    public function getUrlAttribute(): string
    {
        if (empty($this->path)) {
            return '';
        }

        if (str_starts_with($this->path, 'http://') || str_starts_with($this->path, 'https://')) {
            return $this->path;
        }

        $disk = config('filesystems.product_disk', 'public');

        if ($disk === 'public') {
            return '/storage/'.ltrim($this->path, '/');
        }

        return Storage::disk($disk)->url($this->path);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
