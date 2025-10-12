<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // bronze, silver, golden, custom categories
            $table->string('display_name'); // Human readable name
            $table->text('description')->nullable();
            $table->integer('ticket_amount')->default(1); // Number of tickets for this category
            $table->string('logo_url')->nullable(); // URL to category logo/icon
            $table->string('color')->default('#2563eb'); // Category color
            $table->string('icon')->default('🎟️'); // Emoji icon
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->decimal('prize_pool', 15, 2)->default(0); // Prize pool for this category
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
