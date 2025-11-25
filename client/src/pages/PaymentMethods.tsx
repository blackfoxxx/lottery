import { useState } from 'react';
import { usePaymentMethods } from '@/contexts/PaymentMethodContext';
import { PaymentMethod, CardBrand, CARD_BRANDS, formatCardNumber, validateCardNumber, validateExpiryDate, validateCVV, detectCardBrand, maskCardNumber } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CreditCard, Trash2, Check, Plus, Wallet, DollarSign } from 'lucide-react';

export default function PaymentMethods() {
  const { paymentMethods, walletBalance, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod, topUpWallet } = usePaymentMethods();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isAddingPayPal, setIsAddingPayPal] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  // PayPal form state
  const [paypalEmail, setPaypalEmail] = useState('');

  // Top-up state
  const [topUpAmount, setTopUpAmount] = useState('');

  const handleAddCard = () => {
    // Validation
    if (!cardNumber || !cardholderName || !expiryMonth || !expiryYear || !cvv) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validateCardNumber(cardNumber.replace(/\s/g, ''))) {
      toast.error('Invalid card number');
      return;
    }

    if (!validateExpiryDate(expiryMonth, expiryYear)) {
      toast.error('Invalid expiry date');
      return;
    }

    const cardBrand = detectCardBrand(cardNumber);
    if (!validateCVV(cvv, cardBrand)) {
      toast.error(`Invalid CVV (${cardBrand === 'amex' ? '4' : '3'} digits required)`);
      return;
    }

    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    addPaymentMethod({
      type: 'credit_card',
      isDefault: paymentMethods.length === 0,
      cardBrand,
      cardLast4: cleanedCardNumber.slice(-4),
      cardholderName,
      expiryMonth,
      expiryYear,
    });

    toast.success('Card added successfully');
    setIsAddingCard(false);
    resetCardForm();
  };

  const handleAddPayPal = () => {
    if (!paypalEmail) {
      toast.error('Please enter your PayPal email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
      toast.error('Invalid email address');
      return;
    }

    addPaymentMethod({
      type: 'paypal',
      isDefault: paymentMethods.length === 0,
      paypalEmail,
    });

    toast.success('PayPal account linked successfully');
    setIsAddingPayPal(false);
    setPaypalEmail('');
  };

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    topUpWallet(amount);
    toast.success(`Wallet topped up with $${amount.toFixed(2)}`);
    setIsTopUpOpen(false);
    setTopUpAmount('');
  };

  const handleRemove = (id: string) => {
    removePaymentMethod(id);
    toast.success('Payment method removed');
  };

  const handleSetDefault = (id: string) => {
    setDefaultPaymentMethod(id);
    toast.success('Default payment method updated');
  };

  const resetCardForm = () => {
    setCardNumber('');
    setCardholderName('');
    setExpiryMonth('');
    setExpiryYear('');
    setCvv('');
  };

  const getCardIcon = (brand: CardBrand) => {
    const brandInfo = CARD_BRANDS[brand];
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl">{brandInfo.icon}</span>
        <span className="font-semibold" style={{ color: brandInfo.color }}>
          {brandInfo.name}
        </span>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
        <p className="text-muted-foreground mb-8">
          Manage your payment methods and wallet balance
        </p>

        {/* Wallet Balance */}
        <Card className="mb-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">Wallet Balance</p>
                <p className="text-4xl font-bold">${walletBalance.toFixed(2)}</p>
              </div>
              <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary">
                    <Plus className="mr-2 h-4 w-4" />
                    Top Up
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Top Up Wallet</DialogTitle>
                    <DialogDescription>
                      Add funds to your wallet balance
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Amount ($)</Label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setTopUpAmount('10')}>
                        $10
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setTopUpAmount('25')}>
                        $25
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setTopUpAmount('50')}>
                        $50
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setTopUpAmount('100')}>
                        $100
                      </Button>
                    </div>
                    <Button onClick={handleTopUp} className="w-full">
                      Top Up Wallet
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Saved Payment Methods */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Saved Payment Methods</h2>
            <div className="flex gap-2">
              <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Card
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Credit/Debit Card</DialogTitle>
                    <DialogDescription>
                      Enter your card details to save it for future purchases
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Card Number</Label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value.replace(/\D/g, ''));
                          if (formatted.replace(/\s/g, '').length <= 16) {
                            setCardNumber(formatted);
                          }
                        }}
                        maxLength={19}
                      />
                      {cardNumber && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {getCardIcon(detectCardBrand(cardNumber))}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Cardholder Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Month</Label>
                        <Input
                          placeholder="MM"
                          value={expiryMonth}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 2) setExpiryMonth(value);
                          }}
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input
                          placeholder="YYYY"
                          value={expiryYear}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) setExpiryYear(value);
                          }}
                          maxLength={4}
                        />
                      </div>
                      <div>
                        <Label>CVV</Label>
                        <Input
                          type="password"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            const maxLength = detectCardBrand(cardNumber) === 'amex' ? 4 : 3;
                            if (value.length <= maxLength) setCvv(value);
                          }}
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddCard} className="w-full">
                      Add Card
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddingPayPal} onOpenChange={setIsAddingPayPal}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Add PayPal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Link PayPal Account</DialogTitle>
                    <DialogDescription>
                      Enter your PayPal email address
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>PayPal Email</Label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddPayPal} className="w-full">
                      Link PayPal Account
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className={method.isDefault ? 'border-primary' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {method.type === 'credit_card' || method.type === 'debit_card' ? (
                        <>
                          <CreditCard className="h-8 w-8 text-muted-foreground" />
                          <div>
                            {getCardIcon(method.cardBrand!)}
                            <p className="text-sm text-muted-foreground mt-1">
                              {maskCardNumber(method.cardLast4!)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Expires {method.expiryMonth}/{method.expiryYear}
                            </p>
                          </div>
                        </>
                      ) : method.type === 'paypal' ? (
                        <>
                          <DollarSign className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-semibold text-blue-600">PayPal</p>
                            <p className="text-sm text-muted-foreground">{method.paypalEmail}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Wallet className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-semibold text-green-600">Wallet</p>
                            <p className="text-sm text-muted-foreground">
                              Balance: ${method.walletBalance?.toFixed(2)}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {method.isDefault ? (
                        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium">Default</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(method.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {paymentMethods.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No payment methods saved yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add a payment method to make checkout faster
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
