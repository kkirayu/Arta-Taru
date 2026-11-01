<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'from_status', 'to_status', 'note', 'changed_by'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    public function getToStatusLabelAttribute(): string
    {
        return Order::STATUSES[$this->to_status] ?? ucfirst($this->to_status);
    }
}
