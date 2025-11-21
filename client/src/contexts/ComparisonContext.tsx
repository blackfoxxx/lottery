import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/lib/api";

interface ComparisonContextType {
  comparison: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: number) => void;
  isInComparison: (productId: number) => boolean;
  toggleComparison: (product: Product) => void;
  clearComparison: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparison, setComparison] = useState<Product[]>([]);

  // Load comparison from localStorage on mount
  useEffect(() => {
    const savedComparison = localStorage.getItem("belkhair_comparison");
    if (savedComparison) {
      try {
        setComparison(JSON.parse(savedComparison));
      } catch (error) {
        console.error("Failed to parse comparison:", error);
      }
    }
  }, []);

  // Save comparison to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("belkhair_comparison", JSON.stringify(comparison));
  }, [comparison]);

  const addToComparison = (product: Product) => {
    setComparison((prev) => {
      // Limit to 4 products for comparison
      if (prev.length >= 4) {
        return prev;
      }
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromComparison = (productId: number) => {
    setComparison((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInComparison = (productId: number) => {
    return comparison.some((item) => item.id === productId);
  };

  const toggleComparison = (product: Product) => {
    if (isInComparison(product.id)) {
      removeFromComparison(product.id);
    } else {
      addToComparison(product);
    }
  };

  const clearComparison = () => {
    setComparison([]);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparison,
        addToComparison,
        removeFromComparison,
        isInComparison,
        toggleComparison,
        clearComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
