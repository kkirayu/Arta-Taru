<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

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
        'stock' => 'integer',
        'low_stock_threshold' => 'integer',
    ];

    protected $appends = ['effective_price', 'stock_status_label', 'discount_percentage'];

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

    public function variants()
    {
        return $this->hasMany(ProductVariant::class)->orderBy('sort_order');
    }

    public function activeVariants()
    {
        return $this->hasMany(ProductVariant::class)->where('is_active', true)->orderBy('sort_order');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews()
    {
        return $this->hasMany(Review::class)->where('is_approved', true)->latest();
    }

    public function analyticsEvents()
    {
        return $this->hasMany(AnalyticsEvent::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class)->latest();
    }

    /**
     * Only products that are enabled and already published.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', Carbon::now());
            });
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0)
            ->whereIn('stock_status', ['available', 'low_stock']);
    }

    public function getEffectivePriceAttribute(): float
    {
        if ($this->relationLoaded('variants') && $this->variants->isNotEmpty()) {
            $prices = $this->variants->pluck('price')->filter();

            if ($prices->isNotEmpty()) {
                return (float) min($prices);
            }
        }

        return (float) ($this->sale_price ?? $this->price);
    }

    public function getDiscountPercentageAttribute(): int
    {
        if ($this->sale_price === null || (float) $this->price <= 0) {
            return 0;
        }

        if ((float) $this->sale_price >= (float) $this->price) {
            return 0;
        }

        return (int) round(((float) $this->price - (float) $this->sale_price) / (float) $this->price * 100);
    }

    public function getStockStatusLabelAttribute(): string
    {
        return match ($this->stock_status) {
            'available' => 'Tersedia',
            'low_stock' => 'Stok Terbatas',
            'out_of_stock' => 'Habis',
            'pre_order' => 'Pre-Order',
            default => 'Tidak Diketahui',
        };
    }

    public function getIsInStockAttribute(): bool
    {
        return $this->stock_status !== 'out_of_stock' && $this->stock > 0;
    }

    public function getAverageRatingAttribute(): float
    {
        return round((float) ($this->approved_reviews_avg_rating ?? 0), 1);
    }

    /**
     * Recalculate stock_status from the current stock value.
     */
    public function syncStockStatus(): void
    {
        $threshold = (int) ($this->low_stock_threshold ?: 5);

        if ($this->stock <= 0) {
            $this->stock_status = 'out_of_stock';
        } elseif ($this->stock <= $threshold) {
            $this->stock_status = 'low_stock';
        } elseif ($this->stock_status !== 'pre_order') {
            $this->stock_status = 'available';
        }
    }

    public function routePath(): string
    {
        return '/produk/'.$this->slug;
    }
}
