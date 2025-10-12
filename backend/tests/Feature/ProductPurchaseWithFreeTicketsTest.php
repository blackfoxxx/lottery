<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Ticket;
use Laravel\Sanctum\Sanctum;

class ProductPurchaseWithFreeTicketsTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        
        // Create a test user
        $this->user = User::factory()->create();
        
        // Create test products with smaller ticket counts for testing
        $this->goldProduct = Product::create([
            'name' => 'iPhone 15 Pro',
            'description' => 'Latest iPhone',
            'price' => 1500000,
            'ticket_category' => 'golden',
            'ticket_count' => 1, // 1 ticket per product for easier testing
            'in_stock' => true,
        ]);
        
        $this->silverProduct = Product::create([
            'name' => 'PlayStation 5',
            'description' => 'Gaming console',
            'price' => 800000,
            'ticket_category' => 'silver',
            'ticket_count' => 1, // 1 ticket per product for easier testing
            'in_stock' => true,
        ]);
        
        $this->bronzeProduct = Product::create([
            'name' => 'AirPods Pro',
            'description' => 'Wireless earbuds',
            'price' => 300000,
            'ticket_category' => 'bronze',
            'ticket_count' => 1, // 1 ticket per product for easier testing
            'in_stock' => true,
        ]);
    }

    public function test_user_can_purchase_golden_category_product_and_get_free_tickets()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/orders', [
            'product_id' => $this->goldProduct->id,
            'quantity' => 2
        ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'order' => ['id', 'total_price', 'product'],
                    'tickets' => [
                        '*' => ['id', 'ticket_number', 'category']
                    ]
                ]);

        // Check that tickets were created automatically (free)
        $this->assertDatabaseCount('tickets', 2);
        $this->assertDatabaseCount('orders', 1);

        // Check ticket numbers have correct prefix (new professional format)
        $tickets = Ticket::all();
        foreach ($tickets as $ticket) {
            $this->assertStringStartsWith('GLT-', $ticket->ticket_number);
            $this->assertEquals('golden', $ticket->category);
        }
    }

    public function test_user_can_purchase_silver_category_product_and_get_free_tickets()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/orders', [
            'product_id' => $this->silverProduct->id,
            'quantity' => 1
        ]);

        $response->assertStatus(201);

        $ticket = Ticket::first();
        $this->assertStringStartsWith('SLT-', $ticket->ticket_number);
        $this->assertEquals('silver', $ticket->category);
    }

    public function test_user_can_purchase_bronze_category_product_and_get_free_tickets()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/orders', [
            'product_id' => $this->bronzeProduct->id,
            'quantity' => 1
        ]);

        $response->assertStatus(201);

        $ticket = Ticket::first();
        $this->assertStringStartsWith('BLT-', $ticket->ticket_number);
        $this->assertEquals('bronze', $ticket->category);
    }

    public function test_product_purchase_requires_authentication()
    {
        $response = $this->postJson('/api/orders', [
            'product_id' => $this->goldProduct->id,
            'quantity' => 1
        ]);

        $response->assertStatus(401);
    }

    public function test_product_purchase_validates_required_fields()
    {
        Sanctum::actingAs($this->user);

        // Missing product_id
        $response = $this->postJson('/api/orders', [
            'quantity' => 1
        ]);
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['product_id']);

        // Missing quantity
        $response = $this->postJson('/api/orders', [
            'product_id' => $this->goldProduct->id
        ]);
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['quantity']);
    }

    public function test_product_purchase_validates_quantity_limits()
    {
        Sanctum::actingAs($this->user);

        // Quantity too low
        $response = $this->postJson('/api/orders', [
            'product_id' => $this->goldProduct->id,
            'quantity' => 0
        ]);
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['quantity']);

        // Quantity too high
        $response = $this->postJson('/api/orders', [
            'product_id' => $this->goldProduct->id,
            'quantity' => 15
        ]);
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['quantity']);
    }

    public function test_product_purchase_fails_for_out_of_stock_product()
    {
        $this->goldProduct->update(['in_stock' => false]);
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/orders', [
            'product_id' => $this->goldProduct->id,
            'quantity' => 1
        ]);

        $response->assertStatus(400)
                ->assertJson(['message' => 'Product is out of stock']);
    }

    public function test_product_purchase_calculates_correct_total_price()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/orders', [
            'product_id' => $this->goldProduct->id,
            'quantity' => 3
        ]);

        $response->assertStatus(201);

        $order = Order::first();
        $expectedTotal = $this->goldProduct->price * 3;
        $this->assertEquals($expectedTotal, $order->total_price);
    }

    public function test_user_can_view_their_tickets()
    {
        Sanctum::actingAs($this->user);

        // Purchase a product to get free tickets
        $this->postJson('/api/orders', [
            'product_id' => $this->goldProduct->id,
            'quantity' => 2
        ]);

        $response = $this->getJson('/api/tickets');

        $response->assertStatus(200)
                ->assertJsonCount(2)
                ->assertJsonStructure([
                    '*' => [
                        'id', 'ticket_number', 'category', 'is_used',
                        'product' => ['id', 'name', 'price'],
                        'order' => ['id', 'total_price', 'status']
                    ]
                ]);
    }

    public function test_ticket_numbers_are_unique()
    {
        Sanctum::actingAs($this->user);

        // Purchase multiple products to get free tickets
        $this->postJson('/api/orders', [
            'product_id' => $this->goldProduct->id,
            'quantity' => 5
        ]);

        $tickets = Ticket::all();
        $ticketNumbers = $tickets->pluck('ticket_number')->toArray();
        
        // Check all ticket numbers are unique
        $this->assertEquals(count($ticketNumbers), count(array_unique($ticketNumbers)));
    }
}
