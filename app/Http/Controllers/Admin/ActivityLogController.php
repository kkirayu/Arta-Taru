<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = ActivityLog::with('user')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/ActivityLogs/Index', [
            'logs' => $logs,
        ]);
    }
}
