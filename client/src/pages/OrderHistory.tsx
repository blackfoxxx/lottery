import { useState, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { api, Order } from "@/lib/api";
import { Package, Ticket, ChevronRight, Loader2 } from "lucide-react";

export default function OrderHistory() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  async function loadOrders() {
    try {
      const response = await api.getOrders();
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "processing":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground">
            You need to be logged in to view your order history
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            Track your orders and view lottery tickets
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here
            </p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        Order #{order.id}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${order.total_amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.payment_status}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Address</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.customer_name}<br />
                        {typeof order.shipping_address === 'string' ? order.shipping_address : JSON.stringify(order.shipping_address)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Ticket className="h-4 w-4" />
                        Lottery Tickets
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        You earned <span className="font-bold text-primary">{order.lottery_tickets || 0}</span> lottery tickets with this order
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  {order.tracking_number && (
                    <Link href={`/track/${order.id}`}>
                      <Button variant="outline">
                        Track Shipment
                      </Button>
                    </Link>
                  )}
                  <Link href={`/order-confirmation/${order.id}`}>
                    <Button variant="outline">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
