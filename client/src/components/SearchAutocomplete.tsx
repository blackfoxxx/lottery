import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Search, TrendingUp, Clock } from "lucide-react";
import { api, Product } from "@/lib/api";
import { Input } from "@/components/ui/input";

export default function SearchAutocomplete() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem("searchHistory");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Debounced search
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await api.getProducts({ search: query });
        if (response.success) {
          setResults(response.data.data.slice(0, 6)); // Show max 6 results
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectProduct(results[selectedIndex]);
        } else if (query) {
          handleViewAllResults();
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectProduct = (product: Product) => {
    addToSearchHistory(query);
    setQuery("");
    setIsOpen(false);
    setLocation(`/products/${product.id}`);
  };

  const handleViewAllResults = () => {
    addToSearchHistory(query);
    setIsOpen(false);
    setLocation(`/products?search=${encodeURIComponent(query)}`);
  };

  const addToSearchHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    inputRef.current?.focus();
  };

  const highlightMatch = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-900">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length >= 2 && results.length > 0) {
              setIsOpen(true);
            }
          }}
          className="pl-10 pr-4"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-popover border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2">
                {results.map((product, index) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors ${
                      selectedIndex === index ? "bg-accent" : ""
                    }`}
                  >
                    <img
                      src={product.images?.[0] || product.image_url || "" || "/placeholder.png"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">
                        {highlightMatch(product.name, query)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.category?.name}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      ${product.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={handleViewAllResults}
                className="w-full p-3 text-center text-sm text-primary hover:bg-accent border-t border-border transition-colors"
              >
                View all results for "{query}"
              </button>
            </>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-muted-foreground">
              No products found
            </div>
          ) : null}

          {query.length < 2 && searchHistory.length > 0 && (
            <div className="p-2 border-t border-border">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Recent Searches
              </div>
              {searchHistory.map((historyQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(historyQuery)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded transition-colors"
                >
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  {historyQuery}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
