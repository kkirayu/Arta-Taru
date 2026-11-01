<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('order_item_id')->nullable()->constrained('order_items')->nullOnDelete();
            $table->string('reviewer_name');
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->timestamps();

            $table->index(['product_id', 'is_approved']);
        });

        Schema::create('daily_stats', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();
            $table->decimal('revenue', 15, 2)->default(0);
            $table->unsignedInteger('orders_count')->default(0);
            $table->unsignedInteger('paid_orders_count')->default(0);
            $table->unsignedInteger('items_sold')->default(0);
            $table->unsignedInteger('product_views')->default(0);
            $table->unsignedInteger('add_to_cart')->default(0);
            $table->unsignedInteger('checkouts')->default(0);
            $table->unsignedInteger('new_customers')->default(0);
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('daily_stats');
        Schema::dropIfExists('reviews');
    }
};
