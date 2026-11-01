<?php

namespace App\Services;

use App\Models\ShippingRate;
use App\Support\StoreSettings;

class ShippingRateResolver
{
    /**
     * Resolve the most specific active rate for the destination.
     * City-level rates win over province-level rates.
     */
    public function resolve(?string $province, ?string $city): ?ShippingRate
    {
        if (! $province) {
            return null;
        }

        $query = ShippingRate::query()->active();

        if ($city) {
            $cityRate = (clone $query)
                ->where('province', $province)
                ->where('city', $city)
                ->orderBy('sort_order')
                ->first();

            if ($cityRate) {
                return $cityRate;
            }
        }

        return $query
            ->where('province', $province)
            ->whereNull('city')
            ->orderBy('sort_order')
            ->first();
    }

    public function costFor(?ShippingRate $rate, float $subtotal): float
    {
        if (! $rate) {
            return 0.0;
        }

        $freeMinimum = $rate->free_shipping_min_total !== null
            ? (float) $rate->free_shipping_min_total
            : StoreSettings::freeShippingMinTotal();

        if ($freeMinimum !== null && $subtotal >= $freeMinimum) {
            return 0.0;
        }

        return (float) $rate->cost;
    }

    /**
     * Destination options for the checkout form.
     *
     * @return array<int, array{province: string, cities: array<int, string>}>
     */
    public function destinations(): array
    {
        return ShippingRate::query()
            ->active()
            ->orderBy('province')
            ->orderBy('city')
            ->get()
            ->groupBy('province')
            ->map(fn ($rates, $province) => [
                'province' => $province,
                'cities' => $rates->pluck('city')->filter()->unique()->values()->all(),
            ])
            ->values()
            ->all();
    }
}
