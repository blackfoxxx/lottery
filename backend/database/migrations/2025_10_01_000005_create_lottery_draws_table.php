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
            $table->dateTime('draw_date');
            $table->integer('total_tickets');
            $table->decimal('ticket_price', 10, 2);
            $table->decimal('prize_pool', 10, 2);
            $table->enum('status', ['active', 'upcoming', 'completed', 'cancelled'])->default('upcoming');
            $table->foreignId('winner_ticket_id')->nullable()->constrained('tickets')->onDelete('set null');
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
