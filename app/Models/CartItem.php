<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id', 'product_id', 'product_variant_id', 'quantity', 'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
    ];

    protected $appends = ['line_total'];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    public function getLineTotalAttribute(): float
    {
        return (float) $this->price * $this->quantity;
    }

    public function getAvailableStockAttribute(): int
    {
        if ($this->product_variant_id) {
            return (int) ($this->variant?->stock ?? 0);
        }

        return (int) ($this->product?->stock ?? 0);
    }
}
