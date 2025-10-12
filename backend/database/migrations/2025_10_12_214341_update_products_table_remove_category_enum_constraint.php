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
        Schema::table('products', function (Blueprint $table) {
            // Change ticket_category from enum to string to support dynamic categories
            $table->string('ticket_category')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Revert back to enum (only if needed for rollback)
            $table->enum('ticket_category', ['golden', 'silver', 'bronze'])->change();
        });
    }
};
