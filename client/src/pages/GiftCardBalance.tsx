import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Search, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface GiftCardInfo {
  code: string;
  balance: number;
  original_amount: number;
  status: 'active' | 'used' | 'expired';
  recipient_name: string;
  expires_at: string | null;
}

export default function GiftCardBalance() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [giftCard, setGiftCard] = useState<GiftCardInfo | null>(null);
  const [error, setError] = useState('');

  const handleCheckBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Please enter a gift card code');
      return;
    }

    setLoading(true);
    setError('');
    setGiftCard(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/gift-cards/check-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setGiftCard(data);
        toast.success('Gift card found!');
      } else {
        setError(data.message || 'Gift card not found');
      }
    } catch (err) {
      console.error('Balance check error:', err);
      setError('Failed to check balance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <CreditCard className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-2">Check Gift Card Balance</h1>
          <p className="text-muted-foreground">
            Enter your gift card code to check the remaining balance
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gift Card Code</CardTitle>
            <CardDescription>
              Enter the 16-character code from your gift card email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckBalance} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Gift Card Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={19}
                  className="font-mono text-lg"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'Checking...' : 'Check Balance'}
              </Button>
            </form>

            {giftCard && (
              <div className="mt-6 space-y-4">
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Gift card is valid and active
                  </AlertDescription>
                </Alert>

                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Balance</span>
                    <span className="text-3xl font-bold text-primary">
                      ${giftCard.balance.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Original Amount</span>
                      <span className="font-medium">${giftCard.original_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Recipient</span>
                      <span className="font-medium">{giftCard.recipient_name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium capitalize">{giftCard.status}</span>
                    </div>
                    {giftCard.expires_at && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Expires</span>
                        <span className="font-medium">
                          {new Date(giftCard.expires_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {giftCard.balance > 0 && (
                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground text-center">
                        Use code <span className="font-mono font-bold">{giftCard.code}</span> at
                        checkout to apply this balance
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Use Your Gift Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Shop Our Products</h3>
                <p className="text-sm text-muted-foreground">
                  Browse our catalog and add items to your cart
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Enter Code at Checkout</h3>
                <p className="text-sm text-muted-foreground">
                  Apply your gift card code during the checkout process
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Balance Applied</h3>
                <p className="text-sm text-muted-foreground">
                  Your gift card balance will be deducted from your order total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
