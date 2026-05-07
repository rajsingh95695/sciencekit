"use client";

import { apiRequest } from "@/services/api-client";

export function getCart() {
  return apiRequest<{ cart: unknown[]; saveForLater: unknown[] }>("/api/cart", {
    method: "GET"
  });
}

export function addToCart(payload: { productId: string; quantity: number }) {
  return apiRequest<{ cart: unknown[]; saveForLater: unknown[] }>("/api/cart", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function mergeCart(payload: { items: Array<{ productId: string; quantity: number }> }) {
  return apiRequest<{ cart: unknown[]; saveForLater: unknown[] }>("/api/cart", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateCartItem(payload: { productId: string; quantity: number }) {
  return apiRequest<{ cart: unknown[]; saveForLater: unknown[] }>("/api/cart", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function removeCartItem(productId: string) {
  return apiRequest<{ cart: unknown[]; saveForLater: unknown[] }>(
    `/api/cart?productId=${encodeURIComponent(productId)}`,
    {
      method: "DELETE"
    }
  );
}

export function moveToSaveForLater(productId: string) {
  return apiRequest<{ cart: unknown[]; saveForLater: unknown[] }>("/api/cart/save-for-later", {
    method: "POST",
    body: JSON.stringify({ productId })
  });
}

export function moveBackToCart(productId: string) {
  return apiRequest<{ cart: unknown[]; saveForLater: unknown[] }>("/api/cart/save-for-later", {
    method: "DELETE",
    body: JSON.stringify({ productId })
  });
}

export function getWishlist() {
  return apiRequest<Array<Record<string, unknown>>>("/api/wishlist", {
    method: "GET"
  });
}

export function addToWishlist(productId: string) {
  return apiRequest<Array<Record<string, unknown>>>("/api/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId })
  });
}

export function removeFromWishlist(productId: string) {
  return apiRequest<Array<Record<string, unknown>>>(`/api/wishlist?productId=${encodeURIComponent(productId)}`, {
    method: "DELETE"
  });
}
