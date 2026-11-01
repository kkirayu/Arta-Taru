<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CustomerLoginRequest;
use App\Http\Requests\Auth\CustomerRegisterRequest;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function __construct(private readonly CartService $cart) {}

    public function showLogin(Request $request): Response
    {
        if (Auth::guard('customer')->check()) {
            return Inertia::render('Auth/Login', ['alreadyLoggedIn' => true]);
        }

        return Inertia::render('Auth/Login', [
            'status' => $request->session()->get('status'),
            'canResetPassword' => true,
        ]);
    }

    public function login(CustomerLoginRequest $request): RedirectResponse
    {
        $key = 'customer-login:'.Str::lower($request->input('email')).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            return back()->withErrors([
                'email' => 'Terlalu banyak percobaan. Coba lagi dalam '.RateLimiter::availableIn($key).' detik.',
            ])->onlyInput('email');
        }

        if (! Auth::guard('customer')->attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            RateLimiter::hit($key, 60);

            return back()->withErrors(['email' => 'Email atau password salah.'])->onlyInput('email');
        }

        $user = Auth::guard('customer')->user();

        if (! $user->is_active) {
            Auth::guard('customer')->logout();

            return back()->withErrors(['email' => 'Akun Anda dinonaktifkan. Hubungi admin toko.'])->onlyInput('email');
        }

        RateLimiter::clear($key);
        $request->session()->regenerate();
        $user->forceFill(['last_login_at' => now()])->save();
        $this->cart->mergeAfterLogin($request, $user);

        return redirect()->intended(route('account.dashboard'))
            ->with('success', 'Selamat datang kembali, '.$user->name.'!');
    }

    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function register(CustomerRegisterRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'password' => Hash::make($request->input('password')),
            'role' => 'customer',
            'is_active' => true,
        ]);

        try {
            event(new Registered($user));
        } catch (\Throwable $e) {
            Log::warning('Verification email failed: '.$e->getMessage());
        }

        Auth::guard('customer')->login($user);
        $request->session()->regenerate();
        $this->cart->mergeAfterLogin($request, $user);

        return redirect()->route('account.dashboard')
            ->with('success', 'Akun berhasil dibuat. Selamat berbelanja!');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('customer')->logout();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('success', 'Anda sudah keluar.');
    }

    public function showForgotPassword(): Response
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function sendResetLink(Request $request): RedirectResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? back()->with('success', 'Tautan reset password sudah dikirim ke email Anda.')
            : back()->withErrors(['email' => __($status)]);
    }

    public function showResetPassword(Request $request, string $token): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email'),
        ]);
    }

    public function resetPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('customer.login')->with('success', 'Password berhasil diubah. Silakan masuk.')
            : back()->withErrors(['email' => __($status)]);
    }
}
