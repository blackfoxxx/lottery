import { Link } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Minus, Plus, X, Ticket, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalLotteryTickets } = useCart();

  const subtotal = getTotalPrice();
  const shipping = items.length > 0 ? 10 : 0; // Fixed shipping cost
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {items.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Add some products to get started
                </p>
                <Button asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.product.id} className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link href={`/product/${item.product.id}`}>
                        <div className="w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0 cursor-pointer">
                          {item.product.images && item.product.images.length > 0 ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">No image</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <Link href={`/product/${item.product.id}`}>
                              <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors cursor-pointer">
                                {item.product.name}
                              </h3>
                            </Link>
                            {item.product.lottery_tickets > 0 && (
                              <Badge variant="secondary" className="mb-2">
                                <Ticket className="h-3 w-3 mr-1" />
                                {item.product.lottery_tickets * item.quantity} Lottery Tickets
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock_quantity}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${item.product.price} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-20">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (10%)</span>
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

                  {/* Lottery Tickets Summary */}
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
                        You'll receive these tickets with your order!
                      </p>
                    </div>
                  )}

                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full mt-3" asChild>
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
