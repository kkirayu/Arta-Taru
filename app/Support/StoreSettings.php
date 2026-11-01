<?php

namespace App\Support;

use App\Models\SystemSetting;
use Illuminate\Support\Facades\Cache;

class StoreSettings
{
    public const CACHE_KEY = 'store_settings.v1';

    /**
     * @return array<string, mixed>
     */
    public static function all(): array
    {
        return Cache::remember(self::CACHE_KEY, 300, function () {
            return SystemSetting::query()->pluck('value', 'key')->toArray();
        });
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $settings = self::all();

        return array_key_exists($key, $settings) ? $settings[$key] : $default;
    }

    public static function bool(string $key, bool $default = false): bool
    {
        $value = self::get($key);

        if ($value === null) {
            return $default;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    public static function int(string $key, int $default = 0): int
    {
        $value = self::get($key);

        return is_numeric($value) ? (int) $value : $default;
    }

    /**
     * @return array<int, array{bank: string, account_number: string, account_name: string}>
     */
    public static function bankAccounts(): array
    {
        $raw = self::get('bank_accounts');

        if (! $raw) {
            return [];
        }

        $decoded = is_array($raw) ? $raw : json_decode((string) $raw, true);

        return is_array($decoded) ? array_values($decoded) : [];
    }

    public static function storeName(): string
    {
        return (string) self::get('store_name', 'Toko Arta Taru');
    }

    public static function whatsappNumber(): string
    {
        return preg_replace('/[^0-9]/', '', (string) self::get('whatsapp_number', ''));
    }

    public static function paymentExpiryHours(): int
    {
        return max(1, self::int('payment_expiry_hours', 24));
    }

    public static function uniqueCodeEnabled(): bool
    {
        return self::bool('unique_code_enabled', true);
    }

    public static function autoCompleteDays(): int
    {
        return max(1, self::int('order_auto_complete_days', 7));
    }

    public static function freeShippingMinTotal(): ?float
    {
        $value = self::get('free_shipping_min_total');

        return is_numeric($value) && (float) $value > 0 ? (float) $value : null;
    }

    public static function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
