import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

export default function Cart() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {/* Empty Cart State */}
          <Card className="p-12">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some products to get started
              </p>
              <Button asChild>
                <a href="/products">Browse Products</a>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
