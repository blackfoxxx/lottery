import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, TrendingUp } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  images?: string[];
  image_url?: string;
  stock_quantity: number;
}

interface FrequentlyBoughtTogetherProps {
  productId: number;
  currentProduct: Product;
}

export default function FrequentlyBoughtTogether({
  productId,
  currentProduct,
}: FrequentlyBoughtTogetherProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set([productId]));
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchRelatedProducts();
  }, [productId]);

  const fetchRelatedProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/bundles/frequently-bought/${productId}`
      );
      if (response.ok) {
        const data = await response.json();
        setRelatedProducts(data.slice(0, 3)); // Limit to 3 products
      }
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (id: number) => {
    const newSelected = new Set(selectedProducts);
    if (id === productId) return; // Can't deselect main product
    
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  const calculateTotal = () => {
    let total = 0;
    let originalTotal = 0;

    if (selectedProducts.has(productId)) {
      total += Number(currentProduct.price);
      originalTotal += Number(currentProduct.original_price || currentProduct.price);
    }

    relatedProducts.forEach((product) => {
      if (selectedProducts.has(product.id)) {
        total += Number(product.price);
        originalTotal += Number(product.original_price || product.price);
      }
    });

    return { total, originalTotal, savings: originalTotal - total };
  };

  const handleAddAllToCart = () => {
    const allProducts = [currentProduct, ...relatedProducts];
    let addedCount = 0;

    allProducts.forEach((product) => {
      if (selectedProducts.has(product.id)) {
        addToCart(product as any);
        addedCount++;
      }
    });

    toast.success(`Added ${addedCount} ${addedCount === 1 ? 'item' : 'items'} to cart`);
  };

  if (loading || relatedProducts.length === 0) {
    return null;
  }

  const { total, originalTotal, savings } = calculateTotal();
  const selectedCount = selectedProducts.size;

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Frequently Bought Together</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Customers who bought this item also bought
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Product */}
          <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <Checkbox checked disabled className="mt-1" />
            <img
              src={currentProduct.images?.[0] || currentProduct.image_url || '/placeholder.png'}
              alt={currentProduct.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium line-clamp-2">{currentProduct.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold text-primary">${currentProduct.price}</span>
                {currentProduct.original_price && currentProduct.original_price > currentProduct.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${currentProduct.original_price}
                  </span>
                )}
              </div>
              <Badge variant="secondary" className="mt-2">
                This item
              </Badge>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.map((product, index) => (
            <div key={product.id}>
              <div className="flex items-center justify-center my-2">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-start gap-4 p-4 rounded-lg border hover:border-primary/50 transition-colors">
                <Checkbox
                  checked={selectedProducts.has(product.id)}
                  onCheckedChange={() => toggleProduct(product.id)}
                  className="mt-1"
                />
                <img
                  src={product.images?.[0] || product.image_url || '/placeholder.png'}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium line-clamp-2">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold">${product.price}</span>
                    {product.original_price && product.original_price > product.price && (
                      <>
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.original_price}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                  {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      Only {product.stock_quantity} left in stock
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Total and Add to Cart */}
          <div className="pt-4 border-t space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total for {selectedCount} {selectedCount === 1 ? 'item' : 'items'}
                </p>
                {savings > 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Save ${savings.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="text-right">
                {savings > 0 && (
                  <p className="text-sm text-muted-foreground line-through">
                    ${originalTotal.toFixed(2)}
                  </p>
                )}
                <p className="text-2xl font-bold text-primary">${total.toFixed(2)}</p>
              </div>
            </div>

            <Button
              onClick={handleAddAllToCart}
              className="w-full"
              size="lg"
              disabled={selectedCount === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add {selectedCount === 1 ? 'Item' : `All ${selectedCount} Items`} to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
