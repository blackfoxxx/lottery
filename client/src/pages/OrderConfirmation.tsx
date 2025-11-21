import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Ticket, ArrowRight, Loader2 } from "lucide-react";
import { api, Order } from "@/lib/api";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order-confirmation/:id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      loadOrder(parseInt(params.id));
    }
  }, [params?.id]);

  async function loadOrder(id: number) {
    try {
      const response = await api.getOrder(id);
      if (response.success && response.data) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error("Failed to load order:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find this order
            </p>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground text-lg">
              Thank you for your purchase, {order.customer_name}
            </p>
          </div>

          {/* Order Details */}
          <Card className="p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Order Number</h3>
                <p className="text-2xl font-bold text-primary">#{order.id}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Order Status</h3>
                <Badge variant="secondary" className="text-sm">
                  {order.status}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border">
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <p className="text-muted-foreground">{order.customer_email}</p>
                <p className="text-muted-foreground">{order.customer_phone}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-muted-foreground">{order.shipping_address}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border">
              <div>
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p className="text-muted-foreground capitalize">
                  {order.payment_method.replace(/_/g, ' ')}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Payment Status</h3>
                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                  {order.payment_status}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  ${(order.total_amount - order.shipping_cost - order.tax_amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">${order.shipping_cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${order.tax_amount.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Lottery Tickets Info */}
          <Card className="p-6 mb-6 bg-primary/10 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Ticket className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">Lottery Tickets Included!</h3>
                <p className="text-muted-foreground mb-3">
                  Your order includes lottery tickets. Check your email for ticket details and draw information.
                </p>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Tickets will be sent to: {order.customer_email}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-6">
            <h3 className="font-bold mb-4">What's Next?</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                <p>You'll receive an order confirmation email at {order.customer_email}</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                <p>We'll send you shipping updates as your order is processed</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                <p>Your lottery tickets will be activated and you'll be entered into upcoming draws</p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button asChild className="flex-1">
              <Link href="/products">
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
