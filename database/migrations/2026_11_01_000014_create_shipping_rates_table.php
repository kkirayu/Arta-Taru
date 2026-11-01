<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipping_rates', function (Blueprint $table) {
            $table->id();
            $table->string('province');
            $table->string('city')->nullable();
            $table->string('district')->nullable();
            $table->decimal('cost', 15, 2)->default(0);
            $table->decimal('free_shipping_min_total', 15, 2)->nullable();
            $table->unsignedSmallInteger('eta_min_days')->default(1);
            $table->unsignedSmallInteger('eta_max_days')->default(3);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['province', 'city']);
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipping_rates');
    }
};
