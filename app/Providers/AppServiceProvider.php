<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if ($this->app->isProduction()) {
            URL::forceScheme('https');
        }

        // Send admins to the back-office reset form and customers to the storefront form.
        ResetPassword::createUrlUsing(function (User $user, string $token) {
            $params = ['token' => $token, 'email' => $user->email];

            return $user->isStaff()
                ? route('admin.password.reset', $params)
                : route('password.reset', $params);
        });
    }
}
