import { useState, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Tag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

interface BundleProduct {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface Bundle {
  id: number;
  name: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  is_active: boolean;
  products: BundleProduct[];
  total_price: number;
  discounted_price: number;
  savings: number;
}

export default function Bundles() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, openCart } = useCart();

  useEffect(() => {
    loadBundles();
  }, []);

  const loadBundles = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/bundles");
      if (response.ok) {
        const data = await response.json();
        setBundles(data);
      }
    } catch (error) {
      console.error("Failed to load bundles:", error);
      toast.error("Failed to load product bundles");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBundleToCart = (bundle: Bundle) => {
    // Add all products in the bundle to cart
    bundle.products.forEach((product) => {
      addToCart(
        {
          id: product.id,
          name: product.name,
          name_ar: "",
          description: "",
          description_ar: "",
          sku: "",
          price: product.price,
          stock_quantity: 100,
          status: "active",
          images: [product.image_url],
          lottery_tickets: 0,
          lottery_category: "",
          rating: 0,
          review_count: 0,
          category_id: 0,
        },
        1
      );
    });

    toast.success(`Added ${bundle.name} to cart with ${bundle.discount_type === "percentage" ? bundle.discount_value + "%" : "$" + bundle.discount_value} discount!`);
    setTimeout(() => openCart(), 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-2">Product Bundles</h1>
            <p className="text-muted-foreground">
              Save more when you buy products together
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : bundles.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No bundles available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.map((bundle) => (
                <Card
                  key={bundle.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{bundle.name}</CardTitle>
                      <Badge className="bg-green-500">
                        <Tag className="w-3 h-3 mr-1" />
                        Save {bundle.discount_type === "percentage" ? `${bundle.discount_value}%` : `$${bundle.discount_value}`}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-4">
                    <p className="text-sm text-muted-foreground">{bundle.description}</p>

                    {/* Products in Bundle */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Includes:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {bundle.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                          >
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ${product.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Regular Price:</span>
                        <span className="line-through">${bundle.total_price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">You Save:</span>
                        <span className="text-green-600 font-semibold">
                          ${bundle.savings.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold">Bundle Price:</span>
                        <span className="text-2xl font-bold text-primary">
                          ${bundle.discounted_price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full"
                      onClick={() => handleAddBundleToCart(bundle)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add Bundle to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-12 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Why Buy Bundles?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Save Money</h4>
                    <p className="text-sm text-muted-foreground">
                      Get automatic discounts when you buy products together
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Curated Collections</h4>
                    <p className="text-sm text-muted-foreground">
                      Products that work great together, handpicked by our team
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">One-Click Shopping</h4>
                    <p className="text-sm text-muted-foreground">
                      Add multiple products to your cart with a single click
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
