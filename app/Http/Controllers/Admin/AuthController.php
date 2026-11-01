<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\VerifyEmailRequest;
use App\Http\Requests\Auth\TwoFactorRequest;
use App\Http\Requests\Auth\RecoveryCodeRequest;
use App\Http\Requests\Auth\ResendVerificationEmailRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    /**
     * Show the login page.
     */
    public function showLogin(): Response
    {
        return Inertia::render('Admin/Auth/Login', [
            'canResetPassword' => true,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function login(LoginRequest $request): RedirectResponse
    {
        $this->ensureIsNotRateLimited($request);

        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        if (!Auth::attempt($credentials, $remember)) {
            RateLimiter::hit($this->throttleKey($request));
            
            return back()->withErrors([
                'email' => 'Email atau password salah.',
            ])->onlyInput('email');
        }

        $user = Auth::user();
        
        // Check if email is verified
        if (!$user->hasVerifiedEmail()) {
            Auth::logout();
            return back()->withErrors([
                'email' => 'Silakan verifikasi email Anda terlebih dahulu.',
            ])->onlyInput('email');
        }

        // Check if two-factor authentication is enabled
        if ($user->hasTwoFactorEnabled()) {
            $request->session()->put('login.id', $user->id);
            $request->session()->put('login.remember', $remember);
            
            return redirect()->route('admin.two-factor.challenge');
        }

        RateLimiter::clear($this->throttleKey($request));
        $request->session()->regenerate();

        return Inertia::location(route('admin.dashboard'));
    }

    /**
     * Show the two-factor authentication challenge.
     */
    public function showTwoFactorChallenge(Request $request): Response
    {
        if (!$request->session()->has('login.id')) {
            return redirect()->route('admin.login');
        }

        return Inertia::render('Admin/Auth/TwoFactorChallenge', [
            'recoveryCodesEnabled' => true,
        ]);
    }

    /**
     * Handle the two-factor authentication challenge.
     */
    public function twoFactorChallenge(TwoFactorRequest $request): RedirectResponse
    {
        $user = User::find($request->session()->get('login.id'));

        if (!$user || !$user->hasTwoFactorEnabled()) {
            return redirect()->route('admin.login');
        }

        if (!$user->verifyTwoFactorCode($request->code)) {
            return back()->withErrors([
                'code' => 'Kode 2FA tidak valid.',
            ]);
        }

        $request->session()->forget(['login.id', 'login.remember']);
        $remember = $request->session()->pull('login.remember', false);

        Auth::login($user, $remember);
        $request->session()->regenerate();

        return Inertia::location(route('admin.dashboard'));
    }

    /**
     * Show the recovery code challenge.
     */
    public function showRecoveryCodeChallenge(Request $request): Response
    {
        if (!$request->session()->has('login.id')) {
            return redirect()->route('admin.login');
        }

        return Inertia::render('Admin/Auth/RecoveryCodeChallenge');
    }

    /**
     * Handle the recovery code challenge.
     */
    public function recoveryCodeChallenge(RecoveryCodeRequest $request): RedirectResponse
    {
        $user = User::find($request->session()->get('login.id'));

        if (!$user || !$user->hasTwoFactorEnabled()) {
            return redirect()->route('admin.login');
        }

        if (!$user->verifyRecoveryCode($request->code)) {
            return back()->withErrors([
                'code' => 'Kode recovery tidak valid atau sudah digunakan.',
            ]);
        }

        $request->session()->forget(['login.id', 'login.remember']);
        $remember = $request->session()->pull('login.remember', false);

        Auth::login($user, $remember);
        $request->session()->regenerate();

        return Inertia::location(route('admin.dashboard'));
    }

    /**
     * Show the registration page.
     */
    public function showRegister(): Response
    {
        return Inertia::render('Admin/Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function register(RegisterRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        event(new Registered($user));

        Auth::login($user);

        $request->session()->regenerate();

        return Inertia::location(route('admin.dashboard'));
    }

    /**
     * Show the password reset request page.
     */
    public function showForgotPassword(): Response
    {
        return Inertia::render('Admin/Auth/ForgotPassword');
    }

    /**
     * Handle an incoming password reset link request.
     */
    public function forgotPassword(ForgotPasswordRequest $request): RedirectResponse
    {
        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? back()->with('status', __($status))
            : back()->withErrors(['email' => __($status)]);
    }

    /**
     * Show the password reset page.
     */
    public function showResetPassword(Request $request, string $token): Response
    {
        return Inertia::render('Admin/Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email'),
        ]);
    }

    /**
     * Handle an incoming password reset request.
     */
    public function resetPassword(ResetPasswordRequest $request): RedirectResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new \Illuminate\Auth\Events\PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('admin.login')->with('status', __($status))
            : back()->withErrors(['email' => [__($status)]]);
    }

    /**
     * Show the email verification notice page.
     */
    public function showVerifyEmail(): Response
    {
        return Inertia::render('Admin/Auth/VerifyEmail');
    }

    /**
     * Handle email verification.
     */
    public function verifyEmail(VerifyEmailRequest $request): RedirectResponse
    {
        $user = User::findOrFail($request->id);

        if (!hash_equals((string) $request->hash, sha1($user->getEmailForVerification()))) {
            return redirect()->route('admin.verification.notice')->withErrors([
                'email' => 'Link verifikasi tidak valid.',
            ]);
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect()->route('admin.dashboard')->with('success', 'Email berhasil diverifikasi.');
    }

    /**
     * Resend the email verification notification.
     */
    public function resendVerificationEmail(ResendVerificationEmailRequest $request): RedirectResponse
    {
        if ($request->user()?->hasVerifiedEmail()) {
            return redirect()->route('admin.dashboard');
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('success', 'Link verifikasi telah dikirim ulang.');
    }

    /**
     * Log the user out of the application.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Revoke all tokens for the user
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }

        return redirect()->route('admin.login');
    }

    /**
     * Ensure the login request is not rate limited.
     */
    protected function ensureIsNotRateLimited(LoginRequest $request): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey($request), 5)) {
            return;
        }

        $seconds = RateLimiter::availableIn($this->throttleKey($request));

        throw \Illuminate\Validation\ValidationException::withMessages([
            'email' => "Terlalu banyak percobaan login. Coba lagi dalam {$seconds} detik.",
        ]);
    }

    /**
     * Get the rate limiter throttle key.
     */
    protected function throttleKey(LoginRequest $request): string
    {
        return Str::transliterate(Str::lower($request->email).'|'.$request->ip());
    }

    /**
     * Show the two-factor authentication setup page.
     */
    public function showTwoFactorSetup(Request $request): Response
    {
        $user = $request->user();

        if ($user->hasTwoFactorEnabled()) {
            return redirect()->route('admin.dashboard');
        }

        $secret = $user->generateTwoFactorSecret();
        $qrCodeUrl = $user->getTwoFactorQrCodeUrl();

        return Inertia::render('Admin/Auth/TwoFactorSetup', [
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl,
            'recovery_codes' => $user->generateRecoveryCodes(),
        ]);
    }

    /**
     * Enable two-factor authentication.
     */
    public function enableTwoFactor(TwoFactorRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasTwoFactorEnabled()) {
            return redirect()->route('admin.dashboard');
        }

        if (!$user->verifyTwoFactorCode($request->code)) {
            return back()->withErrors([
                'code' => 'Kode 2FA tidak valid.',
            ]);
        }

        $user->forceFill([
            'two_factor_confirmed_at' => Carbon::now(),
        ])->save();

        return redirect()->route('admin.dashboard')
            ->with('success', 'Autentikasi dua faktor berhasil diaktifkan.');
    }

    /**
     * Disable two-factor authentication.
     */
    public function disableTwoFactor(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user->hasTwoFactorEnabled()) {
            return redirect()->route('admin.dashboard');
        }

        $user->forceFill([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ])->save();

        return redirect()->route('admin.dashboard')
            ->with('success', 'Autentikasi dua faktor berhasil dinonaktifkan.');
    }

    /**
     * Generate new recovery codes.
     */
    public function generateRecoveryCodes(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user->hasTwoFactorEnabled()) {
            return redirect()->route('admin.dashboard');
        }

        $codes = $user->generateRecoveryCodes();

        return back()->with('success', 'Kode recovery baru telah dibuat.')
            ->with('recovery_codes', $codes);
    }
}