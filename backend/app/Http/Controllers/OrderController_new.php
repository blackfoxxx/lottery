<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Services\TicketGenerationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    protected $ticketService;

    public function __construct(TicketGenerationService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    public function index()
    {
        return auth()->user()->orders()->with('product')->get();
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);
        return $order->load('product');
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $product = Product::find($request->product_id);
        
        // Check if product is in stock
        if (!$product->in_stock) {
            return response()->json([
                'message' => 'Product is out of stock',
                'type' => 'error'
            ], 400);
        }
        
        $total = $product->price * $request->quantity;

        DB::transaction(function () use ($request, $product, $total, &$order, &$tickets) {
            // Create the order
            $order = Order::create([
                'user_id' => auth()->id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'total_price' => $total,
                'status' => 'completed', // Automatically complete the order
            ]);

            // Generate professional lottery tickets using the new service
            $tickets = $this->ticketService->generateTicketsForOrder($order);
        });

        return response()->json([
            'message' => 'Purchase completed successfully! FREE lottery tickets generated.',
            'type' => 'success',
            'order' => $order->load('product'),
            'tickets' => $tickets,
            'tickets_count' => count($tickets),
            'batch_info' => [
                'batch_id' => $tickets[0]->batch_id ?? null,
                'verification_codes' => array_column($tickets, 'verification_code')
            ]
        ], 201);
    }

    public function update(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $request->validate([
            'quantity' => 'sometimes|required|integer|min:1',
        ]);

        if ($request->has('quantity')) {
            $order->total_price = $order->product->price * $request->quantity;
            $order->quantity = $request->quantity;
        }

        $order->save();

        return response()->json([
            'message' => 'Order updated successfully',
            'type' => 'success',
            'order' => $order->load('product')
        ]);
    }

    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);
        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully',
            'type' => 'success'
        ], 204);
    }
}
