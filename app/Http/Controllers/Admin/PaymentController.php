<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Payment::query()->with(['order', 'verifier']);

        if ($status = $request->input('status', Payment::STATUS_PENDING)) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->whereHas('order', function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $query->latest()->paginate(15)->withQueryString(),
            'counts' => [
                'pending' => Payment::where('status', Payment::STATUS_PENDING)->count(),
                'verified' => Payment::where('status', Payment::STATUS_VERIFIED)->count(),
                'rejected' => Payment::where('status', Payment::STATUS_REJECTED)->count(),
            ],
            'filters' => $request->only(['status', 'search']),
        ]);
    }
}
