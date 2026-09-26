<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\ProductImageController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\CatalogController;
use App\Http\Controllers\Public\ProductController as PublicProductController;
use App\Http\Controllers\Public\WishlistController;
use App\Http\Controllers\Public\AnalyticsController as PublicAnalyticsController;
use App\Http\Controllers\Public\SettingController as PublicSettingController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\ContactController;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/katalog', [CatalogController::class, 'index'])->name('catalog');
Route::get('/kategori/{slug}', [CatalogController::class, 'category'])->name('catalog.category');
Route::get('/produk/{slug}', [PublicProductController::class, 'show'])->name('product.show');
Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');
Route::get('/tentang', [AboutController::class, 'index'])->name('about');
Route::get('/kontak', [ContactController::class, 'index'])->name('contact');

// SEO routes
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('sitemap');
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('robots');

// Public API
Route::post('/api/v1/analytics/events', [PublicAnalyticsController::class, 'store']);
Route::get('/api/v1/settings', [PublicSettingController::class, 'index']);

// Admin auth
Route::get('/admin/login', [AuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'login'])->name('admin.login.post');
Route::post('/admin/logout', [AuthController::class, 'logout'])->name('admin.logout')->middleware('auth');

// Admin (protected)
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Products
    Route::resource('products', ProductController::class);
    Route::post('products/{product}/toggle-publish', [ProductController::class, 'togglePublish'])->name('products.toggle-publish');
    Route::post('products/{product}/toggle-featured', [ProductController::class, 'toggleFeatured'])->name('products.toggle-featured');
    Route::post('products/{product}/duplicate', [ProductController::class, 'duplicate'])->name('products.duplicate');
    Route::post('products/{product}/restore', [ProductController::class, 'restore'])->name('products.restore');

    // Product Images
    Route::post('products/{product}/images', [ProductImageController::class, 'store'])->name('products.images.store');
    Route::delete('products/{product}/images/{image}', [ProductImageController::class, 'destroy'])->name('products.images.destroy');
    Route::post('products/{product}/images/{image}/set-primary', [ProductImageController::class, 'setPrimary'])->name('products.images.set-primary');
    Route::post('products/{product}/images/reorder', [ProductImageController::class, 'reorder'])->name('products.images.reorder');
    Route::put('products/{product}/images/{image}/alt-text', [ProductImageController::class, 'updateAltText'])->name('products.images.alt-text');

    // Categories
    Route::resource('categories', CategoryController::class);
    Route::post('categories/{category}/restore', [CategoryController::class, 'restore'])->name('categories.restore');

    // Brands
    Route::resource('brands', BrandController::class);
    Route::post('brands/{brand}/toggle-active', [BrandController::class, 'toggleActive'])->name('brands.toggle-active');

    // Banners
    Route::resource('banners', BannerController::class);
    Route::post('banners/{banner}/toggle-active', [BannerController::class, 'toggleActive'])->name('banners.toggle-active');

    // Inventory
    Route::get('inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::post('inventory/update-stock', [InventoryController::class, 'updateStock'])->name('inventory.update-stock');

    // Analytics
    Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');

    // Activity Logs
    Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');

    // Settings
    Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('settings', [SettingController::class, 'update'])->name('settings.update');
});
