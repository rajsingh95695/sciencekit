"use client";

import { apiRequest } from "@/services/api-client";

export function fetchProductSuggestions(query: string) {
  return apiRequest<Array<Record<string, unknown>>>(
    `/api/products/suggest?q=${encodeURIComponent(query)}`,
    {
      method: "GET"
    }
  );
}

export function fetchRecentlyViewed(ids: string[]) {
  return apiRequest<Array<Record<string, unknown>>>("/api/products/recently-viewed", {
    method: "POST",
    body: JSON.stringify({ ids })
  });
}

export function subscribeStockAlert(payload: { email: string; productId: string }) {
  return apiRequest<{ subscribed: boolean }>("/api/products/stock-alert", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
