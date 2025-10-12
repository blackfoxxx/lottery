<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'bronze',
                'display_name' => 'Bronze Category',
                'description' => 'Entry level category with basic prizes',
                'ticket_amount' => 1,
                'logo_url' => null,
                'color' => '#ea580c',
                'icon' => '🥉',
                'is_active' => true,
                'sort_order' => 3,
                'prize_pool' => 1200000,
            ],
            [
                'name' => 'silver',
                'display_name' => 'Silver Category',
                'description' => 'Mid-tier category with good prizes',
                'ticket_amount' => 5,
                'logo_url' => null,
                'color' => '#9ca3af',
                'icon' => '🥈',
                'is_active' => true,
                'sort_order' => 2,
                'prize_pool' => 2800000,
            ],
            [
                'name' => 'golden',
                'display_name' => 'Golden Category',
                'description' => 'Premium category with the highest prizes',
                'ticket_amount' => 10,
                'logo_url' => null,
                'color' => '#fbbf24',
                'icon' => '🥇',
                'is_active' => true,
                'sort_order' => 1,
                'prize_pool' => 5500000,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
