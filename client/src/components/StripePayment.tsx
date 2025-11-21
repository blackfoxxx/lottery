import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Initialize Stripe with publishable key
// Replace with your actual Stripe publishable key
const stripePromise = loadStripe("pk_test_51234567890abcdefghijklmnopqrstuvwxyz");

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

function PaymentForm({ amount, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // In a real implementation, you would:
      // 1. Create a payment intent on your backend
      // 2. Confirm the payment with the client secret
      // For demo purposes, we'll simulate a successful payment

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      const mockPaymentIntentId = `pi_${Math.random().toString(36).substr(2, 9)}`;
      
      toast.success("Payment successful!");
      onSuccess(mockPaymentIntentId);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Card Information
        </label>
        <Card className="p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#ffffff",
                  "::placeholder": {
                    color: "#9ca3af",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </Card>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-2xl font-bold">${amount.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!stripe || processing}>
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Your payment is secured by Stripe. We never store your card details.
      </p>
    </form>
  );
}

interface StripePaymentProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

export default function StripePayment({ amount, onSuccess, onCancel }: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
}
