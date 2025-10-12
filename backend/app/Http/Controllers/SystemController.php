<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Ticket;
use App\Models\LotteryDraw;

class SystemController extends Controller
{
    public function health()
    {
        return response()->json([
            'status' => 'healthy',
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0',
            'environment' => app()->environment(),
            'services' => $this->checkServices()
        ]);
    }

    public function status()
    {
        try {
            $databaseStatus = $this->checkDatabase();
            $cacheStatus = $this->checkCache();
            $statistics = $this->getSystemStatistics();
            
            return response()->json([
                'status' => 'operational',
                'timestamp' => now()->toISOString(),
                'version' => '1.0.0',
                'environment' => app()->environment(),
                'database' => $databaseStatus,
                'cache' => $cacheStatus,
                'statistics' => $statistics,
                'uptime' => $this->getUptime()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'System check failed',
                'error' => app()->environment('local') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    private function checkServices()
    {
        return [
            'api' => 'active',
            'database' => $this->isDatabaseConnected() ? 'active' : 'inactive',
            'cache' => $this->isCacheWorking() ? 'active' : 'inactive',
            'lottery' => 'active'
        ];
    }

    private function checkDatabase()
    {
        try {
            DB::connection()->getPdo();
            $tableCount = DB::select("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'")[0]->count;
            
            return [
                'status' => 'connected',
                'tables' => $tableCount,
                'last_check' => now()->toISOString()
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'error' => $e->getMessage(),
                'last_check' => now()->toISOString()
            ];
        }
    }

    private function checkCache()
    {
        try {
            $testKey = 'health_check_' . time();
            Cache::put($testKey, 'test', 60);
            $retrieved = Cache::get($testKey);
            Cache::forget($testKey);
            
            return [
                'status' => $retrieved === 'test' ? 'working' : 'error',
                'last_check' => now()->toISOString()
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'error' => $e->getMessage(),
                'last_check' => now()->toISOString()
            ];
        }
    }

    private function getSystemStatistics()
    {
        try {
            return [
                'users' => [
                    'total' => User::count(),
                    'registered_today' => User::whereDate('created_at', today())->count(),
                ],
                'products' => [
                    'total' => Product::count(),
                    'in_stock' => Product::where('in_stock', true)->count(),
                ],
                'orders' => [
                    'total' => Order::count(),
                    'today' => Order::whereDate('created_at', today())->count(),
                    'total_revenue' => Order::sum('total_price'),
                    'today_revenue' => Order::whereDate('created_at', today())->sum('total_price'),
                ],
                'tickets' => [
                    'total' => Ticket::count(),
                    'purchased_today' => Ticket::whereDate('created_at', today())->count(),
                    'by_category' => [
                        'golden' => Ticket::where('category', 'golden')->count(),
                        'silver' => Ticket::where('category', 'silver')->count(),
                        'bronze' => Ticket::where('category', 'bronze')->count(),
                    ]
                ],
                'lottery_draws' => [
                    'total' => LotteryDraw::count(),
                    'upcoming' => LotteryDraw::where('draw_date', '>', now())->count(),
                    'completed' => LotteryDraw::where('draw_date', '<', now())->count(),
                ]
            ];
        } catch (\Exception $e) {
            return [
                'error' => 'Failed to retrieve statistics',
                'message' => app()->environment('local') ? $e->getMessage() : 'Database error'
            ];
        }
    }

    private function getUptime()
    {
        $uptimeFile = storage_path('app/uptime.txt');
        
        if (!file_exists($uptimeFile)) {
            file_put_contents($uptimeFile, now()->toISOString());
        }
        
        $startTime = \Carbon\Carbon::parse(file_get_contents($uptimeFile));
        $uptime = $startTime->diffInSeconds(now());
        
        return [
            'started_at' => $startTime->toISOString(),
            'seconds' => $uptime,
            'human' => $startTime->diffForHumans(now(), true)
        ];
    }

    private function isDatabaseConnected()
    {
        try {
            DB::connection()->getPdo();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function isCacheWorking()
    {
        try {
            $testKey = 'cache_test_' . time();
            Cache::put($testKey, 'test', 1);
            $result = Cache::get($testKey) === 'test';
            Cache::forget($testKey);
            return $result;
        } catch (\Exception $e) {
            return false;
        }
    }
}
