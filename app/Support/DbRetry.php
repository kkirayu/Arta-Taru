<?php

namespace App\Support;

use Illuminate\Database\QueryException;
use Throwable;

/**
 * TiDB may abort a transaction with "Error 9007: Write conflict" when using
 * optimistic transactions. Laravel only retries MySQL deadlocks (1205/1213),
 * so commerce critical sections (stock reservation, order numbering) use this
 * helper instead.
 */
class DbRetry
{
    private const RETRYABLE_ERRORS = [9007, 1213, 1205, 8027];

    /**
     * @template T
     *
     * @param  callable(): T  $callback
     * @return T
     */
    public static function transaction(callable $callback, int $attempts = 5, int $baseDelayMs = 40)
    {
        $lastException = null;

        for ($attempt = 1; $attempt <= $attempts; $attempt++) {
            try {
                return \Illuminate\Support\Facades\DB::transaction($callback);
            } catch (QueryException $e) {
                if (! self::isRetryable($e)) {
                    throw $e;
                }

                $lastException = $e;
                usleep($baseDelayMs * 1000 * $attempt + random_int(0, 20_000));
            }
        }

        throw $lastException;
    }

    public static function isRetryable(Throwable $e): bool
    {
        if (! $e instanceof QueryException) {
            return false;
        }

        $code = (int) ($e->errorInfo[1] ?? 0);

        if (in_array($code, self::RETRYABLE_ERRORS, true)) {
            return true;
        }

        $message = $e->getMessage();

        return str_contains($message, 'Write conflict')
            || str_contains($message, 'Deadlock found')
            || str_contains($message, 'Lock wait timeout');
    }
}
