import { useEffect, useState, useMemo } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, Product, Category } from "@/lib/api";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import ProductFilters, { FilterState } from "@/components/ProductFilters";
import WishlistButton from "@/components/WishlistButton";
import ComparisonButton from "@/components/ComparisonButton";
import CountdownTimer from "@/components/CountdownTimer";
import SocialProofBadge from "@/components/SocialProofBadge";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const { addToCart, openCart } = useCart();
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000],
    brands: [],
    minRating: 0,
    inStockOnly: false,
    sortBy: "featured",
  });

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  async function loadData() {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.getProducts({ category_id: selectedCategory }),
        api.getCategories(),
      ]);

      if (productsRes.success && productsRes.data.data) {
        setProducts(productsRes.data.data);
      }

      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Price range filter
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter((p) => p.brand && filters.brands.includes(p.brand.name));
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }

    // Stock filter
    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock_quantity > 0);
    }

    // Sort
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [products, filters]);

  // Get available brands
  const availableBrands = useMemo(() => {
    const brands = products
      .map((p) => p.brand?.name)
      .filter((b): b is string => !!b);
    return Array.from(new Set(brands));
  }, [products]);

  // Get max price
  const maxPrice = useMemo(() => {
    return Math.max(...products.map((p) => p.price), 2000);
  }, [products]);

  function handleAddToCart(product: Product) {
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart`);
    setTimeout(() => openCart(), 300);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Products</h1>
            <p className="text-muted-foreground">
              Browse our collection of premium products
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              onClick={() => setSelectedCategory(undefined)}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableBrands={availableBrands}
                maxPrice={maxPrice}
              />
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-square bg-muted animate-pulse" />
                      <CardContent className="p-4 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products match your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                    >
                      <Link href={`/product/${product.id}`}>
                        <div className="relative aspect-square bg-card overflow-hidden">
                          <WishlistButton
                            product={product}
                            className="absolute top-3 right-3 z-10"
                          />
                          {product.sale_end_date && new Date(product.sale_end_date) > new Date() && (
                            <Badge className="absolute top-3 left-3 z-10 bg-red-600 hover:bg-red-700 animate-pulse">
                              Flash Sale
                            </Badge>
                          )}
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <span className="text-muted-foreground">No image</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      <CardContent className="p-4">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({product.review_count})
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-2xl font-bold text-primary">
                            ${product.price}
                          </span>
                          {product.original_price && product.original_price > product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.original_price}
                            </span>
                          )}
                        </div>

                        {product.sale_end_date && new Date(product.sale_end_date) > new Date() && (
                          <div className="mb-3">
                            <CountdownTimer 
                              endDate={product.sale_end_date} 
                              size="sm"
                            />
                          </div>
                        )}

                        {product.lottery_tickets > 0 && (
                          <Badge variant="secondary" className="mb-3">
                            🎫 {product.lottery_tickets} Lottery Tickets
                          </Badge>
                        )}

                        <SocialProofBadge productId={product.id} />
                      </CardContent>

                      <CardFooter className="p-4 pt-0 space-y-2">
                        <Button
                          className="w-full"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock_quantity === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                        <ComparisonButton product={product} />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
