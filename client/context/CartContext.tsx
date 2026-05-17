"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { CartItem, Product } from "@/types";

type CartContextValue = { cart: CartItem[]; totalQty: number; totalPrice: number; addToCart: (p: Product) => void; removeFromCart: (id: string) => void; increaseQty: (id: string) => void; decreaseQty: (id: string) => void; clearCart: () => void };
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCartKey, setActiveCartKey] = useState<string | null>(null);
  const storageKey = user?._id ? `cart:${user._id}` : "cart:guest";

  useEffect(() => {
    if (loading) return;

    const saved = localStorage.getItem(storageKey);
    setCart(saved ? JSON.parse(saved) : []);
    setActiveCartKey(storageKey);
  }, [loading, storageKey]);

  useEffect(() => {
    if (!activeCartKey) return;
    localStorage.setItem(activeCartKey, JSON.stringify(cart));
  }, [activeCartKey, cart]);
  const addToCart = (product: Product) => setCart(prev => prev.some(i => i._id === product._id) ? prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...product, qty: 1 }]);
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i._id !== id));
  const increaseQty = (id: string) => setCart(prev => prev.map(i => i._id === id ? { ...i, qty: i.qty + 1 } : i));
  const decreaseQty = (id: string) => setCart(prev => prev.map(i => i._id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i));
  const clearCart = () => setCart([]);
  const totalQty = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  return <CartContext.Provider value={{ cart, totalQty, totalPrice, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart }}>{children}</CartContext.Provider>;
}
export function useCart() { const ctx = useContext(CartContext); if (!ctx) throw new Error("useCart must be used inside CartProvider"); return ctx; }
