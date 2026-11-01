<?php

namespace App\Services;

use App\Models\OrderSequence;
use App\Support\DbRetry;
use Illuminate\Database\QueryException;

class OrderNumberGenerator
{
    /**
     * Generate a daily sequential order number: AT-20261101-0001.
     */
    public function next(): string
    {
        $date = now()->toDateString();

        return DbRetry::transaction(function () use ($date) {
            $sequence = OrderSequence::query()
                ->where('date', $date)
                ->lockForUpdate()
                ->first();

            if (! $sequence) {
                try {
                    $sequence = OrderSequence::create(['date' => $date, 'last_number' => 1]);

                    return $this->format($date, 1);
                } catch (QueryException $e) {
                    // Another request created today's row first.
                    $sequence = OrderSequence::query()
                        ->where('date', $date)
                        ->lockForUpdate()
                        ->firstOrFail();
                }
            }

            $sequence->increment('last_number');

            return $this->format($date, (int) $sequence->fresh()->last_number);
        });
    }

    private function format(string $date, int $number): string
    {
        return 'AT-'.str_replace('-', '', $date).'-'.str_pad((string) $number, 4, '0', STR_PAD_LEFT);
    }
}
