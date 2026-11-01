<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    use HasFactory;

    public const TYPE_IN = 'in';
    public const TYPE_OUT = 'out';
    public const TYPE_ADJUSTMENT = 'adjustment';
    public const TYPE_RESERVATION = 'reservation';
    public const TYPE_RELEASE = 'release';

    protected $fillable = [
        'product_id', 'product_variant_id', 'type', 'quantity', 'stock_after',
        'reference_type', 'reference_id', 'note', 'user_id',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'stock_after' => 'integer',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            self::TYPE_IN => 'Masuk',
            self::TYPE_OUT => 'Keluar',
            self::TYPE_RESERVATION => 'Reservasi',
            self::TYPE_RELEASE => 'Dilepas',
            default => 'Penyesuaian',
        };
    }
}
