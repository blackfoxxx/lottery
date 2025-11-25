import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  rating: number;
  stock: number;
}

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  useEffect(() => {
    saveWishlist();
  }, [wishlist]);

  async function loadWishlist() {
    try {
      const saved = await AsyncStorage.getItem("wishlist");
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  }

  async function saveWishlist() {
    try {
      await AsyncStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  }

  function addToWishlist(product: Product) {
    if (!isInWishlist(product.id)) {
      setWishlist((prev) => [...prev, product]);
    }
  }

  function removeFromWishlist(productId: number) {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  }

  function isInWishlist(productId: number): boolean {
    return wishlist.some((item) => item.id === productId);
  }

  function clearWishlist() {
    setWishlist([]);
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
