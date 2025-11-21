import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api";
import { ShoppingCart, Star, Clock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import WishlistButton from "./WishlistButton";

export default function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const recent = localStorage.getItem("belkhair_recently_viewed");
    if (recent) {
      try {
        setRecentProducts(JSON.parse(recent));
      } catch (error) {
        console.error("Failed to parse recently viewed:", error);
      }
    }
  }, []);

  function handleAddToCart(product: Product) {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  }

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Recently Viewed</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentProducts.slice(0, 5).map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square bg-card overflow-hidden">
                  <WishlistButton
                    product={product}
                    className="absolute top-2 right-2 z-10"
                  />
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-muted-foreground text-xs">No image</span>
                    </div>
                  )}
                </div>
              </Link>

              <CardContent className="p-3">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-lg font-bold text-primary">
                    ${product.price}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      ${product.original_price}
                    </span>
                  )}
                </div>

                <Button
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {product.stock_quantity === 0 ? "Out of Stock" : "Add"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper function to track viewed products
export function trackProductView(product: Product) {
  const recent = localStorage.getItem("belkhair_recently_viewed");
  let recentProducts: Product[] = [];

  if (recent) {
    try {
      recentProducts = JSON.parse(recent);
    } catch (error) {
      console.error("Failed to parse recently viewed:", error);
    }
  }

  // Remove if already exists
  recentProducts = recentProducts.filter((p) => p.id !== product.id);

  // Add to beginning
  recentProducts.unshift(product);

  // Keep only last 10
  recentProducts = recentProducts.slice(0, 10);

  localStorage.setItem("belkhair_recently_viewed", JSON.stringify(recentProducts));
}
