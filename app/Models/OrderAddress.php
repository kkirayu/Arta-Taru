<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'recipient_name', 'phone', 'address_line', 'province',
        'city', 'district', 'postal_code', 'notes',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function getFullAddressAttribute(): string
    {
        return collect([
            $this->address_line,
            $this->district,
            $this->city,
            $this->province,
            $this->postal_code,
        ])->filter()->implode(', ');
    }
}
