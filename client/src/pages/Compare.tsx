import { Link } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useComparison } from "@/contexts/ComparisonContext";
import { useCart } from "@/contexts/CartContext";
import { X, ShoppingCart, Star, Check, Minus } from "lucide-react";
import { toast } from "sonner";

export default function Compare() {
  const { comparison, removeFromComparison, clearComparison } = useComparison();
  const { addToCart } = useCart();

  function handleAddToCart(product: any) {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  }

  function handleRemove(productId: number, productName: string) {
    removeFromComparison(productId);
    toast.success(`${productName} removed from comparison`);
  }

  // Comparison attributes
  const attributes = [
    { key: "price", label: "Price", format: (val: any) => `$${val.toFixed(2)}` },
    { key: "rating", label: "Rating", format: (val: any) => `${val.toFixed(1)} ⭐` },
    { key: "review_count", label: "Reviews", format: (val: any) => `${val} reviews` },
    { key: "stock_quantity", label: "Stock", format: (val: any) => `${val} available` },
    { key: "lottery_tickets", label: "Lottery Tickets", format: (val: any) => `${val} tickets` },
    { key: "brand.name", label: "Brand", format: (val: any) => val || "N/A" },
    { key: "category.name", label: "Category", format: (val: any) => val || "N/A" },
  ];

  function getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Product Comparison</h1>
              <p className="text-muted-foreground">
                Compare up to 4 products side by side
              </p>
            </div>
            {comparison.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to clear the comparison?')) {
                    clearComparison();
                    toast.success('Comparison cleared');
                  }
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Empty State */}
          {comparison.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">No Products to Compare</h2>
                <p className="text-muted-foreground mb-6">
                  Add products from the product listing page to compare them here
                </p>
                <Link href="/products">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            </Card>
          ) : (
            /* Comparison Table */
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Product Cards Row */}
                <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${comparison.length}, 1fr)` }}>
                  {comparison.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="relative">
                        <div className="aspect-square overflow-hidden bg-muted">
                          <img
                            src={product.images?.[0] || product.image_url || "" || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemove(product.id, product.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <Button
                          className="w-full mt-2"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock_quantity === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Comparison Attributes */}
                <Card className="overflow-hidden">
                  <div className="divide-y">
                    {attributes.map((attr) => (
                      <div
                        key={attr.key}
                        className="grid gap-4 p-4 hover:bg-muted/50 transition-colors"
                        style={{ gridTemplateColumns: `200px repeat(${comparison.length}, 1fr)` }}
                      >
                        <div className="font-semibold text-sm">{attr.label}</div>
                        {comparison.map((product) => {
                          const value = getNestedValue(product, attr.key);
                          return (
                            <div key={product.id} className="text-sm">
                              {value !== undefined && value !== null ? attr.format(value as any) : <Minus className="h-4 w-4 text-muted-foreground" />}
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {/* Description Row */}
                    <div
                      className="grid gap-4 p-4 hover:bg-muted/50 transition-colors"
                      style={{ gridTemplateColumns: `200px repeat(${comparison.length}, 1fr)` }}
                    >
                      <div className="font-semibold text-sm">Description</div>
                      {comparison.map((product) => (
                        <div key={product.id} className="text-sm text-muted-foreground line-clamp-3">
                          {product.description || "No description available"}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
