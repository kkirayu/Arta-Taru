<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id', 'brand_id', 'name', 'slug', 'sku', 'short_description', 'description',
        'price', 'sale_price', 'stock', 'low_stock_threshold', 'stock_status',
        'weight', 'length', 'width', 'height', 'seo_title', 'meta_description', 'canonical_url',
        'is_featured', 'is_active', 'published_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public function specifications()
    {
        return $this->hasMany(ProductSpecification::class);
    }

    public function analyticsEvents()
    {
        return $this->hasMany(AnalyticsEvent::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock_status', 'available')->where('stock', '>', 0);
    }

    public function getEffectivePriceAttribute()
    {
        return $this->sale_price ?? $this->price;
    }

    public function getStockStatusLabelAttribute()
    {
        return match ($this->stock_status) {
            'available' => 'Tersedia',
            'low_stock' => 'Stok Terbatas',
            'out_of_stock' => 'Habis',
            'pre_order' => 'Pre-Order',
            default => 'Tidak Diketahui',
        };
    }

    public function routePath()
    {
        return '/produk/' . $this->slug;
    }
}
