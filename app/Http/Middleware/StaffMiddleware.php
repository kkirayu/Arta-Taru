<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Allows back-office roles that may operate orders: super_admin, admin, staff.
 * Full administration (settings, products, users) still requires AdminMiddleware.
 */
class StaffMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::guard('web')->user();

        if (! $user) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }

            return redirect()->route('admin.login');
        }

        if (! $user->hasVerifiedEmail()) {
            return $request->expectsJson()
                ? response()->json(['message' => 'Email not verified.'], 403)
                : redirect()->route('admin.verification.notice');
        }

        if (! $user->is_active || ! $user->hasRole(['super_admin', 'admin', 'staff'])) {
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        return $next($request);
    }
}
