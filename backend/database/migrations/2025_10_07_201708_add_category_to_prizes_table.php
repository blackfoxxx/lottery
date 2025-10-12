<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('prizes', function (Blueprint $table) {
            $table->enum('category', ['golden', 'silver', 'bronze'])->default('bronze')->after('type');
        });
        
        // Update existing prizes with default categories based on their type
        DB::table('prizes')->where('type', 'cash')->update(['category' => 'bronze']);
        DB::table('prizes')->where('type', 'product')->update(['category' => 'silver']);
        DB::table('prizes')->where('type', 'luxury')->update(['category' => 'golden']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prizes', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
