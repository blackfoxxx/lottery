import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, Banknote, Ticket, Lock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import StripePayment from "@/components/StripePayment";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { EmailService } from "@/lib/emailService";
import { useLoyalty } from "@/contexts/LoyaltyContext";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, getTotalPrice, getTotalLotteryTickets, clearCart } = useCart();
  const { addPoints } = useLoyalty();
  
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qicard");
  const [qicardPaymentUrl, setQicardPaymentUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Iraq",
  });

  const subtotal = getTotalPrice();
  const shipping = items.length > 0 ? 10 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    // If credit card payment, show Stripe modal
    if (paymentMethod === "credit_card") {
      setShowPaymentModal(true);
      return;
    }

    // If QiCard payment, initialize payment first
    if (paymentMethod === "qicard") {
      await initializeQiCardPayment();
      return;
    }

    // For other payment methods, process directly
    processOrder();
  }

  function handlePaymentSuccess(paymentIntentId: string) {
    setShowPaymentModal(false);
    processOrder(paymentIntentId);
  }

  async function initializeQiCardPayment() {
    setLoading(true);

    try {
      // First create the order
      const orderData = {
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shipping_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
        shipping_cost: shipping,
        tax_amount: tax,
        total_amount: total,
        payment_method: "qicard",
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        status: "pending_payment",
      };

      const orderResponse = await api.createOrder(orderData);

      if (!orderResponse.success || !orderResponse.data) {
        toast.error("Failed to create order");
        setLoading(false);
        return;
      }

      const orderId = orderResponse.data.id;

      // Initialize QiCard payment
      const paymentResponse = await fetch('http://localhost:8000/api/v1/qicard/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          amount: total,
          customer_info: {
            firstName: formData.fullName.split(' ')[0],
            lastName: formData.fullName.split(' ').slice(1).join(' ') || formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
          },
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (paymentResult.success && paymentResult.data?.formUrl) {
        // Store order ID for later retrieval
        localStorage.setItem('pending_order_id', orderId.toString());
        
        // Redirect to QiCard payment page
        toast.success("Redirecting to payment gateway...");
        window.location.href = paymentResult.data.formUrl;
      } else {
        toast.error(paymentResult.error?.description || "Failed to initialize payment");
        setLoading(false);
      }
    } catch (error) {
      console.error('QiCard payment initialization failed:', error);
      toast.error("Payment initialization failed. Please try again.");
      setLoading(false);
    }
  }

  async function processOrder(paymentIntentId?: string) {
    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shipping_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
        shipping_cost: shipping,
        tax_amount: tax,
        total_amount: total,
        payment_method: paymentMethod,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        payment_intent_id: paymentIntentId,
      };

      // Create order via backend API
      const response = await api.createOrder(orderData);

      if (response.success && response.data) {
        const orderId = response.data.id;
        
        // Generate lottery tickets via backend API
        const ticketsData = items.map(item => ({
          category: (item.product as any).lottery_category || "bronze",
          product_name: item.product.name,
          quantity: (item.product.lottery_tickets || 0) * item.quantity,
        })).filter(t => t.quantity > 0);

        let generatedTickets: any[] = [];
        
        if (ticketsData.length > 0) {
          try {
            const ticketResponse = await fetch('http://localhost:8000/api/v1/lottery/tickets/generate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                order_id: orderId,
                user_id: 1, // TODO: Get from auth context
                tickets: ticketsData,
              }),
            });

            const ticketResult = await ticketResponse.json();
            
            if (ticketResult.success && ticketResult.data) {
              generatedTickets = ticketResult.data;
              
              // Store tickets in localStorage for display
              localStorage.setItem(
                `lottery_tickets_${orderId}`,
                JSON.stringify(generatedTickets)
              );
              
              // Also save to order history
              const savedOrders = localStorage.getItem('belkhair_orders');
              const orders = savedOrders ? JSON.parse(savedOrders) : [];
              const newOrder = {
                id: orderId,
                date: new Date().toISOString(),
                total: total,
                status: 'processing',
                items: items.map(item => ({
                  name: item.product.name,
                  quantity: item.quantity,
                  price: item.product.price,
                  image: item.product.images?.[0] || '/placeholder.png',
                })),
                lotteryTickets: generatedTickets.map((ticket: any) => ({
                  ticketNumber: ticket.ticket_number,
                  category: ticket.category,
                  drawDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                })),
              };
              orders.push(newOrder);
              localStorage.setItem('belkhair_orders', JSON.stringify(orders));
              
              toast.success(`${generatedTickets.length} lottery tickets generated!`);
            }
          } catch (ticketError) {
            console.error('Failed to generate lottery tickets:', ticketError);
            toast.warning('Order placed but lottery tickets could not be generated');
          }
        }
        // Send order confirmation email via backend
        try {
          await fetch('http://localhost:8000/api/v1/orders/send-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              order_id: orderId,
              email: formData.email,
              tickets_count: generatedTickets.length,
            }),
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
        }
        
        // Award loyalty points
        const pointsEarned = Math.floor(total);
        addPoints(pointsEarned, `Purchase order #${response.data.id}`);
        
        toast.success(`Order placed successfully! You earned ${pointsEarned} loyalty points!`);
        toast.info("Check your email for confirmation.");
        clearCart();
        setLocation(`/order-confirmation/${response.data.id}`);
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Information */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+964 XXX XXX XXXX"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Street address, building, apartment"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Baghdad"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Baghdad Governorate"
                      />
                    </div>

                    <div>
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                  </div>
                </Card>

                {/* Payment Method */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                        <RadioGroupItem value="qicard" id="qicard" />
                        <Label htmlFor="qicard" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            <span className="font-medium">QiCard Payment Gateway</span>
                            <Badge variant="default" className="ml-2">Recommended</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Secure payment with QiCard - Iraq's trusted payment gateway
                          </p>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            <span className="font-medium">Credit/Debit Card</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pay securely with your card
                          </p>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-5 w-5" />
                            <span className="font-medium">PayPal</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pay with your PayPal account
                          </p>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer">
                        <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                        <Label htmlFor="cash_on_delivery" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Banknote className="h-5 w-5" />
                            <span className="font-medium">Cash on Delivery</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pay when you receive your order
                          </p>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-20">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {item.product.images && item.product.images.length > 0 ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-primary">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 mb-4 pt-4 border-t border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lottery Tickets */}
                  {getTotalLotteryTickets() > 0 && (
                    <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Lottery Tickets</span>
                        </div>
                        <span className="text-2xl font-bold text-primary">
                          {getTotalLotteryTickets()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Included with your order!
                      </p>
                    </div>
                  )}

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Your payment information is secure and encrypted
                  </p>
                </Card>
              </div>
            </div>
          </form>

          {/* Stripe Payment Modal */}
          <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Complete Payment</DialogTitle>
              </DialogHeader>
              <StripePayment
                amount={total}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPaymentModal(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
