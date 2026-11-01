<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class DailyStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'date', 'revenue', 'orders_count', 'paid_orders_count', 'items_sold',
        'product_views', 'add_to_cart', 'checkouts', 'new_customers',
    ];

    protected $casts = [
        'date' => 'date',
        'revenue' => 'decimal:2',
        'orders_count' => 'integer',
        'paid_orders_count' => 'integer',
        'items_sold' => 'integer',
        'product_views' => 'integer',
        'add_to_cart' => 'integer',
        'checkouts' => 'integer',
        'new_customers' => 'integer',
    ];

    public static function forDate(Carbon|string $date): self
    {
        $date = $date instanceof Carbon ? $date->toDateString() : $date;

        return static::firstOrCreate(['date' => $date]);
    }

    /**
     * Increment a counter without racing other requests.
     */
    public static function bump(Carbon|string $date, string $column, int $amount = 1): void
    {
        if (! in_array($column, ['revenue', 'orders_count', 'paid_orders_count', 'items_sold', 'product_views', 'add_to_cart', 'checkouts', 'new_customers'], true)) {
            return;
        }

        $date = $date instanceof Carbon ? $date->toDateString() : $date;

        static::firstOrCreate(['date' => $date]);
        static::where('date', $date)->increment($column, $amount);
    }
}
