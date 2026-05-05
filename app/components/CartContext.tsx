"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  category: string;
  size: string;
  color: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number, size: string, color: string) => void;
  updateQty: (id: number, size: string, color: string, delta: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // ✅ Cargar del localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // ✅ Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function addItem(newItem: CartItem) {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.id === newItem.id &&
          i.size === newItem.size &&
          i.color === newItem.color
      );

      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id &&
          i.size === newItem.size &&
          i.color === newItem.color
            ? { ...i, qty: i.qty + newItem.qty }
            : i
        );
      }

      return [...prev, newItem];
    });
  }

  function removeItem(id: number, size: string, color: string) {
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && i.size === size && i.color === color))
    );
  }

  function updateQty(id: number, size: string, color: string, delta: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size && i.color === color
          ? { ...i, qty: Math.max(1, i.qty + delta) }
          : i
      )
    );
  }

  // ✅ NUEVO
  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const count = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
