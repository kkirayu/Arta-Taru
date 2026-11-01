<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\ApiTokenController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductImageController;
use App\Http\Controllers\Admin\ProductVariantController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ShippingRateController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CronController;
use App\Http\Controllers\Public\AccountController;
use App\Http\Controllers\Public\AddressController;
use App\Http\Controllers\Public\AnalyticsController as PublicAnalyticsController;
use App\Http\Controllers\Public\AuthController as CustomerAuthController;
use App\Http\Controllers\Public\CartController;
use App\Http\Controllers\Public\CatalogController;
use App\Http\Controllers\Public\CheckoutController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\OrderController;
use App\Http\Controllers\Public\PageController;
use App\Http\Controllers\Public\ProductController as PublicProductController;
use App\Http\Controllers\Public\ReviewController;
use App\Http\Controllers\Public\SettingController as PublicSettingController;
use App\Http\Controllers\Public\WishlistController;
use App\Http\Controllers\SeoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Storefront
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/katalog', [CatalogController::class, 'index'])->name('catalog');
Route::get('/kategori/{slug}', [CatalogController::class, 'category'])->name('catalog.category');
Route::get('/produk/{slug}', [PublicProductController::class, 'show'])->name('product.show');
Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');
Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
Route::post('/wishlist/merge', [WishlistController::class, 'merge'])->name('wishlist.merge');
Route::get('/tentang', [AboutController::class, 'index'])->name('about');
Route::get('/kontak', [ContactController::class, 'index'])->name('contact');

// Static content pages (FAQ, policies) driven by store settings.
Route::get('/faq', [PageController::class, 'show'])->defaults('page', 'faq')->name('page.faq');
Route::get('/kebijakan-privasi', [PageController::class, 'show'])->defaults('page', 'kebijakan-privasi')->name('page.privacy');
Route::get('/syarat-ketentuan', [PageController::class, 'show'])->defaults('page', 'syarat-ketentuan')->name('page.terms');
Route::get('/pengembalian', [PageController::class, 'show'])->defaults('page', 'pengembalian')->name('page.returns');

Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('sitemap');
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('robots');

Route::post('/api/v1/analytics/events', [PublicAnalyticsController::class, 'store']);
Route::get('/api/v1/settings', [PublicSettingController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Customer authentication
|--------------------------------------------------------------------------
*/

Route::middleware('guest:customer')->group(function () {
    Route::get('/masuk', [CustomerAuthController::class, 'showLogin'])->name('customer.login');
    Route::post('/masuk', [CustomerAuthController::class, 'login'])->name('customer.login.store');

    Route::get('/daftar', [CustomerAuthController::class, 'showRegister'])->name('customer.register');
    Route::post('/daftar', [CustomerAuthController::class, 'register'])->name('customer.register.store');

    Route::get('/lupa-password', [CustomerAuthController::class, 'showForgotPassword'])->name('customer.password.request');
    Route::post('/lupa-password', [CustomerAuthController::class, 'sendResetLink'])
        ->middleware('throttle:6,1')
        ->name('customer.password.email');
});

// Named exactly "password.reset" so Laravel's ResetPassword notification resolves it.
Route::get('/reset-password/{token}', [CustomerAuthController::class, 'showResetPassword'])
    ->middleware('guest:customer')
    ->name('password.reset');
Route::post('/reset-password', [CustomerAuthController::class, 'resetPassword'])
    ->middleware('guest:customer')
    ->name('password.update');

Route::post('/keluar', [CustomerAuthController::class, 'logout'])
    ->middleware('customer')
    ->name('customer.logout');

/*
|--------------------------------------------------------------------------
| Cart
|--------------------------------------------------------------------------
*/

Route::get('/keranjang', [CartController::class, 'index'])->name('cart.index');
Route::post('/keranjang', [CartController::class, 'store'])->name('cart.store');
Route::delete('/keranjang', [CartController::class, 'clear'])->name('cart.clear');
Route::patch('/keranjang/{item}', [CartController::class, 'update'])->whereNumber('item')->name('cart.update');
Route::delete('/keranjang/{item}', [CartController::class, 'destroy'])->whereNumber('item')->name('cart.destroy');
Route::get('/api/cart/mini', [CartController::class, 'mini'])->name('cart.mini');

/*
|--------------------------------------------------------------------------
| Checkout & orders (guest + customer)
|--------------------------------------------------------------------------
*/

Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])
    ->middleware('throttle:20,1')
    ->name('checkout.store');

Route::get('/lacak-pesanan', [OrderController::class, 'trackForm'])->name('order.track.form');
Route::post('/lacak-pesanan', [OrderController::class, 'track'])
    ->middleware('throttle:10,1')
    ->name('order.track');

Route::get('/pesanan/{order}/berhasil', [OrderController::class, 'success'])->name('order.success');
Route::get('/pesanan/{order}', [OrderController::class, 'show'])->name('order.show');
Route::post('/pesanan/{order}/bukti', [OrderController::class, 'uploadProof'])
    ->middleware('throttle:10,1')
    ->name('order.proof');
Route::get('/pesanan/{order}/invoice', [OrderController::class, 'invoice'])->name('order.invoice');

Route::post('/ulasan', [ReviewController::class, 'store'])
    ->middleware('customer')
    ->name('review.store');

/*
|--------------------------------------------------------------------------
| Customer account
|--------------------------------------------------------------------------
*/

Route::middleware('customer')->prefix('akun')->name('account.')->group(function () {
    Route::get('/', [AccountController::class, 'dashboard'])->name('dashboard');
    Route::get('/profil', [AccountController::class, 'profile'])->name('profile');
    Route::put('/profil', [AccountController::class, 'updateProfile'])->name('profile.update');
    Route::put('/password', [AccountController::class, 'updatePassword'])->name('password.update');

    Route::get('/pesanan', [AccountController::class, 'orders'])->name('orders');
    Route::get('/pesanan/{order}', [AccountController::class, 'order'])->name('orders.show');
    Route::post('/pesanan/{order}/batal', [AccountController::class, 'cancel'])->name('orders.cancel');

    Route::get('/alamat', [AddressController::class, 'index'])->name('addresses');
    Route::post('/alamat', [AddressController::class, 'store'])->name('addresses.store');
    Route::put('/alamat/{address}', [AddressController::class, 'update'])->name('addresses.update');
    Route::delete('/alamat/{address}', [AddressController::class, 'destroy'])->name('addresses.destroy');
    Route::post('/alamat/{address}/utama', [AddressController::class, 'setDefault'])->name('addresses.default');
});

/*
|--------------------------------------------------------------------------
| Admin authentication
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');

    Route::get('/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');
    Route::get('/reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');

    Route::get('/verify-email', [AuthController::class, 'showVerifyEmail'])->name('verification.notice');
    Route::get('/verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    Route::post('/verification-notification', [AuthController::class, 'resendVerificationEmail'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});

// Two-factor challenge: authenticated but not necessarily verified yet.
Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () {
    Route::get('/two-factor-challenge', [AuthController::class, 'showTwoFactorChallenge'])->name('two-factor.challenge');
    Route::post('/two-factor-challenge', [AuthController::class, 'twoFactorChallenge'])->name('two-factor.challenge.post');
    Route::get('/recovery-code-challenge', [AuthController::class, 'showRecoveryCodeChallenge'])->name('recovery-code.challenge');
    Route::post('/recovery-code-challenge', [AuthController::class, 'recoveryCodeChallenge'])->name('recovery-code.challenge.post');
});

/*
|--------------------------------------------------------------------------
| Admin back-office
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::resource('api-tokens', ApiTokenController::class)->only(['index', 'store', 'destroy']);

    Route::get('/two-factor', [AuthController::class, 'showTwoFactorSetup'])->name('two-factor.setup');
    Route::post('/two-factor', [AuthController::class, 'enableTwoFactor'])->name('two-factor.enable');
    Route::delete('/two-factor', [AuthController::class, 'disableTwoFactor'])->name('two-factor.disable');
    Route::post('/two-factor/recovery-codes', [AuthController::class, 'generateRecoveryCodes'])->name('two-factor.recovery-codes');

    // Catalog
    Route::resource('products', ProductController::class);
    Route::post('products/{product}/toggle-publish', [ProductController::class, 'togglePublish'])->name('products.toggle-publish');
    Route::post('products/{product}/toggle-featured', [ProductController::class, 'toggleFeatured'])->name('products.toggle-featured');
    Route::post('products/{product}/duplicate', [ProductController::class, 'duplicate'])->name('products.duplicate');
    Route::post('products/{product}/restore', [ProductController::class, 'restore'])->name('products.restore');

    Route::post('products/{product}/images', [ProductImageController::class, 'store'])->name('products.images.store');
    Route::delete('products/{product}/images/{image}', [ProductImageController::class, 'destroy'])->name('products.images.destroy');
    Route::post('products/{product}/images/{image}/set-primary', [ProductImageController::class, 'setPrimary'])->name('products.images.set-primary');
    Route::post('products/{product}/images/reorder', [ProductImageController::class, 'reorder'])->name('products.images.reorder');
    Route::put('products/{product}/images/{image}/alt-text', [ProductImageController::class, 'updateAltText'])->name('products.images.alt-text');

    // Variants
    Route::post('products/{product}/variants', [ProductVariantController::class, 'store'])->name('products.variants.store');
    Route::put('products/{product}/variants/{variant}', [ProductVariantController::class, 'update'])->name('products.variants.update');
    Route::delete('products/{product}/variants/{variant}', [ProductVariantController::class, 'destroy'])->name('products.variants.destroy');

    Route::resource('categories', CategoryController::class);
    Route::post('categories/{category}/restore', [CategoryController::class, 'restore'])->name('categories.restore');

    Route::resource('brands', BrandController::class);
    Route::post('brands/{brand}/toggle-active', [BrandController::class, 'toggleActive'])->name('brands.toggle-active');

    Route::resource('banners', BannerController::class);
    Route::post('banners/{banner}/toggle-active', [BannerController::class, 'toggleActive'])->name('banners.toggle-active');

    Route::get('inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::post('inventory/update-stock', [InventoryController::class, 'updateStock'])->name('inventory.update-stock');

    Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');

    Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('settings', [SettingController::class, 'update'])->name('settings.update');

    // Shipping rates
    Route::get('shipping-rates', [ShippingRateController::class, 'index'])->name('shipping-rates.index');
    Route::post('shipping-rates', [ShippingRateController::class, 'store'])->name('shipping-rates.store');
    Route::put('shipping-rates/{shippingRate}', [ShippingRateController::class, 'update'])->name('shipping-rates.update');
    Route::delete('shipping-rates/{shippingRate}', [ShippingRateController::class, 'destroy'])->name('shipping-rates.destroy');
    Route::post('shipping-rates/{shippingRate}/toggle-active', [ShippingRateController::class, 'toggleActive'])->name('shipping-rates.toggle-active');

    // Back-office accounts
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

/*
|--------------------------------------------------------------------------
| Admin commerce (admin + staff)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified', 'staff'])->group(function () {
    Route::get('orders/export', [AdminOrderController::class, 'export'])->name('orders.export');
    Route::get('orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::post('orders/{order}/ship', [AdminOrderController::class, 'ship'])->name('orders.ship');
    Route::post('orders/{order}/complete', [AdminOrderController::class, 'complete'])->name('orders.complete');
    Route::post('orders/{order}/cancel', [AdminOrderController::class, 'cancel'])->name('orders.cancel');
    Route::post('orders/{order}/payments/{payment}/verify', [AdminOrderController::class, 'verifyPayment'])->name('orders.payments.verify');
    Route::post('orders/{order}/payments/{payment}/reject', [AdminOrderController::class, 'rejectPayment'])->name('orders.payments.reject');
    Route::get('orders/{order}/payments/{payment}/proof', [AdminOrderController::class, 'proof'])->name('orders.payments.proof');
    Route::get('orders/{order}/invoice', [AdminOrderController::class, 'invoice'])->name('orders.invoice');

    Route::get('payments', [AdminPaymentController::class, 'index'])->name('payments.index');

    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
    Route::post('customers/{customer}/toggle-active', [CustomerController::class, 'toggleActive'])->name('customers.toggle-active');

    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/export', [ReportController::class, 'export'])->name('reports.export');

    Route::get('reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
    Route::post('reviews/{review}/approve', [AdminReviewController::class, 'approve'])->name('reviews.approve');
    Route::delete('reviews/{review}', [AdminReviewController::class, 'destroy'])->name('reviews.destroy');
});

/*
|--------------------------------------------------------------------------
| Operations endpoints
|--------------------------------------------------------------------------
*/

Route::get('/api/cron/tick', [CronController::class, 'tick'])->name('cron.tick');
Route::get('/api/health', [CronController::class, 'health'])->name('health');
