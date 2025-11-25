import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  stock: number;
  lottery_tickets?: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getTotalLotteryTickets: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [items]);

  async function loadCart() {
    try {
      const saved = await AsyncStorage.getItem("cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }

  async function saveCart() {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }

  function addToCart(product: Product, quantity: number = 1) {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }

      return [...prevItems, { product, quantity: Math.min(quantity, product.stock) }];
    });
  }

  function removeFromCart(productId: number) {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  function getTotalPrice(): number {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  function getTotalItems(): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  function getTotalLotteryTickets(): number {
    return items.reduce(
      (total, item) => total + (item.product.lottery_tickets || 0) * item.quantity,
      0
    );
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        getTotalLotteryTickets,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
