# Belkhair Laravel Backend - Complete Implementation Guide

This guide contains all the code needed to complete the Laravel backend implementation.

## ✅ Already Completed

- ✅ Laravel 11 project structure
- ✅ JWT authentication installed and configured
- ✅ All database migrations with complete schemas
- ✅ All models created
- ✅ All controllers created
- ✅ User model updated with JWT and relationships

## 📋 Remaining Tasks

### 1. Update All Models

Each model needs fillable fields, relationships, and casts. See `UPDATE_MODELS_GUIDE.md` for details.

### 2. Implement AuthController

Location: `app/Http/Controllers/Api/AuthController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = auth()->login($user);

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'user' => auth()->user(),
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh()
    {
        return response()->json([
            'access_token' => auth()->refresh(),
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}
```

### 3. Implement ProductController

Location: `app/Http/Controllers/Api/ProductController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('is_featured')) {
            $query->where('is_featured', $request->is_featured);
        }

        $products = $query->where('is_active', true)->paginate(20);

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);
        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:products',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'image' => 'required|string',
            'stock' => 'required|integer|min:0',
            'sku' => 'required|string|unique:products',
        ]);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
```

### 4. Implement OrderController

Location: `app/Http/Controllers/Api/OrderController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
        $orders = auth()->user()->orders()->with('items')->latest()->paginate(10);
        return response()->json($orders);
    }

    public function show($id)
    {
        $order = auth()->user()->orders()->with(['items.product', 'shippingAddress', 'billingAddress'])->findOrFail($id);
        return response()->json($order);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
            'shipping_address_id' => 'required|exists:addresses,id',
            'billing_address_id' => 'nullable|exists:addresses,id',
            'notes' => 'nullable|string',
        ]);

        $subtotal = 0;
        $orderItems = [];

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $price = $product->discount_price ?? $product->price;
            $itemSubtotal = $price * $item['quantity'];
            $subtotal += $itemSubtotal;

            $orderItems[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_image' => $product->image,
                'price' => $price,
                'quantity' => $item['quantity'],
                'subtotal' => $itemSubtotal,
            ];
        }

        $tax = $subtotal * 0.1; // 10% tax
        $shipping = 5.00; // Flat shipping
        $total = $subtotal + $tax + $shipping;
        $lotteryTickets = floor($total / 10); // 1 ticket per $10

        $order = Order::create([
            'user_id' => auth()->id(),
            'order_number' => 'ORD-' . strtoupper(Str::random(10)),
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'payment_method' => $validated['payment_method'],
            'shipping_address_id' => $validated['shipping_address_id'],
            'billing_address_id' => $validated['billing_address_id'] ?? $validated['shipping_address_id'],
            'notes' => $validated['notes'] ?? null,
            'lottery_tickets_earned' => $lotteryTickets,
            'payment_status' => 'paid',
        ]);

        foreach ($orderItems as $item) {
            $order->items()->create($item);
        }

        return response()->json($order->load('items'), 201);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'sometimes|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'sometimes|in:pending,paid,failed,refunded',
        ]);

        $order->update($validated);

        return response()->json($order);
    }
}
```

### 5. Implement LotteryController

Location: `app/Http/Controllers/Api/LotteryController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LotteryDraw;
use App\Models\LotteryTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LotteryController extends Controller
{
    public function draws()
    {
        $draws = LotteryDraw::where('status', '!=', 'cancelled')->latest()->paginate(10);
        return response()->json($draws);
    }

    public function purchase(Request $request)
    {
        $validated = $request->validate([
            'draw_id' => 'required|exists:lottery_draws,id',
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        $draw = LotteryDraw::findOrFail($validated['draw_id']);

        if ($draw->status !== 'active') {
            return response()->json(['error' => 'Draw is not active'], 400);
        }

        $tickets = [];
        for ($i = 0; $i < $validated['quantity']; $i++) {
            $tickets[] = LotteryTicket::create([
                'user_id' => auth()->id(),
                'draw_id' => $draw->id,
                'ticket_number' => 'TKT-' . strtoupper(Str::random(10)),
                'purchase_date' => now(),
            ]);
        }

        $draw->increment('sold_tickets', $validated['quantity']);

        return response()->json([
            'message' => 'Tickets purchased successfully',
            'tickets' => $tickets
        ], 201);
    }

    public function myTickets()
    {
        $tickets = auth()->user()->lotteryTickets()->with('draw')->latest()->paginate(20);
        return response()->json($tickets);
    }

    public function results()
    {
        $results = LotteryDraw::where('status', 'completed')
            ->with('winner')
            ->latest('draw_date')
            ->paginate(10);

        return response()->json($results);
    }
}
```

### 6. Implement PaymentController

Location: `app/Http/Controllers/Api/PaymentController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use App\Models\Transaction;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function paymentMethods()
    {
        $methods = auth()->user()->paymentMethods()->get();
        return response()->json($methods);
    }

    public function storePaymentMethod(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:card,paypal,wallet',
            'card_last4' => 'required_if:type,card|string|size:4',
            'card_brand' => 'required_if:type,card|string',
            'card_exp_month' => 'required_if:type,card|string|size:2',
            'card_exp_year' => 'required_if:type,card|string|size:4',
            'paypal_email' => 'required_if:type,paypal|email',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            auth()->user()->paymentMethods()->update(['is_default' => false]);
        }

        $method = auth()->user()->paymentMethods()->create($validated);

        return response()->json($method, 201);
    }

    public function deletePaymentMethod($id)
    {
        $method = auth()->user()->paymentMethods()->findOrFail($id);
        $method->delete();

        return response()->json(['message' => 'Payment method deleted']);
    }

    public function transactions()
    {
        $transactions = auth()->user()->transactions()
            ->with(['paymentMethod', 'order'])
            ->latest()
            ->paginate(20);

        return response()->json($transactions);
    }

    public function topup(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:10|max:1000',
            'payment_method_id' => 'required|exists:payment_methods,id',
        ]);

        $transaction = Transaction::create([
            'user_id' => auth()->id(),
            'type' => 'topup',
            'amount' => $validated['amount'],
            'status' => 'completed',
            'payment_method_id' => $validated['payment_method_id'],
            'description' => 'Wallet top-up',
            'reference_number' => 'TXN-' . strtoupper(\Illuminate\Support\Str::random(10)),
        ]);

        auth()->user()->increment('wallet_balance', $validated['amount']);

        return response()->json($transaction, 201);
    }
}
```

### 7. Implement AddressController

Location: `app/Http/Controllers/Api/AddressController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = auth()->user()->addresses()->get();
        return response()->json($addresses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'zip_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'type' => 'required|in:shipping,billing,both',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            auth()->user()->addresses()->update(['is_default' => false]);
        }

        $address = auth()->user()->addresses()->create($validated);

        return response()->json($address, 201);
    }

    public function show($id)
    {
        $address = auth()->user()->addresses()->findOrFail($id);
        return response()->json($address);
    }

    public function update(Request $request, $id)
    {
        $address = auth()->user()->addresses()->findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'address_line1' => 'sometimes|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'sometimes|string|max:100',
            'state' => 'sometimes|string|max:100',
            'zip_code' => 'sometimes|string|max:20',
            'country' => 'sometimes|string|max:100',
            'type' => 'sometimes|in:shipping,billing,both',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            auth()->user()->addresses()->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json($address);
    }

    public function destroy($id)
    {
        $address = auth()->user()->addresses()->findOrFail($id);
        $address->delete();

        return response()->json(['message' => 'Address deleted successfully']);
    }
}
```

### 8. Configure API Routes

Location: `routes/api.php`

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\LotteryController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AddressController;

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Products (public)
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);

    // Lottery draws (public)
    Route::get('/lottery/draws', [LotteryController::class, 'draws']);
    Route::get('/lottery/results', [LotteryController::class, 'results']);
});

// Protected routes
Route::prefix('v1')->middleware('auth:api')->group(function () {
    // Authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Products (admin)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);

    // Lottery
    Route::post('/lottery/purchase', [LotteryController::class, 'purchase']);
    Route::get('/lottery/tickets', [LotteryController::class, 'myTickets']);

    // Payment Methods
    Route::get('/payment-methods', [PaymentController::class, 'paymentMethods']);
    Route::post('/payment-methods', [PaymentController::class, 'storePaymentMethod']);
    Route::delete('/payment-methods/{id}', [PaymentController::class, 'deletePaymentMethod']);

    // Transactions
    Route::get('/transactions', [PaymentController::class, 'transactions']);
    Route::post('/wallet/topup', [PaymentController::class, 'topup']);

    // Addresses
    Route::apiResource('addresses', AddressController::class);
});
```

### 9. Configure JWT in config/auth.php

Add to the `guards` array:

```php
'api' => [
    'driver' => 'jwt',
    'provider' => 'users',
],
```

### 10. Create Database Seeder

Location: `database/seeders/DatabaseSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\LotteryDraw;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@belkhair.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'wallet_balance' => 1000,
        ]);

        // Create demo user
        User::create([
            'name' => 'Demo User',
            'email' => 'demo@belkhair.com',
            'password' => Hash::make('demo123'),
            'wallet_balance' => 500,
        ]);

        // Create categories
        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics'],
            ['name' => 'Fashion', 'slug' => 'fashion'],
            ['name' => 'Home & Garden', 'slug' => 'home-garden'],
            ['name' => 'Sports', 'slug' => 'sports'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Create sample products
        for ($i = 1; $i <= 20; $i++) {
            Product::create([
                'category_id' => rand(1, 4),
                'name' => 'Product ' . $i,
                'slug' => 'product-' . $i,
                'description' => 'Description for product ' . $i,
                'price' => rand(10, 500),
                'image' => 'https://via.placeholder.com/400',
                'stock' => rand(10, 100),
                'sku' => 'SKU-' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'rating' => rand(30, 50) / 10,
                'is_featured' => rand(0, 1),
            ]);
        }

        // Create lottery draw
        LotteryDraw::create([
            'name' => 'Grand Prize Draw',
            'description' => 'Win $10,000!',
            'prize_amount' => 10000,
            'ticket_price' => 5,
            'draw_date' => now()->addDays(30),
            'status' => 'active',
            'total_tickets' => 10000,
        ]);
    }
}
```

## 🚀 Running the Backend

1. **Configure database**
   ```bash
   # Edit .env file with your database credentials
   ```

2. **Run migrations**
   ```bash
   php artisan migrate
   ```

3. **Seed database**
   ```bash
   php artisan db:seed
   ```

4. **Start server**
   ```bash
   php artisan serve
   ```

5. **Test API**
   ```bash
   # Login
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@belkhair.com","password":"demo123"}'

   # Get products
   curl http://localhost:8000/api/v1/products
   ```

## 📝 Next Steps

1. Update all models with fillable fields and relationships (see UPDATE_MODELS_GUIDE.md)
2. Copy all controller code from this guide to respective files
3. Update routes/api.php with the provided routes
4. Configure JWT in config/auth.php
5. Update database seeder
6. Run migrations and seeders
7. Test all endpoints

## 🔒 Security Notes

- Never commit `.env` file
- Use strong JWT secret
- Implement rate limiting
- Add CORS configuration for production
- Use HTTPS in production
- Validate all inputs
- Sanitize outputs

---

**The backend foundation is complete. Follow this guide to finish the implementation!**
