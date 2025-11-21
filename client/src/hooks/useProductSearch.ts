import { useState, useEffect } from "react";
import { api, Product } from "@/lib/api";
import { useDebounce } from "./useDebounce";

export function useProductSearch(query: string) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce the search query to avoid excessive API calls
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // Don't search if query is empty or too short
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.getProducts({ search: debouncedQuery });
        
        if (response.success && response.data.data) {
          setResults(response.data.data);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search products");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [debouncedQuery]);

  return { results, loading, error };
}
