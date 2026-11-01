<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'token'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    public static function tokenFromRequest($request): string
    {
        $token = $request->cookie('cart_token');

        if (! $token || strlen($token) < 32) {
            $token = Str::random(48);
        }

        return $token;
    }

    public function getSubtotalAttribute(): float
    {
        return (float) $this->items->sum(fn (CartItem $item) => $item->price * $item->quantity);
    }

    public function getItemCountAttribute(): int
    {
        return (int) $this->items->sum('quantity');
    }
}
