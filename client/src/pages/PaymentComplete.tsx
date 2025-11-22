import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useLoyalty } from "@/contexts/LoyaltyContext";

export default function PaymentComplete() {
  const [, setLocation] = useLocation();
  const { clearCart } = useCart();
  const { addPoints } = useLoyalty();
  
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Get order ID from URL parameters
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get("order_id");
    
    if (!orderIdParam) {
      // Try to get from localStorage
      const pendingOrderId = localStorage.getItem("pending_order_id");
      if (pendingOrderId) {
        setOrderId(pendingOrderId);
        verifyPayment(pendingOrderId);
      } else {
        toast.error("No order found");
        setStatus("failed");
      }
    } else {
      setOrderId(orderIdParam);
      verifyPayment(orderIdParam);
    }
  }, []);

  async function verifyPayment(orderId: string) {
    try {
      // Wait a moment for webhook to process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check payment status from backend
      const response = await fetch(`http://localhost:8000/api/v1/orders/${orderId}`);
      const result = await response.json();

      if (result.success && result.data) {
        const order = result.data;
        
        if (order.payment_status === "paid" || order.status === "confirmed") {
          setStatus("success");
          setPaymentDetails(order);
          
          // Clear cart and pending order
          clearCart();
          localStorage.removeItem("pending_order_id");
          
          // Award loyalty points
          const pointsEarned = Math.floor(order.total_amount);
          addPoints(pointsEarned, `Purchase order #${orderId}`);
          
          toast.success(`Payment successful! You earned ${pointsEarned} loyalty points!`);
        } else if (order.payment_status === "failed") {
          setStatus("failed");
          toast.error("Payment failed. Please try again.");
        } else {
          // Payment still pending, check again
          setTimeout(() => verifyPayment(orderId), 3000);
        }
      } else {
        setStatus("failed");
        toast.error("Could not verify payment status");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus("failed");
      toast.error("Error verifying payment");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-primary" />
              <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
              <p className="text-muted-foreground">
                Please wait while we verify your payment...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h1 className="text-2xl font-bold mb-2 text-green-600">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Your order has been confirmed and is being processed.
              </p>
              
              {paymentDetails && (
                <div className="bg-muted p-4 rounded-lg mb-6 text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-medium">#{orderId}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Amount Paid:</span>
                    <span className="font-medium">${paymentDetails.total_amount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-medium">QiCard</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => setLocation(`/order-confirmation/${orderId}`)}
                  className="w-full"
                >
                  View Order Details
                </Button>
                <Button 
                  onClick={() => setLocation("/")}
                  variant="outline"
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
              <h1 className="text-2xl font-bold mb-2 text-red-600">Payment Failed</h1>
              <p className="text-muted-foreground mb-6">
                We couldn't process your payment. Please try again or contact support.
              </p>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => setLocation("/checkout")}
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => setLocation("/")}
                  variant="outline"
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
