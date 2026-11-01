<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Protects the customer area (/akun, /checkout).
 *
 * Customers authenticate through the dedicated "customer" guard so an active
 * admin session and an active customer session never collide.
 */
class CustomerMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::guard('customer')->user();

        if (! $user) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Silakan masuk terlebih dahulu.'], 401);
            }

            return redirect()->guest(route('customer.login'));
        }

        if (! $user->is_active) {
            Auth::guard('customer')->logout();
            $request->session()->invalidate();

            return redirect()->route('customer.login')
                ->with('error', 'Akun Anda dinonaktifkan. Hubungi admin toko.');
        }

        return $next($request);
    }
}
