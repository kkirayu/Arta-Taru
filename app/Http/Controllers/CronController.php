<?php

namespace App\Http\Controllers;

use App\Models\AnalyticsEvent;
use App\Models\Cart;
use App\Services\OrderService;
use Illuminate\Http\Request;

/**
 * Single idempotent endpoint for external schedulers (cron-job.org, UptimeRobot)
 * because Vercel Hobby only allows one cron run per day.
 */
class CronController extends Controller
{
    public function tick(Request $request, OrderService $orders)
    {
        $secret = (string) config('app.cron_secret');

        abort_unless($secret !== '' && hash_equals($secret, (string) $request->query('token')), 403);

        $expired = $orders->expireStale(100);
        $completed = $orders->autoComplete(100);

        // Retention: raw analytics events are only needed for recent funnels.
        $deletedEvents = AnalyticsEvent::query()
            ->where('created_at', '<', now()->subDays(90))
            ->delete();

        // Drop abandoned guest carts older than 30 days.
        $deletedCarts = Cart::query()
            ->whereNull('user_id')
            ->where('updated_at', '<', now()->subDays(30))
            ->delete();

        return response()->json([
            'ok' => true,
            'expired_orders' => $expired,
            'completed_orders' => $completed,
            'deleted_analytics_events' => $deletedEvents,
            'deleted_carts' => $deletedCarts,
            'ran_at' => now()->toIso8601String(),
        ]);
    }

    public function health()
    {
        return response()->json([
            'status' => 'ok',
            'time' => now()->toIso8601String(),
        ]);
    }
}
