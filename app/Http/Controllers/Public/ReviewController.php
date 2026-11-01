<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request)
    {
        $user = Auth::guard('customer')->user();
        $item = OrderItem::query()->with('order')->findOrFail($request->integer('order_item_id'));

        abort_unless($item->order && $item->order->user_id === $user->id, 404);
        abort_unless($item->order->status === Order::STATUS_COMPLETED, 403);

        if (Review::where('order_item_id', $item->id)->exists()) {
            return back()->with('error', 'Anda sudah memberi ulasan untuk produk ini.');
        }

        Review::create([
            'product_id' => $item->product_id,
            'user_id' => $user->id,
            'order_item_id' => $item->id,
            'reviewer_name' => $user->name,
            'rating' => $request->integer('rating'),
            'comment' => $request->input('comment'),
            'is_approved' => false,
        ]);

        return back()->with('success', 'Terima kasih! Ulasan Anda akan tampil setelah disetujui admin.');
    }
}
