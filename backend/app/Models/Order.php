<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'total_price',
        'status',
        // Payment information
        'payment_method',
        'payment_status',
        'payment_transaction_id',
        'payment_completed_at',
        'card_last_four',
        'card_brand',
        // Shipping address
        'shipping_first_name',
        'shipping_last_name',
        'shipping_address_line_1',
        'shipping_address_line_2',
        'shipping_city',
        'shipping_state',
        'shipping_postal_code',
        'shipping_country',
        'shipping_phone',
        // Billing address
        'billing_same_as_shipping',
        'billing_first_name',
        'billing_last_name',
        'billing_address_line_1',
        'billing_address_line_2',
        'billing_city',
        'billing_state',
        'billing_postal_code',
        'billing_country',
        // Additional order information
        'order_notes',
        'shipping_cost',
        'tax_amount',
    ];

    protected $casts = [
        'billing_same_as_shipping' => 'boolean',
        'payment_completed_at' => 'datetime',
        'shipping_cost' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
