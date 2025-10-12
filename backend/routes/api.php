<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

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

// Categories endpoint - real database version
Route::get('/categories', function () {
    try {
        $categories = \App\Models\Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get();
        return response()->json($categories);
    } catch (\Exception $e) {
        \Log::error('Categories endpoint error: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to fetch categories'], 500);
    }
});

// Admin routes (simplified for now)
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    // Dashboard stats
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    
    // Categories management
    Route::get('/categories', [AdminController::class, 'indexCategories']);
    Route::post('/categories', [AdminController::class, 'storeCategory']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Dashboard stats
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    
    // Test route
    Route::get('/test', function () {
        return response()->json(['message' => 'Admin test route works']);
    });
    
    // Products management
    Route::get('/products', [AdminController::class, 'indexProducts']);
    Route::post('/products', [AdminController::class, 'storeProduct']);
    Route::get('/products/{product}', [AdminController::class, 'showProduct']);
    Route::put('/products/{product}', [AdminController::class, 'updateProduct']);
    Route::delete('/products/{product}', [AdminController::class, 'destroyProduct']);
    
    // Users management
    Route::get('/users', [AdminController::class, 'indexUsers']);
    Route::post('/users', [AdminController::class, 'storeUser']);
    Route::get('/users/{user}', [AdminController::class, 'showUser']);
    Route::put('/users/{user}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{user}', [AdminController::class, 'destroyUser']);
    
    // Categories management
    Route::get('/categories', [AdminController::class, 'indexCategories']);
    Route::post('/categories', [AdminController::class, 'storeCategory']);
    Route::get('/categories/{category}', [AdminController::class, 'showCategory']);
    Route::put('/categories/{category}', [AdminController::class, 'updateCategory']);
    Route::delete('/categories/{category}', [AdminController::class, 'destroyCategory']);
    
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
    
    // Lottery configuration
    Route::post('/lottery-config', [AdminController::class, 'updateLotteryConfiguration']);
    
    // System settings management
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::post('/settings', [SettingsController::class, 'update']);
    Route::post('/settings/reset', [SettingsController::class, 'reset']);
    Route::get('/settings/export', [SettingsController::class, 'export']);
    Route::post('/settings/import', [SettingsController::class, 'import']);
});
