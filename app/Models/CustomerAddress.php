<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'label', 'recipient_name', 'phone', 'province', 'city',
        'district', 'postal_code', 'address_line', 'notes', 'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
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

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }
}
