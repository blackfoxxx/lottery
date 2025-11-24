import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ShoppingCart, Download, Share2 } from "lucide-react";
import { Product } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Link } from "wouter";

export default function ProductComparison() {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    loadCompareProducts();
  }, []);

  function loadCompareProducts() {
    const stored = localStorage.getItem("compareProducts");
    if (stored) {
      setCompareProducts(JSON.parse(stored));
    }
  }

  function removeProduct(productId: number) {
    const updated = compareProducts.filter(p => p.id !== productId);
    setCompareProducts(updated);
    localStorage.setItem("compareProducts", JSON.stringify(updated));
    toast.success("Product removed from comparison");
  }

  function clearAll() {
    setCompareProducts([]);
    localStorage.removeItem("compareProducts");
    toast.success("Comparison cleared");
  }

  function handleAddToCart(product: Product) {
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart`);
  }

  function exportComparison() {
    toast.info("Export feature coming soon!");
  }

  function shareComparison() {
    const productIds = compareProducts.map(p => p.id).join(",");
    const shareUrl = `${window.location.origin}/compare?products=${productIds}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Comparison link copied to clipboard!");
  }

  if (compareProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Product Comparison</h1>
            <p className="text-muted-foreground">
              No products to compare. Add products from the product pages.
            </p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Compare Products</h1>
              <p className="text-muted-foreground">
                Comparing {compareProducts.length} product{compareProducts.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={shareComparison}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={exportComparison}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Product Images and Names */}
              <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${compareProducts.length}, 1fr)` }}>
                <div className="font-semibold"></div>
                {compareProducts.map((product) => (
                  <Card key={product.id} className="p-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeProduct(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-primary">${product.price}</span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.original_price}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </Card>
                ))}
              </div>

              {/* Comparison Rows */}
              <div className="space-y-2">
                {/* Price */}
                <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${compareProducts.length}, 1fr)` }}>
                  <div className="font-semibold bg-muted p-3 rounded-lg">Price</div>
                  {compareProducts.map((product) => (
                    <div key={product.id} className="p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">${product.price}</div>
                      {product.original_price && (
                        <div className="text-sm text-muted-foreground line-through">
                          ${product.original_price}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Rating */}
                <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${compareProducts.length}, 1fr)` }}>
                  <div className="font-semibold bg-muted p-3 rounded-lg">Rating</div>
                  {compareProducts.map((product) => (
                    <div key={product.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">{product.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({product.review_count} reviews)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category */}
                <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${compareProducts.length}, 1fr)` }}>
                  <div className="font-semibold bg-muted p-3 rounded-lg">Category</div>
                  {compareProducts.map((product) => (
                    <div key={product.id} className="p-3 border rounded-lg">
                      <Badge variant="secondary">{product.category?.name || 'Uncategorized'}</Badge>
                    </div>
                  ))}
                </div>

                {/* Stock Status */}
                <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${compareProducts.length}, 1fr)` }}>
                  <div className="font-semibold bg-muted p-3 rounded-lg">Availability</div>
                  {compareProducts.map((product) => (
                    <div key={product.id} className="p-3 border rounded-lg">
                      <Badge variant={product.stock_quantity && product.stock_quantity > 0 ? "default" : "destructive"}>
                        {product.stock_quantity && product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${compareProducts.length}, 1fr)` }}>
                  <div className="font-semibold bg-muted p-3 rounded-lg">Description</div>
                  {compareProducts.map((product) => (
                    <div key={product.id} className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {product.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Lottery Tickets */}
                <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${compareProducts.length}, 1fr)` }}>
                  <div className="font-semibold bg-muted p-3 rounded-lg">Lottery Tickets</div>
                  {compareProducts.map((product) => (
                    <div key={product.id} className="p-3 border rounded-lg">
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        🎫 {product.lottery_tickets || 0} tickets
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
