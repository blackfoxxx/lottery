import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  rating: number;
  stock: number;
  category?: string;
  brand?: string;
}

interface ComparisonContextType {
  compareList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: number) => void;
  isInCompare: (productId: number) => boolean;
  clearCompare: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARE_ITEMS = 4;

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([]);

  useEffect(() => {
    loadCompareList();
  }, []);

  useEffect(() => {
    saveCompareList();
  }, [compareList]);

  async function loadCompareList() {
    try {
      const saved = await AsyncStorage.getItem("compare_list");
      if (saved) {
        setCompareList(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading compare list:", error);
    }
  }

  async function saveCompareList() {
    try {
      await AsyncStorage.setItem("compare_list", JSON.stringify(compareList));
    } catch (error) {
      console.error("Error saving compare list:", error);
    }
  }

  function addToCompare(product: Product): boolean {
    if (compareList.length >= MAX_COMPARE_ITEMS) {
      return false;
    }
    
    if (!isInCompare(product.id)) {
      setCompareList((prev) => [...prev, product]);
      return true;
    }
    return false;
  }

  function removeFromCompare(productId: number) {
    setCompareList((prev) => prev.filter((item) => item.id !== productId));
  }

  function isInCompare(productId: number): boolean {
    return compareList.some((item) => item.id === productId);
  }

  function clearCompare() {
    setCompareList([]);
  }

  return (
    <ComparisonContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within ComparisonProvider");
  }
  return context;
}
