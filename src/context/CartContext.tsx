"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail?: string;
}

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
}

interface Cart {
  id: number;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  count: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  // clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  count: 0,
  loading: false,
  fetchCart: async () => {},
  addToCart: async () => {},
  removeFromCart: async () => {},
  // clearCart: () => {},
});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const guestToken = localStorage.getItem("guest_token");
      const res = await api.get("/cart", {
        headers: guestToken ? { "X-Guest-Token": guestToken } : {},
      } as any);
      if (res.data.guest_token)
        localStorage.setItem("guest_token", res.data.guest_token);
      setCart(res.data.cart ?? null);
    } catch (err) {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      const guestToken = localStorage.getItem("guest_token");
      const res = await api.post(
        "/cart/add",
        { product_id: productId, quantity },
        {
          headers: guestToken ? { "X-Guest-Token": guestToken } : {},
        } as any
      );
      if (res.data.guest_token)
        localStorage.setItem("guest_token", res.data.guest_token);
      setCart(res.data.cart);
      toast.success("Added to cart");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const guestToken = localStorage.getItem("guest_token");
      const res = await api.delete(`/cart/remove/${productId}`, {
        headers: guestToken ? { "X-Guest-Token": guestToken } : {},
      } as any);
      if (res.data.guest_token)
        localStorage.setItem("guest_token", res.data.guest_token);
      setCart(res.data.cart);
      toast.success("Removed from cart");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  };

  // const clearCart = () => setCart(null);
  useEffect(() => {
    fetchCart();

    // ✅ وقتی با دکمه Back مرورگر برمی‌گرده، cart رو مجدد لود کن
    window.addEventListener("pageshow", (e) => {
      if (e.persisted) {
        fetchCart();
      }
    });
  }, []);
  const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        count,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
