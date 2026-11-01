<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingRate extends Model
{
    use HasFactory;

    protected $fillable = [
        'province', 'city', 'district', 'cost', 'free_shipping_min_total',
        'eta_min_days', 'eta_max_days', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'free_shipping_min_total' => 'decimal:2',
        'is_active' => 'boolean',
        'eta_min_days' => 'integer',
        'eta_max_days' => 'integer',
    ];

    public function getAreaLabelAttribute(): string
    {
        return collect([$this->district, $this->city, $this->province])
            ->filter()
            ->implode(', ');
    }

    public function getEtaLabelAttribute(): string
    {
        if ($this->eta_min_days === $this->eta_max_days) {
            return $this->eta_min_days.' hari';
        }

        return $this->eta_min_days.'–'.$this->eta_max_days.' hari';
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
