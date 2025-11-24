import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Share2 } from "lucide-react";
import { Product } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { Link } from "wouter";

export default function SharedWishlist() {
  const [, params] = useRoute("/shared-wishlist/:id");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (params?.id) {
      loadSharedWishlist(params.id);
    }
  }, [params?.id]);

  function loadSharedWishlist(wishlistId: string) {
    setLoading(true);
    
    // Check privacy setting
    const publicSetting = localStorage.getItem(`wishlist_${wishlistId}_public`);
    if (publicSetting === "false") {
      setIsPublic(false);
      setLoading(false);
      return;
    }

    // Load wishlist products
    const stored = localStorage.getItem(`shared_wishlist_${wishlistId}`);
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      // Fallback: try to load from current user's wishlist if it matches
      const currentWishlist = localStorage.getItem("wishlist");
      if (currentWishlist) {
        setProducts(JSON.parse(currentWishlist));
      }
    }
    
    setLoading(false);
  }

  function handleAddToCart(product: Product) {
    addToCart(product, 1);
    toast.success(`Added ${product.name} to your cart`);
  }

  function handleAddToMyWishlist(product: Product) {
    if (isInWishlist(product.id)) {
      toast.info("Already in your wishlist");
      return;
    }
    addToWishlist(product);
    toast.success("Added to your wishlist");
  }

  function handleShare() {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Wishlist link copied!");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <p className="text-muted-foreground">Loading wishlist...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isPublic) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Private Wishlist</h1>
            <p className="text-muted-foreground">
              This wishlist is private and cannot be viewed.
            </p>
            <Link href="/">
              <Button>Go to Homepage</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Shared Wishlist</h1>
            <p className="text-muted-foreground">
              This wishlist is empty.
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
              <h1 className="text-3xl font-bold mb-2">Shared Wishlist</h1>
              <p className="text-muted-foreground">
                {products.length} item{products.length > 1 ? "s" : ""} in this wishlist
              </p>
            </div>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden group">
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="p-4 space-y-3">
                  <div>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <Badge variant="secondary" className="mt-2">
                      {product.category?.name || 'Uncategorized'}
                    </Badge>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      ${product.price}
                    </span>
                    {product.original_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.original_price}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToMyWishlist(product)}
                      disabled={isInWishlist(product.id)}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current text-red-500" : ""}`} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
