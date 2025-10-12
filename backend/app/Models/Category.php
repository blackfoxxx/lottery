<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'ticket_amount',
        'logo_url',
        'color',
        'icon',
        'is_active',
        'sort_order',
        'prize_pool',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'ticket_amount' => 'integer',
        'sort_order' => 'integer',
        'prize_pool' => 'decimal:2',
    ];

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'category', 'name');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'ticket_category', 'name');
    }

    public function lotteryDraws()
    {
        return $this->hasMany(LotteryDraw::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }
}
