<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Review::query()->with(['product:id,name,slug', 'user:id,name,email']);

        if ($request->input('status') === 'pending') {
            $query->where('is_approved', false);
        } elseif ($request->input('status') === 'approved') {
            $query->where('is_approved', true);
        }

        if ($rating = $request->input('rating')) {
            $query->where('rating', (int) $rating);
        }

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $query->latest()->paginate(20)->withQueryString(),
            'counts' => [
                'pending' => Review::where('is_approved', false)->count(),
                'approved' => Review::where('is_approved', true)->count(),
            ],
            'filters' => $request->only(['status', 'rating']),
        ]);
    }

    public function approve(Review $review)
    {
        $review->update(['is_approved' => true]);

        return back()->with('success', 'Ulasan disetujui.');
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return back()->with('success', 'Ulasan dihapus.');
    }
}
