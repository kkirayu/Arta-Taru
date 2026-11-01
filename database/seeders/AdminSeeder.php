<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@artataru.com');
        $password = env('ADMIN_PASSWORD', 'password');

        $admin = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_NAME', 'Admin Toko'),
                'password' => Hash::make($password),
                'role' => 'super_admin',
                'is_active' => true,
            ]
        );

        // Ensure the seeded account can actually log in on an existing install.
        $admin->forceFill([
            'role' => 'super_admin',
            'is_active' => true,
            'email_verified_at' => $admin->email_verified_at ?? now(),
        ])->save();
    }
}
