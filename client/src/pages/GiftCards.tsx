import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Gift, Mail, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const PRESET_AMOUNTS = [25, 50, 100, 200, 500];

export default function GiftCards() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please login to purchase gift cards");
      return;
    }

    if (!recipientEmail || !recipientName) {
      toast.error("Please fill in recipient details");
      return;
    }

    if (finalAmount < 10 || finalAmount > 1000) {
      toast.error("Gift card amount must be between $10 and $1000");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/gift-cards/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          amount: finalAmount,
          recipient_email: recipientEmail,
          recipient_name: recipientName,
          message: message || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Gift card purchased successfully! Email sent to recipient.");
        // Reset form
        setRecipientEmail("");
        setRecipientName("");
        setMessage("");
        setCustomAmount("");
        setSelectedAmount(50);
      } else {
        toast.error(data.message || "Failed to purchase gift card");
      }
    } catch (error) {
      console.error("Gift card purchase error:", error);
      toast.error("Failed to purchase gift card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <Gift className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-2">Gift Cards</h1>
            <p className="text-muted-foreground">
              Give the perfect gift - let them choose what they love
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Purchase Form */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase Gift Card</CardTitle>
                <CardDescription>
                  Select an amount and send it to someone special
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Selection */}
                <div className="space-y-3">
                  <Label>Select Amount</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_AMOUNTS.map((amount) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount && !customAmount ? "default" : "outline"}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                        }}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <Label htmlFor="custom-amount">Or Enter Custom Amount</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter amount ($10 - $1000)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    min="10"
                    max="1000"
                  />
                </div>

                {/* Recipient Details */}
                <div className="space-y-2">
                  <Label htmlFor="recipient-name">Recipient Name</Label>
                  <Input
                    id="recipient-name"
                    placeholder="John Doe"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient-email">Recipient Email</Label>
                  <Input
                    id="recipient-email"
                    type="email"
                    placeholder="john@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>

                {/* Personal Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Personal Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Happy Birthday! Enjoy shopping at Belkhair..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Total */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Total Amount:</span>
                    <span className="text-3xl font-bold text-primary">
                      ${finalAmount.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePurchase}
                    disabled={loading || !user}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {loading ? "Processing..." : "Purchase Gift Card"}
                  </Button>

                  {!user && (
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Please login to purchase gift cards
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Choose Amount</h4>
                      <p className="text-sm text-muted-foreground">
                        Select a preset amount or enter a custom value between $10 and $1000
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Add Details</h4>
                      <p className="text-sm text-muted-foreground">
                        Enter recipient's name, email, and an optional personal message
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Instant Delivery</h4>
                      <p className="text-sm text-muted-foreground">
                        Gift card code is sent instantly to recipient's email
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Redeem at Checkout</h4>
                      <p className="text-sm text-muted-foreground">
                        Recipient can use the code during checkout to apply the balance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gift Card Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Instant Email Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        No shipping required, delivered instantly
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Gift className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">No Expiration Date</p>
                      <p className="text-sm text-muted-foreground">
                        Gift cards never expire, use anytime
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Easy to Redeem</p>
                      <p className="text-sm text-muted-foreground">
                        Simply enter code at checkout
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-sm text-center">
                    <strong>Have a gift card code?</strong>
                    <br />
                    You can redeem it during checkout or check your balance in your profile.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
