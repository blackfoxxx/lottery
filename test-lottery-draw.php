<?php
require_once 'backend/vendor/autoload.php';

$app = require_once 'backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\LotteryDraw;
use App\Models\Ticket;
use App\Models\Prize;

echo "=== LOTTERY DRAW FUNCTIONALITY TEST ===\n\n";

// Check if admin user exists
$admin = User::where('email', 'admin@test.com')->first();
if (!$admin) {
    $admin = User::create([
        'name' => 'Test Admin',
        'email' => 'admin@test.com',
        'password' => bcrypt('password'),
        'is_admin' => true
    ]);
    echo "✅ Admin user created\n";
} else {
    echo "✅ Admin user found\n";
}

// Check lottery draws with prizes
echo "\n📊 LOTTERY DRAWS STATUS:\n";
$draws = LotteryDraw::with('prize')->get();
foreach ($draws as $draw) {
    echo "- Draw ID {$draw->id}: {$draw->name} | Status: {$draw->status} | Prize: {$draw->prize->name} ({$draw->prize->category})\n";
}

// Check tickets by category
echo "\n🎫 TICKETS BY CATEGORY:\n";
$ticketCategories = ['golden', 'silver', 'bronze'];
foreach ($ticketCategories as $category) {
    $count = Ticket::where('category', $category)->where('is_used', false)->count();
    echo "- {$category}: {$count} unused tickets\n";
}

// Test lottery draw for the first active draw
$activeDraw = LotteryDraw::where('status', 'active')->first();
if ($activeDraw) {
    echo "\n🎯 TESTING LOTTERY DRAW FOR: {$activeDraw->name}\n";
    
    // Check if there are tickets for this draw's prize category
    $availableTickets = Ticket::where('category', $activeDraw->prize->category)
        ->where('is_used', false)
        ->count();
    
    echo "- Prize category: {$activeDraw->prize->category}\n";
    echo "- Available tickets: {$availableTickets}\n";
    
    if ($availableTickets > 0) {
        echo "- Status: Ready for drawing! ✅\n";
        
        // Simulate the draw logic
        $tickets = Ticket::where('category', $activeDraw->prize->category)
            ->where('is_used', false)
            ->get();
        $winnerTicket = $tickets->random();
        
        echo "- Simulated winner ticket: {$winnerTicket->ticket_number}\n";
        echo "- Draw would complete successfully! 🎉\n";
    } else {
        echo "- Status: No tickets available for this category ❌\n";
    }
} else {
    echo "\n❌ No active lottery draws found\n";
}

echo "\n=== TEST COMPLETE ===\n";
