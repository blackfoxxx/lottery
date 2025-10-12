<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Prize;
use App\Models\LotteryDraw;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test users
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'is_admin' => true,
        ]);

        // Create sample products
        $products = [
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'Latest iPhone with advanced camera system',
                'price' => 1500000, // 1.5M IQD
                'ticket_count' => 100,
                'ticket_category' => 'golden',
                'in_stock' => true,
            ],
            [
                'name' => 'Samsung Galaxy S24',
                'description' => 'Premium Android smartphone with AI features',
                'price' => 1200000, // 1.2M IQD
                'ticket_count' => 80,
                'ticket_category' => 'golden',
                'in_stock' => true,
            ],
            [
                'name' => 'MacBook Air M3',
                'description' => 'Lightweight laptop with M3 chip',
                'price' => 2000000, // 2M IQD
                'ticket_count' => 150,
                'ticket_category' => 'golden',
                'in_stock' => true,
            ],
            [
                'name' => 'Sony PlayStation 5',
                'description' => 'Next-gen gaming console',
                'price' => 800000, // 800K IQD
                'ticket_count' => 60,
                'ticket_category' => 'silver',
                'in_stock' => true,
            ],
            [
                'name' => 'Apple Watch Series 9',
                'description' => 'Advanced smartwatch with health monitoring',
                'price' => 600000, // 600K IQD
                'ticket_count' => 40,
                'ticket_category' => 'silver',
                'in_stock' => true,
            ],
            [
                'name' => 'AirPods Pro 2',
                'description' => 'Wireless earbuds with noise cancellation',
                'price' => 300000, // 300K IQD
                'ticket_count' => 30,
                'ticket_category' => 'bronze',
                'in_stock' => true,
            ],
            [
                'name' => 'iPad Air',
                'description' => 'Versatile tablet for work and entertainment',
                'price' => 900000, // 900K IQD
                'ticket_count' => 70,
                'ticket_category' => 'silver',
                'in_stock' => true,
            ],
            [
                'name' => 'Gaming Monitor 27"',
                'description' => '4K gaming monitor with high refresh rate',
                'price' => 500000, // 500K IQD
                'ticket_count' => 35,
                'ticket_category' => 'bronze',
                'in_stock' => true,
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }

        // Create sample prizes
        $prizes = [
            [
                'name' => 'Daily Cash Prize',
                'description' => 'Daily cash prize for lucky winners',
                'value' => 100000, // 100K IQD
                'type' => 'cash',
            ],
            [
                'name' => 'Weekly Electronics Bundle',
                'description' => 'Bundle of premium electronics',
                'value' => 500000, // 500K IQD
                'type' => 'product',
            ],
            [
                'name' => 'Monthly Grand Prize',
                'description' => 'Monthly grand prize - luxury item',
                'value' => 2000000, // 2M IQD
                'type' => 'luxury',
            ],
        ];

        foreach ($prizes as $prizeData) {
            Prize::create($prizeData);
        }

        // Create sample lottery draws
        $draws = [
            [
                'name' => 'Daily Draw',
                'description' => 'Daily lottery draw at 8 PM',
                'draw_date' => now()->addDay(),
                'total_tickets' => 1000,
                'ticket_price' => 5000, // 5K IQD per ticket
                'prize_pool' => 500000, // 500K IQD
                'status' => 'active',
            ],
            [
                'name' => 'Weekly Mega Draw',
                'description' => 'Weekly mega lottery with big prizes',
                'draw_date' => now()->addWeek(),
                'total_tickets' => 5000,
                'ticket_price' => 10000, // 10K IQD per ticket
                'prize_pool' => 2500000, // 2.5M IQD
                'status' => 'upcoming',
            ],
        ];

        foreach ($draws as $drawData) {
            LotteryDraw::create($drawData);
        }
    }
}
