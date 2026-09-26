<?php

use App\Http\Controllers\Public\AnalyticsController as PublicAnalyticsController;
use App\Http\Controllers\Public\SettingController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/analytics/events', [PublicAnalyticsController::class, 'store']);
    Route::get('/settings', [SettingController::class, 'index']);
});
