"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { useLocalStorage } from "@/hooks/use-local-storage";
import * as cartService from "@/services/cart-service";

type CartLine = {
  productId: string;
  quantity: number;
  product?: Record<string, unknown>;
};

type CartContextValue = {
  cart: CartLine[];
  saveForLater: CartLine[];
  count: number;
  refreshCart: () => Promise<void>;
  addItem: (item: { productId: string; quantity?: number; product?: Record<string, unknown> }) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function normalizeCartPayload(payload: { cart: unknown[]; saveForLater: unknown[] }) {
  const toLine = (entry: any): CartLine => {
    // Extract productId consistently - handle both string and populated object
    let productId: string;
    if (entry.productId && typeof entry.productId === 'object' && entry.productId._id) {
      productId = entry.productId._id.toString();
    } else if (entry.productId) {
      productId = entry.productId.toString();
    } else if (entry._id) {
      productId = entry._id.toString();
    } else {
      productId = '';
    }

    return {
      productId,
      quantity: entry.quantity || 1,
      product: entry.productId && typeof entry.productId === "object" ? entry.productId : undefined
    };
  };

  return {
    cart: (payload.cart || []).map(toLine),
    saveForLater: (payload.saveForLater || []).map(toLine)
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [guestCart, setGuestCart, cartHydrated] = useLocalStorage<CartLine[]>("sciencekit-cart", []);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [saveForLater, setSaveForLater] = useState<CartLine[]>([]);

  const refreshCart = async () => {
    if (!user) {
      if (cartHydrated) {
        setCart(guestCart);
      }
      setSaveForLater([]);
      return;
    }

    const response = normalizeCartPayload(await cartService.getCart());
    setCart(response.cart);
    setSaveForLater(response.saveForLater);
  };

  useEffect(() => {
    void refreshCart();
  }, [user, cartHydrated]);

  useEffect(() => {
    if (!user && cartHydrated) {
      setCart(guestCart);
      setSaveForLater([]);
    }
  }, [guestCart, user, cartHydrated]);

  useEffect(() => {
    if (user && guestCart.length) {
      void cartService.mergeCart({
        items: guestCart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }).then((response) => {
        const normalized = normalizeCartPayload(response);
        setCart(normalized.cart);
        setSaveForLater(normalized.saveForLater);
        setGuestCart([]);
      });
    }
  }, [user, guestCart, setGuestCart]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      saveForLater,
      count: cart.reduce((sum, item) => sum + item.quantity, 0),
      async refreshCart() {
        await refreshCart();
      },
      async addItem(item) {
        if (!user) {
          setGuestCart((current) => {
            const existing = current.find((entry) => entry.productId === item.productId);
            if (existing) {
              return current.map((entry) =>
                entry.productId === item.productId
                  ? { ...entry, quantity: entry.quantity + (item.quantity || 1) }
                  : entry
              );
            }

            return [
              ...current,
              {
                productId: item.productId,
                quantity: item.quantity || 1,
                product: item.product
              }
            ];
          });
          return;
        }

        const response = normalizeCartPayload(
          await cartService.addToCart({
            productId: item.productId,
            quantity: item.quantity || 1
          })
        );
        setCart(response.cart);
        setSaveForLater(response.saveForLater);
      },
      async updateItem(productId, quantity) {
        if (!user) {
          setGuestCart((current) =>
            current.map((entry) => (entry.productId === productId ? { ...entry, quantity } : entry))
          );
          return;
        }

        const response = normalizeCartPayload(await cartService.updateCartItem({ productId, quantity }));
        setCart(response.cart);
        setSaveForLater(response.saveForLater);
      },
      async removeItem(productId) {
        if (!user) {
          setGuestCart((current) => current.filter((entry) => entry.productId !== productId));
          return;
        }

        try {
          const response = normalizeCartPayload(await cartService.removeCartItem(productId));
          setCart(response.cart);
          setSaveForLater(response.saveForLater);
        } catch (error) {
          console.error("Failed to remove cart item:", error);
          throw error; // Re-throw so UI can show error
        }
      }
    }),
    [cart, saveForLater, user, setGuestCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}
