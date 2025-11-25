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
        Schema::create('lottery_draws', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('prize_amount', 10, 2);
            $table->decimal('ticket_price', 10, 2);
            $table->dateTime('draw_date');
            $table->enum('status', ['upcoming', 'active', 'completed', 'cancelled'])->default('upcoming');
            $table->foreignId('winner_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('winning_ticket_number')->nullable();
            $table->integer('total_tickets')->default(0);
            $table->integer('sold_tickets')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lottery_draws');
    }
};
