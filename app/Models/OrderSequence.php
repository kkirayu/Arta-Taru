<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderSequence extends Model
{
    use HasFactory;

    protected $fillable = ['date', 'last_number'];

    protected $casts = [
        'date' => 'date',
        'last_number' => 'integer',
    ];
}
