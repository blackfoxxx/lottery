import { Product } from "@/lib/api";
import { Link } from "wouter";
import { Loader2, Search, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchResultsProps {
  results: Product[];
  loading: boolean;
  query: string;
  onClose: () => void;
}

export default function SearchResults({ results, loading, query, onClose }: SearchResultsProps) {
  if (!query || query.trim().length < 2) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Searching...</span>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No products found for "{query}"</p>
          <p className="text-sm text-muted-foreground mt-1">Try different keywords</p>
        </div>
      ) : (
        <div className="py-2">
          <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
            Found {results.length} {results.length === 1 ? "product" : "products"}
          </div>
          
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              onClick={onClose}
            >
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors cursor-pointer">
                {/* Product Image */}
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1 mb-1">{product.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold">${product.price}</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ${product.original_price}
                      </span>
                    )}
                    {product.lottery_tickets > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        🎫 {product.lottery_tickets}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                  <div className="flex items-center gap-1 text-xs text-orange-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>Low stock</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
