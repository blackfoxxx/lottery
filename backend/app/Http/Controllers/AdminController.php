<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use App\Models\Ticket;
use App\Models\Prize;
use App\Models\LotteryDraw;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    /**
     * Get valid category names for validation
     */
    private function getValidCategoryNames()
    {
        return Category::where('is_active', true)->pluck('name')->toArray();
    }
    // Dashboard statistics
    public function dashboard()
    {
        $stats = [
            'users' => [
                'total' => User::count(),
                'new_today' => User::whereDate('created_at', today())->count(),
                'admins' => User::where('is_admin', true)->count(),
            ],
            'products' => [
                'total' => Product::count(),
                'in_stock' => Product::where('in_stock', true)->count(),
                'out_of_stock' => Product::where('in_stock', false)->count(),
            ],
            'orders' => [
                'total' => Order::count(),
                'today' => Order::whereDate('created_at', today())->count(),
                'completed' => Order::where('status', 'completed')->count(),
                'pending' => Order::where('status', 'pending')->count(),
                'total_revenue' => Order::where('status', 'completed')->sum('total_price'),
            ],
            'tickets' => [
                'total' => Ticket::count(),
                'active' => Ticket::where('is_used', false)->count(),
                'used' => Ticket::where('is_used', true)->count(),
                'golden' => Ticket::where('category', 'golden')->count(),
                'silver' => Ticket::where('category', 'silver')->count(),
                'bronze' => Ticket::where('category', 'bronze')->count(),
            ],
            'lottery_draws' => [
                'total' => LotteryDraw::count(),
                'active' => LotteryDraw::where('status', 'active')->count(),
                'completed' => LotteryDraw::where('status', 'drawn')->count(),
                'upcoming' => LotteryDraw::where('status', 'upcoming')->count(),
            ],
            'recent_activity' => [
                'recent_orders' => Order::with('user', 'product')->latest()->take(5)->get(),
                'recent_tickets' => Ticket::with('user', 'product')->latest()->take(5)->get(),
                'recent_users' => User::latest()->take(5)->get(),
            ]
        ];

        return response()->json($stats);
    }

    // Products CRUD
    public function indexProducts()
    {
        return Product::all();
    }

    public function storeProduct(Request $request)
    {
        $validCategories = $this->getValidCategoryNames();
        
        if (empty($validCategories)) {
            return response()->json([
                'message' => 'No active categories found. Please create at least one active category first.',
                'error' => 'NO_ACTIVE_CATEGORIES'
            ], 422);
        }
        
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'ticket_count' => 'required|integer|min:0',
            'ticket_category' => 'required|string|in:' . implode(',', $validCategories),
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'image_url' => 'nullable|string|url',
        ]);

        $data = $request->except(['image']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $data['image_url'] = $this->handleImageUpload($request->file('image'));
        } elseif ($request->has('image_url') && !empty($request->image_url)) {
            $data['image_url'] = $request->image_url;
        }

        $product = Product::create($data);

        Log::info('Admin: Product created successfully', [
            'admin_user' => auth()->user()->email ?? 'unknown',
            'product_id' => $product->id, 
            'name' => $product->name, 
            'category' => $product->ticket_category
        ]);

        return response()->json($product, 201);
    }

    public function showProduct(Product $product)
    {
        return $product;
    }

    public function updateProduct(Request $request, Product $product)
    {
        $validCategories = $this->getValidCategoryNames();
        
        if (empty($validCategories)) {
            return response()->json([
                'message' => 'No active categories found. Please create at least one active category first.',
                'error' => 'NO_ACTIVE_CATEGORIES'
            ], 422);
        }
        
        try {
            $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'sometimes|required|numeric|min:0',
                'ticket_count' => 'sometimes|required|integer|min:0',
                'ticket_category' => 'sometimes|required|string|in:' . implode(',', $validCategories),
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'image_url' => 'nullable|string|url',
            ]);

            $data = $request->except(['image']);

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if it exists and is not a URL
                if ($product->image_url && !filter_var($product->image_url, FILTER_VALIDATE_URL)) {
                    $this->deleteOldImage($product->image_url);
                }
                
                $data['image_url'] = $this->handleImageUpload($request->file('image'));
            } elseif ($request->has('image_url') && !empty($request->image_url)) {
                // If updating with URL and product had a local file, delete the old file
                if ($product->image_url && !filter_var($product->image_url, FILTER_VALIDATE_URL)) {
                    $this->deleteOldImage($product->image_url);
                }
                
                $data['image_url'] = $request->image_url;
            }

            $product->update($data);

            Log::info('Admin: Product updated successfully', [
                'admin_user' => auth()->user()->email ?? 'unknown',
                'product_id' => $product->id, 
                'name' => $product->name, 
                'category' => $product->ticket_category,
                'updated_fields' => array_keys($data)
            ]);

            return response()->json($product);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Admin: Product update validation failed', [
                'admin_user' => auth()->user()->email ?? 'unknown',
                'product_id' => $product->id,
                'errors' => $e->errors(),
                'request_data' => $request->all(),
                'valid_categories' => $validCategories
            ]);
            
            return response()->json([
                'message' => 'Failed to update product. Please check your data and try again.',
                'errors' => $e->errors(),
                'valid_categories' => $validCategories
            ], 422);
        } catch (\Exception $e) {
            Log::error('Admin: Product update failed', [
                'admin_user' => auth()->user()->email ?? 'unknown',
                'product_id' => $product->id,
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'message' => 'Failed to update product. Please check your data and try again.',
                'error' => 'INTERNAL_ERROR'
            ], 500);
        }
    }

    public function destroyProduct(Product $product)
    {
        // Delete associated image file if it exists and is not a URL
        if ($product->image_url && !filter_var($product->image_url, FILTER_VALIDATE_URL)) {
            $this->deleteOldImage($product->image_url);
        }
        
        $product->delete();

        return response()->json(null, 204);
    }

    // Users CRUD
    public function indexUsers()
    {
        return User::orderBy('created_at', 'desc')->get();
    }

    public function storeUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'is_admin' => 'boolean',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'is_admin' => $request->is_admin ?? false,
        ]);

        return response()->json($user, 201);
    }

    public function showUser(User $user)
    {
        return $user;
    }

    public function updateUser(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'is_admin' => 'boolean',
        ]);

        $data = $request->only(['name', 'email', 'is_admin']);
        
        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $user->update($data);

        return response()->json($user);
    }

    public function destroyUser(User $user)
    {
        // Prevent deleting the last admin
        if ($user->is_admin && User::where('is_admin', true)->count() <= 1) {
            return response()->json(['message' => 'Cannot delete the last admin user'], 400);
        }

        $user->delete();

        return response()->json(null, 204);
    }

    // Orders CRUD
    public function indexOrders()
    {
        return Order::with('product', 'user')->get();
    }

    public function showOrder(Order $order)
    {
        return $order->load('product', 'user');
    }

    public function updateOrder(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:pending,completed,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        return response()->json($order);
    }

    public function destroyOrder(Order $order)
    {
        $order->delete();

        return response()->json(null, 204);
    }

    // Tickets CRUD
    public function indexTickets()
    {
        return Ticket::with('product', 'order', 'user')->get();
    }

    public function showTicket(Ticket $ticket)
    {
        return $ticket->load('product', 'order', 'user');
    }

    public function markTicketAsUsed(Ticket $ticket)
    {
        $ticket->update(['is_used' => true]);
        return response()->json([
            'message' => 'Ticket marked as used successfully',
            'ticket' => $ticket->load('product', 'order', 'user')
        ]);
    }

    public function destroyTicket(Ticket $ticket)
    {
        $ticket->delete();

        return response()->json(null, 204);
    }

    // Prizes CRUD
    public function indexPrizes()
    {
        return Prize::all();
    }

    public function storePrize(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|in:golden,silver,bronze',
            'value' => 'required|numeric|min:0',
            'image_url' => 'nullable|string',
        ]);

        $prize = Prize::create($request->all());

        return response()->json($prize, 201);
    }

    public function showPrize(Prize $prize)
    {
        return $prize;
    }

    public function updatePrize(Request $request, Prize $prize)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|required|string|in:golden,silver,bronze',
            'value' => 'sometimes|required|numeric|min:0',
            'image_url' => 'nullable|string',
        ]);

        $prize->update($request->all());

        return response()->json($prize);
    }

    public function destroyPrize(Prize $prize)
    {
        $prize->delete();

        return response()->json(null, 204);
    }

    // Lottery Draws CRUD
    public function indexLotteryDraws()
    {
        return LotteryDraw::with(['prize', 'category'])->get();
    }

    public function showLotteryDraw(LotteryDraw $lotteryDraw)
    {
        return $lotteryDraw->load(['prize', 'category']);
    }

    public function storeLotteryDraw(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'draw_date' => 'required|date|after:now',
            'total_tickets' => 'required|integer|min:1',
            'prize_pool' => 'required|numeric|min:0',
            'status' => 'required|string|in:upcoming,active,completed,cancelled',
        ]);

        // Set a default ticket price based on category
        $category = \App\Models\Category::find($request->category_id);
        $ticketPrice = $category ? $category->ticket_amount * 1000 : 1000; // Default price calculation

        $lotteryDrawData = $request->all();
        $lotteryDrawData['ticket_price'] = $ticketPrice;

        $lotteryDraw = LotteryDraw::create($lotteryDrawData);

        return response()->json($lotteryDraw->load(['category']), 201);
    }

    public function updateLotteryDraw(Request $request, LotteryDraw $lotteryDraw)
    {
        $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'draw_date' => 'sometimes|required|date|after:now',
            'total_tickets' => 'sometimes|required|integer|min:1',
            'prize_pool' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|string|in:upcoming,active,completed,cancelled',
            'winner_ticket_id' => 'sometimes|nullable|exists:tickets,id',
        ]);

        $lotteryDraw->update($request->all());

        return response()->json($lotteryDraw->load(['prize', 'category']));
    }

    public function destroyLotteryDraw(LotteryDraw $lotteryDraw)
    {
        $lotteryDraw->delete();

        return response()->json(null, 204);
    }

    // Perform the lottery draw
    public function performDraw(LotteryDraw $lotteryDraw)
    {
        try {
            if ($lotteryDraw->status !== 'active') {
                return response()->json(['message' => 'Draw already performed or not ready for drawing'], 400);
            }

            // Get the category name from the lottery draw's category relationship
            $category = $lotteryDraw->category;
            if (!$category) {
                return response()->json(['message' => 'Invalid category for this draw'], 400);
            }

            // Find tickets for this category that haven't been used
            $tickets = Ticket::where('category', $category->name)
                ->where('is_used', false)
                ->get();

            if ($tickets->isEmpty()) {
                return response()->json(['message' => 'No tickets available for this draw'], 400);
            }

            // Select a random winner
            $winnerTicket = $tickets->random();

            // Update the lottery draw with the winner
            $lotteryDraw->update([
                'winner_ticket_id' => $winnerTicket->id,
                'status' => 'completed',
            ]);

            // Mark the winning ticket as used
            $winnerTicket->update(['is_used' => true]);

            return response()->json([
                'message' => 'Draw performed successfully',
                'winner_ticket' => $winnerTicket->load('user'),
                'lottery_draw' => $lotteryDraw->load(['category', 'winnerTicket']),
            ]);

        } catch (\Exception $e) {
            \Log::error('Draw performance error: ' . $e->getMessage(), [
                'lottery_draw_id' => $lotteryDraw->id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json(['message' => 'An error occurred while performing the draw'], 500);
        }
    }

    // Categories CRUD
    public function indexCategories()
    {
        try {
            $categories = Category::all();
            return response()->json($categories);
        } catch (\Exception $e) {
            \Log::error('Categories index error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()], 500);
        }
    }

    public function storeCategory(Request $request)
    {
        try {
            \Log::info('Category creation request received', $request->all());
            
            $request->validate([
                'name' => 'required|string|max:255|unique:categories',
                'display_name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'ticket_amount' => 'required|integer|min:1',
                'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
                'icon' => 'required|string|max:10',
                'prize_pool' => 'required|numeric|min:0',
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            $data = $request->except(['logo']);

            // Handle logo upload
            if ($request->hasFile('logo')) {
                $data['logo_url'] = $this->handleImageUpload($request->file('logo'), 'categories');
            }

            // Set sort order
            $data['sort_order'] = Category::max('sort_order') + 1;

            $category = Category::create($data);

            \Log::info('Category created successfully', $category->toArray());
            return response()->json($category, 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Category validation failed', ['errors' => $e->errors(), 'request' => $request->all()]);
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Category creation error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString(), 'request' => $request->all()]);
            return response()->json(['message' => 'Failed to create category', 'error' => $e->getMessage()], 500);
        }
    }

    public function showCategory(Category $category)
    {
        return $category;
    }

    public function updateCategory(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:categories,name,' . $category->id,
            'display_name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'ticket_amount' => 'sometimes|required|integer|min:1',
            'color' => 'sometimes|required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'icon' => 'sometimes|required|string|max:10',
            'prize_pool' => 'sometimes|required|numeric|min:0',
            'is_active' => 'boolean',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $request->except(['logo']);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $data['logo_url'] = $this->handleImageUpload($request->file('logo'), 'categories');
        }

        $category->update($data);

        return response()->json($category);
    }

    public function destroyCategory(Category $category)
    {
        // Check if category is being used by products or tickets
        $productsCount = Product::where('ticket_category', $category->name)->count();
        $ticketsCount = Ticket::where('category', $category->name)->count();

        if ($productsCount > 0 || $ticketsCount > 0) {
            return response()->json([
                'message' => 'Cannot delete category that is being used by products or tickets'
            ], 400);
        }

        $category->delete();

        return response()->json(null, 204);
    }

    /**
     * Update lottery configuration including category prize pools and global settings
     */
    public function updateLotteryConfiguration(Request $request)
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.prize_pool' => 'required|numeric|min:0',
            'globalSettings' => 'required|array',
        ]);

        // Update category prize pools
        foreach ($request->categories as $categoryData) {
            Category::where('id', $categoryData['id'])
                ->update(['prize_pool' => $categoryData['prize_pool']]);
        }

        // You can store global settings in a settings table or config file
        // For now, we'll return success
        return response()->json([
            'message' => 'Lottery configuration updated successfully',
            'updated_categories' => count($request->categories),
            'global_settings' => $request->globalSettings
        ]);
    }

    /**
     * Handle image file upload
     */
    private function handleImageUpload($imageFile, $directory = 'products')
    {
        $fileName = time() . '_' . Str::random(10) . '.' . $imageFile->getClientOriginalExtension();
        $uploadPath = public_path("uploads/{$directory}");
        
        // Create directory if it doesn't exist
        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }
        
        $imageFile->move($uploadPath, $fileName);
        
        return "uploads/{$directory}/" . $fileName;
    }

    /**
     * Delete old image file
     */
    private function deleteOldImage($imagePath)
    {
        $fullPath = public_path($imagePath);
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }
}
