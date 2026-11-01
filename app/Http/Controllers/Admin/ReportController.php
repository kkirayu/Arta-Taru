<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyStat;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        [$start, $end] = $this->range($request);

        $daily = DailyStat::query()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->orderBy('date')
            ->get();

        $paidOrders = Order::query()
            ->where('payment_status', Order::PAYMENT_PAID)
            ->whereBetween('paid_at', [$start, $end]);

        $revenue = (float) (clone $paidOrders)->sum('grand_total');
        $paidCount = (clone $paidOrders)->count();

        $topProducts = OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.payment_status', Order::PAYMENT_PAID)
            ->whereBetween('orders.paid_at', [$start, $end])
            ->selectRaw('order_items.product_name, SUM(order_items.quantity) as quantity, SUM(order_items.subtotal) as revenue')
            ->groupBy('order_items.product_name')
            ->orderByDesc('revenue')
            ->limit(10)
            ->get();

        $byCategory = OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->where('orders.payment_status', Order::PAYMENT_PAID)
            ->whereBetween('orders.paid_at', [$start, $end])
            ->selectRaw('categories.name as category, SUM(order_items.quantity) as quantity, SUM(order_items.subtotal) as revenue')
            ->groupBy('categories.name')
            ->orderByDesc('revenue')
            ->get();

        $statusBreakdown = Order::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('Admin/Reports/Index', [
            'summary' => [
                'revenue' => $revenue,
                'paid_orders' => $paidCount,
                'orders' => Order::whereBetween('created_at', [$start, $end])->count(),
                'average_order_value' => $paidCount > 0 ? round($revenue / $paidCount, 2) : 0,
                'items_sold' => (int) $daily->sum('items_sold'),
                'new_customers' => (int) $daily->sum('new_customers'),
            ],
            'daily' => $daily,
            'top_products' => $topProducts,
            'by_category' => $byCategory,
            'status_breakdown' => $statusBreakdown,
            'filters' => [
                'from' => $start->toDateString(),
                'to' => $end->toDateString(),
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        [$start, $end] = $this->range($request);

        $filename = 'laporan-'.$start->toDateString().'-'.$end->toDateString().'.csv';

        return response()->streamDownload(function () use ($start, $end) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['Laporan Penjualan', $start->toDateString(), 's/d', $end->toDateString()]);
            fputcsv($handle, []);
            fputcsv($handle, ['Tanggal', 'Omzet', 'Order', 'Order Dibayar', 'Item Terjual', 'Produk Dilihat', 'Tambah ke Keranjang', 'Checkout']);

            DailyStat::query()
                ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
                ->orderBy('date')
                ->each(function (DailyStat $stat) use ($handle) {
                    fputcsv($handle, [
                        $stat->date->toDateString(),
                        $stat->revenue,
                        $stat->orders_count,
                        $stat->paid_orders_count,
                        $stat->items_sold,
                        $stat->product_views,
                        $stat->add_to_cart,
                        $stat->checkouts,
                    ]);
                });

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    /**
     * @return array{0: Carbon, 1: Carbon}
     */
    private function range(Request $request): array
    {
        $start = Carbon::parse($request->input('from', now()->subDays(30)->toDateString()))->startOfDay();
        $end = Carbon::parse($request->input('to', now()->toDateString()))->endOfDay();

        if ($start->greaterThan($end)) {
            [$start, $end] = [$end->copy()->startOfDay(), $start->copy()->endOfDay()];
        }

        return [$start, $end];
    }
}
