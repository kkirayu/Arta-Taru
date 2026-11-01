<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 32)->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('guest_token', 64)->nullable();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone', 32);
            $table->string('status', 32)->default('pending_payment');
            $table->string('payment_status', 32)->default('unpaid');
            $table->string('payment_method', 32)->default('bank_transfer');
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount_total', 15, 2)->default(0);
            $table->decimal('shipping_total', 15, 2)->default(0);
            $table->decimal('unique_code', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2)->default(0);
            $table->string('shipping_method', 64)->nullable();
            $table->string('shipping_courier', 64)->nullable();
            $table->string('tracking_number', 128)->nullable();
            $table->text('notes')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index(['payment_status', 'created_at']);
            $table->index('customer_email');
            $table->index('customer_phone');
            $table->index('guest_token');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->string('product_name');
            $table->string('sku', 128);
            $table->string('variant_label')->nullable();
            $table->decimal('price', 15, 2);
            $table->unsignedInteger('quantity');
            $table->decimal('subtotal', 15, 2);
            $table->decimal('weight', 8, 2)->nullable();
            $table->timestamps();

            $table->index('order_id');
            $table->index('product_id');
        });

        Schema::create('order_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('recipient_name');
            $table->string('phone', 32);
            $table->text('address_line');
            $table->string('province');
            $table->string('city');
            $table->string('district')->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_addresses');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
