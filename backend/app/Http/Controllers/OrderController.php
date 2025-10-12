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

    public function storeWithPayment(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:10',
            'payment_method' => 'required|string|in:credit_card,bank_transfer',
            'payment_details' => 'required_if:payment_method,credit_card|array',
            'shipping_address' => 'required|array',
            'billing_address' => 'nullable|array',
            'order_notes' => 'nullable|string|max:1000',
        ]);

        // Validate shipping address
        $request->validate([
            'shipping_address.first_name' => 'required|string|max:255',
            'shipping_address.last_name' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|max:20',
            'shipping_address.address_line_1' => 'required|string|max:255',
            'shipping_address.city' => 'required|string|max:255',
            'shipping_address.state' => 'required|string|max:255',
            'shipping_address.country' => 'required|string|max:255',
        ]);

        // Validate payment details for credit card
        if ($request->payment_method === 'credit_card') {
            $request->validate([
                'payment_details.card_number' => 'required|string|min:16|max:19',
                'payment_details.expiry_month' => 'required|string|size:2',
                'payment_details.expiry_year' => 'required|string|size:4',
                'payment_details.cvv' => 'required|string|min:3|max:4',
                'payment_details.cardholder_name' => 'required|string|max:255',
            ]);
        }

        $product = Product::find($request->product_id);
        
        // Check if product is in stock
        if (!$product->in_stock) {
            return response()->json([
                'message' => 'Product is out of stock',
                'type' => 'error'
            ], 400);
        }
        
        $total = $product->price * $request->quantity;
        $shippingCost = 0; // Free shipping for now
        $taxAmount = 0; // No tax for now
        $finalTotal = $total + $shippingCost + $taxAmount;

        DB::transaction(function () use ($request, $product, $total, $shippingCost, $taxAmount, $finalTotal, &$order, &$tickets) {
            // Process payment (simplified for demo)
            $paymentStatus = 'completed';
            $transactionId = 'TXN-' . strtoupper(uniqid());
            
            if ($request->payment_method === 'credit_card') {
                // In a real implementation, you would integrate with a payment gateway here
                // For demo purposes, we'll simulate successful payment
                $cardNumber = $request->payment_details['card_number'];
                $cardBrand = $this->getCardBrand($cardNumber);
                $cardLastFour = substr(str_replace(' ', '', $cardNumber), -4);
            }

            // Create the order with payment and shipping information
            $orderData = [
                'user_id' => auth()->id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'total_price' => $finalTotal,
                'status' => 'completed',
                
                // Payment information
                'payment_method' => $request->payment_method,
                'payment_status' => $paymentStatus,
                'payment_transaction_id' => $transactionId,
                'payment_completed_at' => now(),
                
                // Shipping address
                'shipping_first_name' => $request->shipping_address['first_name'],
                'shipping_last_name' => $request->shipping_address['last_name'],
                'shipping_phone' => $request->shipping_address['phone'],
                'shipping_address_line_1' => $request->shipping_address['address_line_1'],
                'shipping_address_line_2' => $request->shipping_address['address_line_2'] ?? null,
                'shipping_city' => $request->shipping_address['city'],
                'shipping_state' => $request->shipping_address['state'],
                'shipping_postal_code' => $request->shipping_address['postal_code'] ?? null,
                'shipping_country' => $request->shipping_address['country'],
                
                // Additional information
                'order_notes' => $request->order_notes,
                'shipping_cost' => $shippingCost,
                'tax_amount' => $taxAmount,
            ];

            // Add credit card info if applicable
            if ($request->payment_method === 'credit_card') {
                $orderData['card_last_four'] = $cardLastFour ?? null;
                $orderData['card_brand'] = $cardBrand ?? null;
            }

            // Handle billing address
            if ($request->billing_address) {
                $orderData['billing_same_as_shipping'] = false;
                $orderData['billing_first_name'] = $request->billing_address['first_name'];
                $orderData['billing_last_name'] = $request->billing_address['last_name'];
                $orderData['billing_address_line_1'] = $request->billing_address['address_line_1'];
                $orderData['billing_address_line_2'] = $request->billing_address['address_line_2'] ?? null;
                $orderData['billing_city'] = $request->billing_address['city'];
                $orderData['billing_state'] = $request->billing_address['state'];
                $orderData['billing_postal_code'] = $request->billing_address['postal_code'] ?? null;
                $orderData['billing_country'] = $request->billing_address['country'];
            } else {
                $orderData['billing_same_as_shipping'] = true;
            }

            $order = Order::create($orderData);

            // Generate professional lottery tickets using the new service
            $tickets = $this->ticketService->generateTicketsForOrder($order);
        });

        return response()->json([
            'message' => 'Order completed successfully with payment! FREE lottery tickets generated.',
            'type' => 'success',
            'order' => $order->load('product'),
            'tickets' => $tickets,
            'tickets_count' => count($tickets),
            'payment_info' => [
                'transaction_id' => $order->payment_transaction_id,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
            ],
            'shipping_info' => [
                'name' => $order->shipping_first_name . ' ' . $order->shipping_last_name,
                'address' => $order->shipping_address_line_1 . ', ' . $order->shipping_city . ', ' . $order->shipping_state,
                'phone' => $order->shipping_phone,
            ],
            'batch_info' => [
                'batch_id' => $tickets[0]->batch_id ?? null,
                'verification_codes' => array_column($tickets, 'verification_code')
            ]
        ], 201);
    }

    private function getCardBrand($cardNumber): string
    {
        $number = str_replace(' ', '', $cardNumber);
        
        if (preg_match('/^4[0-9]{12}(?:[0-9]{3})?$/', $number)) {
            return 'Visa';
        } elseif (preg_match('/^5[1-5][0-9]{14}$/', $number)) {
            return 'Mastercard';
        } elseif (preg_match('/^3[47][0-9]{13}$/', $number)) {
            return 'American Express';
        } elseif (preg_match('/^6(?:011|5[0-9]{2})[0-9]{12}$/', $number)) {
            return 'Discover';
        }
        
        return 'Unknown';
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
