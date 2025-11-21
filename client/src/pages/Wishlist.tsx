import { Link } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  function handleAddToCart(product: any) {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  }

  function handleRemove(productId: number, productName: string) {
    removeFromWishlist(productId);
    toast.success(`${productName} removed from wishlist`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                My Wishlist
              </h1>
              <p className="text-muted-foreground">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {wishlist.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to clear your wishlist?')) {
                    clearWishlist();
                    toast.success('Wishlist cleared');
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Empty State */}
          {wishlist.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Your Wishlist is Empty</h2>
              <p className="text-muted-foreground mb-6">
                Save your favorite products to buy them later
              </p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </Card>
          ) : (
            /* Wishlist Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((product) => (
                <Card key={product.id} className="overflow-hidden group">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.images[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.original_price && product.original_price > product.price && (
                      <Badge className="absolute top-3 left-3 bg-red-500">
                        -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-3 right-3"
                      onClick={() => handleRemove(product.id, product.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{product.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.review_count} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.original_price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    {product.stock_quantity > 0 ? (
                      <Badge variant="outline" className="mb-4">
                        {product.stock_quantity} in stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="mb-4">
                        Out of Stock
                      </Badge>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Link href={`/product/${product.id}`}>
                        <Button variant="outline">View</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
