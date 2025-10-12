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
        Schema::table('lottery_draws', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('id')->constrained('categories')->onDelete('cascade');
        });
        
        // Update existing lottery draws to use the first available category (Bronze)
        $firstCategory = \App\Models\Category::first();
        if ($firstCategory) {
            \App\Models\LotteryDraw::whereNull('category_id')->update(['category_id' => $firstCategory->id]);
        }
        
        // Now make the column non-nullable
        Schema::table('lottery_draws', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lottery_draws', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }
};
