import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, Product } from "@/lib/api";
import { ShoppingCart, Star, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params?.id) {
      loadProduct(parseInt(params.id));
    }
  }, [params?.id]);

  async function loadProduct(id: number) {
    try {
      setLoading(true);
      const response = await api.getProduct(id);
      if (response.success && response.data) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error("Failed to load product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  }

  function addToCart() {
    if (product) {
      toast.success(`Added ${quantity} x ${product.name} to cart`);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <p className="text-center text-muted-foreground">Product not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-square bg-card rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({product.review_count} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  ${product.price}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.original_price}
                    </span>
                    <Badge variant="destructive">
                      {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {product.lottery_tickets > 0 && (
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🎫</span>
                    <span className="font-semibold">Lottery Tickets Included</span>
                  </div>
                  <p className="text-muted-foreground">
                    Get <span className="font-bold text-primary">{product.lottery_tickets}</span> lottery
                    tickets with this purchase for the {product.lottery_category} draw!
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold">Stock:</span>
                <Badge variant={product.stock_quantity > 0 ? "secondary" : "destructive"}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} available` : "Out of stock"}
                </Badge>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="w-full"
                onClick={addToCart}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
