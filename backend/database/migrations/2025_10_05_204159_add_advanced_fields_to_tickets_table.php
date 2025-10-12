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
        Schema::table('tickets', function (Blueprint $table) {
            $table->timestamp('generated_at')->nullable()->after('is_used');
            $table->timestamp('expires_at')->nullable()->after('generated_at');
            $table->string('batch_id')->nullable()->after('expires_at');
            $table->string('verification_code', 8)->nullable()->after('batch_id');
            
            // Add indexes for better performance
            $table->index('batch_id');
            $table->index('verification_code');
            $table->index(['category', 'is_used']);
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex(['tickets_batch_id_index']);
            $table->dropIndex(['tickets_verification_code_index']);
            $table->dropIndex(['tickets_category_is_used_index']);
            $table->dropIndex(['tickets_expires_at_index']);
            
            $table->dropColumn(['generated_at', 'expires_at', 'batch_id', 'verification_code']);
        });
    }
};
