<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $ability = 'admin')
    {
        if (!Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('admin.login');
        }

        $user = Auth::user();

        if (! $user->is_active) {
            Auth::logout();

            return $request->expectsJson()
                ? response()->json(['message' => 'Akun dinonaktifkan.'], 403)
                : redirect()->route('admin.login')->with('error', 'Akun Anda dinonaktifkan.');
        }

        // Check email verification for admin routes
        if (!$user->hasVerifiedEmail()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Email not verified.'], 403);
            }
            return redirect()->route('admin.verification.notice');
        }

        // Check if user has the required ability via Gate
        if (!Gate::allows($ability, $user)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }
            abort(403, 'Anda tidak memiliki akses ke halaman ini.');
        }

        return $next($request);
    }
}