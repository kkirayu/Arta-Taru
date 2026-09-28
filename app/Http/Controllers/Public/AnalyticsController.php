<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\AnalyticsEvent;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_name' => 'required|string',
            'product_id' => 'nullable|exists:products,id',
            'category_id' => 'nullable|exists:categories,id',
            'session_id' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        $event = AnalyticsEvent::create($validated);

        return response()->json(['ok' => true]);
    }
}
