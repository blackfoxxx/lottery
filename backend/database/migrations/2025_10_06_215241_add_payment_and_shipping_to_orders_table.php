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
        Schema::table('orders', function (Blueprint $table) {
            // Payment information
            $table->string('payment_method')->nullable(); // credit_card, paypal, bank_transfer
            $table->string('payment_status')->default('pending'); // pending, completed, failed, refunded
            $table->string('payment_transaction_id')->nullable();
            $table->timestamp('payment_completed_at')->nullable();
            
            // Credit card information (encrypted)
            $table->string('card_last_four')->nullable();
            $table->string('card_brand')->nullable(); // visa, mastercard, etc.
            
            // Shipping address
            $table->string('shipping_first_name')->nullable();
            $table->string('shipping_last_name')->nullable();
            $table->string('shipping_address_line_1')->nullable();
            $table->string('shipping_address_line_2')->nullable();
            $table->string('shipping_city')->nullable();
            $table->string('shipping_state')->nullable();
            $table->string('shipping_postal_code')->nullable();
            $table->string('shipping_country')->default('Iraq');
            $table->string('shipping_phone')->nullable();
            
            // Billing address (if different from shipping)
            $table->boolean('billing_same_as_shipping')->default(true);
            $table->string('billing_first_name')->nullable();
            $table->string('billing_last_name')->nullable();
            $table->string('billing_address_line_1')->nullable();
            $table->string('billing_address_line_2')->nullable();
            $table->string('billing_city')->nullable();
            $table->string('billing_state')->nullable();
            $table->string('billing_postal_code')->nullable();
            $table->string('billing_country')->nullable();
            
            // Additional order information
            $table->text('order_notes')->nullable();
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'payment_method',
                'payment_status',
                'payment_transaction_id',
                'payment_completed_at',
                'card_last_four',
                'card_brand',
                'shipping_first_name',
                'shipping_last_name',
                'shipping_address_line_1',
                'shipping_address_line_2',
                'shipping_city',
                'shipping_state',
                'shipping_postal_code',
                'shipping_country',
                'shipping_phone',
                'billing_same_as_shipping',
                'billing_first_name',
                'billing_last_name',
                'billing_address_line_1',
                'billing_address_line_2',
                'billing_city',
                'billing_state',
                'billing_postal_code',
                'billing_country',
                'order_notes',
                'shipping_cost',
                'tax_amount'
            ]);
        });
    }
};
