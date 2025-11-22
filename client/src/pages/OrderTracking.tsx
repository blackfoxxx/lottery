import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import ShipmentTimeline from "@/components/ShipmentTimeline";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, MapPin, Phone, Mail } from "lucide-react";
import { api, Order } from "@/lib/api";
import { toast } from "sonner";

export default function OrderTracking() {
  const [, trackParams] = useRoute("/track/:orderId");
  const [, orderParams] = useRoute("/orders/:orderId");
  const params = trackParams || orderParams;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.orderId) {
      loadOrder(parseInt(params.orderId));
    }
  }, [params?.orderId]);

  async function loadOrder(orderId: number) {
    try {
      setLoading(true);
      const response = await api.getOrder(orderId);
      
      if (response.success && response.data) {
        // Mock tracking data for demo
        const mockOrder = {
          ...response.data,
          shipment_status: 'in_transit' as const,
          tracking_number: 'BKH' + orderId.toString().padStart(10, '0'),
          carrier: 'DHL Express',
          shipped_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        };
        setOrder(mockOrder);
      } else {
        toast.error("Order not found");
      }
    } catch (error) {
      console.error("Error loading order:", error);
      toast.error("Failed to load order details");
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
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground">
              We couldn't find an order with this ID.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">
              Order #{order.id} • Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Tracking Timeline */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Shipment Status</h2>
                <ShipmentTimeline
                  currentStatus={order.shipment_status || 'processing'}
                  trackingNumber={order.tracking_number}
                  carrier={order.carrier}
                  shippedAt={order.shipped_at}
                  deliveredAt={order.delivered_at}
                />
              </Card>
            </div>

            {/* Order Details */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="p-6">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-semibold">${order.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="capitalize">{order.payment_method.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">Shipping Address</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">{order.customer_name}</p>
                  <p className="text-muted-foreground">{order.shipping_address}</p>
                </div>
              </Card>

              {/* Contact Info */}
              <Card className="p-6">
                <h3 className="font-bold mb-4">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customer_email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customer_phone}</span>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full">
                  Download Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
