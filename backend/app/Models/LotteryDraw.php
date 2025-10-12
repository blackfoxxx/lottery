<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LotteryDraw extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'draw_date',
        'total_tickets',
        'ticket_price',
        'prize_pool',
        'status',
        'winner_ticket_id',
        'prize_id',
    ];

    public function prize()
    {
        return $this->belongsTo(Prize::class);
    }

    public function winnerTicket()
    {
        return $this->belongsTo(Ticket::class, 'winner_ticket_id');
    }
}
