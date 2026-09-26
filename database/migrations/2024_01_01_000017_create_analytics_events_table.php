<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_name');
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('session_id')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['event_name', 'created_at']);
            $table->index('product_id');
            $table->index('category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
