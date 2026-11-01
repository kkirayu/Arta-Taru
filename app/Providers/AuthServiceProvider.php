<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Admin gate - only users with admin role
        Gate::define('admin', function (User $user) {
            return $user->isAdmin();
        });

        // Only super admins may manage back-office accounts.
        Gate::define('super-admin', function (User $user) {
            return $user->isSuperAdmin();
        });

        // Manage users gate
        Gate::define('manage-users', function (User $user) {
            return $user->isAdmin();
        });

        // Manage products gate
        Gate::define('manage-products', function (User $user) {
            return $user->isAdmin();
        });

        // Manage categories gate
        Gate::define('manage-categories', function (User $user) {
            return $user->isAdmin();
        });

        // Manage settings gate
        Gate::define('manage-settings', function (User $user) {
            return $user->isAdmin();
        });

        // View analytics gate
        Gate::define('view-analytics', function (User $user) {
            return $user->isAdmin();
        });

        // Manage inventory gate
        Gate::define('manage-inventory', function (User $user) {
            return $user->isAdmin();
        });
    }
}