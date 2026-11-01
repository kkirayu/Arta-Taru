<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', 'sku', 'name', 'size', 'color', 'price', 'stock',
        'product_image_id', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'stock' => 'integer',
    ];

    protected $appends = ['label'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function image()
    {
        return $this->belongsTo(ProductImage::class, 'product_image_id');
    }

    public function getLabelAttribute(): string
    {
        $parts = array_filter([$this->color, $this->size]);

        return $parts ? implode(' / ', $parts) : $this->name;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
