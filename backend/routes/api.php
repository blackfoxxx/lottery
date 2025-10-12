<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\PrizeController;
use App\Http\Controllers\LotteryDrawController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\SettingsController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0',
        'database' => 'connected',
        'services' => [
            'api' => 'active',
            'lottery' => 'active'
        ]
    ]);
});

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Product routes
Route::apiResource('products', ProductController::class);

// Order routes (orders automatically generate FREE lottery tickets)
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('orders', OrderController::class);
    Route::post('/orders/with-payment', [OrderController::class, 'storeWithPayment']);
});

// Ticket routes (view only - tickets are generated with purchases)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::get('/tickets/{ticket}', [TicketController::class, 'show']);
});

// Prize routes
Route::get('/prizes', [PrizeController::class, 'index']);
Route::get('/prizes/{prize}', [PrizeController::class, 'show']);

// Lottery draw routes
Route::get('/lottery-draws', [LotteryDrawController::class, 'index']);
Route::get('/lottery-draws/{draw}', [LotteryDrawController::class, 'show']);
Route::get('/lottery-draws/{draw}/countdown', [LotteryDrawController::class, 'countdown']);

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Dashboard stats
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    
    // Products management
    Route::get('/products', [AdminController::class, 'indexProducts']);
    Route::post('/products', [AdminController::class, 'storeProduct']);
    Route::get('/products/{product}', [AdminController::class, 'showProduct']);
    Route::put('/products/{product}', [AdminController::class, 'updateProduct']);
    Route::delete('/products/{product}', [AdminController::class, 'destroyProduct']);
    
    // Users management
    Route::get('/users', [AdminController::class, 'indexUsers']);
    Route::get('/users/{user}', [AdminController::class, 'showUser']);
    Route::put('/users/{user}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{user}', [AdminController::class, 'destroyUser']);
    
    // Orders management
    Route::get('/orders', [AdminController::class, 'indexOrders']);
    Route::get('/orders/{order}', [AdminController::class, 'showOrder']);
    Route::put('/orders/{order}', [AdminController::class, 'updateOrder']);
    Route::delete('/orders/{order}', [AdminController::class, 'destroyOrder']);
    
    // Tickets management
    Route::get('/tickets', [AdminController::class, 'indexTickets']);
    Route::get('/tickets/{ticket}', [AdminController::class, 'showTicket']);
    Route::put('/tickets/{ticket}/mark-used', [AdminController::class, 'markTicketAsUsed']);
    Route::delete('/tickets/{ticket}', [AdminController::class, 'destroyTicket']);
    
    // Prizes management
    Route::get('/prizes', [AdminController::class, 'indexPrizes']);
    Route::post('/prizes', [AdminController::class, 'storePrize']);
    Route::get('/prizes/{prize}', [AdminController::class, 'showPrize']);
    Route::put('/prizes/{prize}', [AdminController::class, 'updatePrize']);
    Route::delete('/prizes/{prize}', [AdminController::class, 'destroyPrize']);
    
    // Lottery draws management
    Route::get('/lottery-draws', [AdminController::class, 'indexLotteryDraws']);
    Route::post('/lottery-draws', [AdminController::class, 'storeLotteryDraw']);
    Route::get('/lottery-draws/{lotteryDraw}', [AdminController::class, 'showLotteryDraw']);
    Route::put('/lottery-draws/{lotteryDraw}', [AdminController::class, 'updateLotteryDraw']);
    Route::delete('/lottery-draws/{lotteryDraw}', [AdminController::class, 'destroyLotteryDraw']);
    Route::post('/lottery-draws/{lotteryDraw}/draw', [AdminController::class, 'performDraw']);
    
    // System settings management
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::post('/settings', [SettingsController::class, 'update']);
    Route::post('/settings/reset', [SettingsController::class, 'reset']);
    Route::get('/settings/export', [SettingsController::class, 'export']);
    Route::post('/settings/import', [SettingsController::class, 'import']);
});
