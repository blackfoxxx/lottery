<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use App\Models\Ticket;
use App\Models\Prize;
use App\Models\LotteryDraw;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminController extends Controller
{
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
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'ticket_count' => 'required|integer|min:0',
            'ticket_category' => 'required|string|in:golden,silver,bronze',
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

        return response()->json($product, 201);
    }

    public function showProduct(Product $product)
    {
        return $product;
    }

    public function updateProduct(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'ticket_count' => 'sometimes|required|integer|min:0',
            'ticket_category' => 'sometimes|required|string|in:golden,silver,bronze',
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

        return response()->json($product);
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
        return User::all();
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
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $data = $request->only(['name', 'email']);
        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $user->update($data);

        return response()->json($user);
    }

    public function destroyUser(User $user)
    {
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
        return LotteryDraw::with('prize')->get();
    }

    public function showLotteryDraw(LotteryDraw $lotteryDraw)
    {
        return $lotteryDraw->load('prize');
    }

    public function storeLotteryDraw(Request $request)
    {
        $request->validate([
            'prize_id' => 'required|exists:prizes,id',
            'draw_date' => 'required|date|after:now',
            'status' => 'required|string|in:pending,drawn,cancelled',
        ]);

        $lotteryDraw = LotteryDraw::create($request->all());

        return response()->json($lotteryDraw, 201);
    }

    public function updateLotteryDraw(Request $request, LotteryDraw $lotteryDraw)
    {
        $request->validate([
            'prize_id' => 'sometimes|required|exists:prizes,id',
            'draw_date' => 'sometimes|required|date|after:now',
            'status' => 'sometimes|required|string|in:pending,drawn,cancelled',
            'winner_ticket_id' => 'nullable|exists:tickets,id',
        ]);

        $lotteryDraw->update($request->all());

        return response()->json($lotteryDraw);
    }

    public function destroyLotteryDraw(LotteryDraw $lotteryDraw)
    {
        $lotteryDraw->delete();

        return response()->json(null, 204);
    }

    // Perform the lottery draw
    public function performDraw(LotteryDraw $lotteryDraw)
    {
        if ($lotteryDraw->status !== 'active') {
            return response()->json(['message' => 'Draw already performed or not ready for drawing'], 400);
        }

        $tickets = Ticket::where('category', $lotteryDraw->prize->category)
            ->where('is_used', false)
            ->get();

        if ($tickets->isEmpty()) {
            return response()->json(['message' => 'No tickets available for this draw'], 400);
        }

        $winnerTicket = $tickets->random();

        $lotteryDraw->update([
            'winner_ticket_id' => $winnerTicket->id,
            'status' => 'completed',
        ]);

        $winnerTicket->update(['is_used' => true]);

        return response()->json([
            'message' => 'Draw performed successfully',
            'winner_ticket' => $winnerTicket,
        ]);
    }

    /**
     * Handle image file upload
     */
    private function handleImageUpload($imageFile)
    {
        $fileName = time() . '_' . Str::random(10) . '.' . $imageFile->getClientOriginalExtension();
        $imageFile->move(public_path('uploads/products'), $fileName);
        
        return 'uploads/products/' . $fileName;
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
