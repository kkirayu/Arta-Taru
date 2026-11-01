<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use RobThree\Auth\TwoFactorAuth;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'avatar',
        'password',
        'role',
        'is_active',
        'last_login_at',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
            'two_factor_confirmed_at' => 'datetime',
            'two_factor_recovery_codes' => 'array',
        ];
    }

    public function addresses()
    {
        return $this->hasMany(CustomerAddress::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function wishlistItems()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function defaultAddress()
    {
        return $this->hasOne(CustomerAddress::class)->where('is_default', true);
    }

    /**
     * Check if user can access the full back-office.
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'admin'], true);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isStaff(): bool
    {
        return $this->hasRole(['super_admin', 'admin', 'staff']);
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function getRoleLabelAttribute(): string
    {
        return match ($this->role) {
            'super_admin' => 'Super Admin',
            'admin' => 'Admin',
            'staff' => 'Staff',
            default => 'Customer',
        };
    }

    /**
     * Get the two-factor authentication instance.
     */
    protected function twoFactorAuth(): TwoFactorAuth
    {
        return new TwoFactorAuth('Arta Taru');
    }

    /**
     * Check if user has any of the given roles.
     */
    public function hasRole(string|array $roles): bool
    {
        $roles = is_array($roles) ? $roles : func_get_args();
        return in_array($this->role, $roles);
    }

    /**
     * Check if two-factor authentication is enabled.
     */
    public function hasTwoFactorEnabled(): bool
    {
        return !is_null($this->two_factor_confirmed_at);
    }

    /**
     * Generate a new two-factor secret.
     */
    public function generateTwoFactorSecret(): string
    {
        $tfa = $this->twoFactorAuth();
        $secret = $tfa->createSecret();
        $this->forceFill(['two_factor_secret' => $secret])->save();
        return $secret;
    }

    /**
     * Get the QR code URL for two-factor setup.
     */
    public function getTwoFactorQrCodeUrl(): string
    {
        $tfa = $this->twoFactorAuth();
        return $tfa->getQRCodeImageAsDataUri(
            $this->email,
            $this->two_factor_secret ?? ''
        );
    }

    /**
     * Verify a two-factor authentication code.
     */
    public function verifyTwoFactorCode(string $code): bool
    {
        if (!$this->two_factor_secret) {
            return false;
        }

        $tfa = $this->twoFactorAuth();
        return $tfa->verifyCode($this->two_factor_secret, $code);
    }

    /**
     * Generate recovery codes.
     */
    public function generateRecoveryCodes(int $count = 8): array
    {
        $codes = [];
        for ($i = 0; $i < $count; $i++) {
            $codes[] = strtoupper(bin2hex(random_bytes(4)));
        }
        $this->forceFill(['two_factor_recovery_codes' => $codes])->save();
        return $codes;
    }

    /**
     * Verify and consume a recovery code.
     */
    public function verifyRecoveryCode(string $code): bool
    {
        $codes = $this->two_factor_recovery_codes ?? [];
        $code = strtoupper($code);
        
        if (($key = array_search($code, $codes)) !== false) {
            unset($codes[$key]);
            $this->forceFill(['two_factor_recovery_codes' => array_values($codes)])->save();
            return true;
        }
        
        return false;
    }
}
