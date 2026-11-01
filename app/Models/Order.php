<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Order extends Model
{
    use HasFactory;

    public const STATUS_PENDING_PAYMENT = 'pending_payment';
    public const STATUS_WAITING_CONFIRMATION = 'waiting_confirmation';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_SHIPPED = 'shipped';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_EXPIRED = 'expired';

    public const STATUSES = [
        self::STATUS_PENDING_PAYMENT => 'Menunggu Pembayaran',
        self::STATUS_WAITING_CONFIRMATION => 'Menunggu Konfirmasi',
        self::STATUS_PROCESSING => 'Diproses',
        self::STATUS_SHIPPED => 'Dikirim',
        self::STATUS_COMPLETED => 'Selesai',
        self::STATUS_CANCELLED => 'Dibatalkan',
        self::STATUS_EXPIRED => 'Kedaluwarsa',
    ];

    public const PAYMENT_UNPAID = 'unpaid';
    public const PAYMENT_WAITING = 'waiting_confirmation';
    public const PAYMENT_PAID = 'paid';
    public const PAYMENT_REJECTED = 'rejected';
    public const PAYMENT_REFUNDED = 'refunded';

    public const PAYMENT_STATUSES = [
        self::PAYMENT_UNPAID => 'Belum Dibayar',
        self::PAYMENT_WAITING => 'Menunggu Verifikasi',
        self::PAYMENT_PAID => 'Dibayar',
        self::PAYMENT_REJECTED => 'Ditolak',
        self::PAYMENT_REFUNDED => 'Dikembalikan',
    ];

    protected $fillable = [
        'order_number', 'user_id', 'guest_token', 'customer_name', 'customer_email',
        'customer_phone', 'status', 'payment_status', 'payment_method', 'subtotal',
        'discount_total', 'shipping_total', 'unique_code', 'grand_total',
        'shipping_method', 'shipping_courier', 'tracking_number', 'notes', 'admin_notes',
        'expires_at', 'paid_at', 'shipped_at', 'completed_at', 'cancelled_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_total' => 'decimal:2',
        'shipping_total' => 'decimal:2',
        'unique_code' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'expires_at' => 'datetime',
        'paid_at' => 'datetime',
        'shipped_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Orders are addressed by their public order number in URLs.
     */
    public function getRouteKeyName(): string
    {
        return 'order_number';
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function address()
    {
        return $this->hasOne(OrderAddress::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function latestPayment()
    {
        return $this->hasOne(Payment::class)->latestOfMany();
    }

    public function statusHistories()
    {
        return $this->hasMany(OrderStatusHistory::class)->orderBy('created_at');
    }

    public function reviews()
    {
        return $this->hasManyThrough(Review::class, OrderItem::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status] ?? ucfirst($this->status);
    }

    public function getPaymentStatusLabelAttribute(): string
    {
        return self::PAYMENT_STATUSES[$this->payment_status] ?? ucfirst($this->payment_status);
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_PENDING_PAYMENT => 'amber',
            self::STATUS_WAITING_CONFIRMATION => 'blue',
            self::STATUS_PROCESSING => 'indigo',
            self::STATUS_SHIPPED => 'cyan',
            self::STATUS_COMPLETED => 'green',
            self::STATUS_CANCELLED, self::STATUS_EXPIRED => 'red',
            default => 'gray',
        };
    }

    public function isFinal(): bool
    {
        return in_array($this->status, [
            self::STATUS_COMPLETED, self::STATUS_CANCELLED, self::STATUS_EXPIRED,
        ], true);
    }

    public function isAwaitingPayment(): bool
    {
        return $this->status === self::STATUS_PENDING_PAYMENT
            || $this->status === self::STATUS_WAITING_CONFIRMATION;
    }

    public function isExpired(): bool
    {
        return $this->status === self::STATUS_PENDING_PAYMENT
            && $this->expires_at !== null
            && Carbon::now()->greaterThan($this->expires_at);
    }

    public function canTransitionTo(string $status): bool
    {
        $allowed = [
            self::STATUS_PENDING_PAYMENT => [self::STATUS_WAITING_CONFIRMATION, self::STATUS_CANCELLED, self::STATUS_EXPIRED],
            self::STATUS_WAITING_CONFIRMATION => [self::STATUS_PROCESSING, self::STATUS_CANCELLED],
            self::STATUS_PROCESSING => [self::STATUS_SHIPPED, self::STATUS_CANCELLED],
            self::STATUS_SHIPPED => [self::STATUS_COMPLETED],
            self::STATUS_COMPLETED => [],
            self::STATUS_CANCELLED => [],
            self::STATUS_EXPIRED => [],
        ];

        return in_array($status, $allowed[$this->status] ?? [], true);
    }

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeAwaitingPayment($query)
    {
        return $query->whereIn('status', [self::STATUS_PENDING_PAYMENT, self::STATUS_WAITING_CONFIRMATION]);
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', self::PAYMENT_PAID);
    }

    public function scopeBetweenDates($query, $start, $end)
    {
        return $query->whereBetween('created_at', [$start, $end]);
    }
}
