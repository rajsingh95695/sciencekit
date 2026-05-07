"use client";

import { apiRequest } from "@/services/api-client";

export type PaymentOrderResponse = {
  orderId: string;
  keyId?: string;
  paymentSessionId?: string;
  gatewayPayload?: {
    amount?: number;
  };
};

export function estimateCheckout(payload: Record<string, unknown>) {
  return apiRequest<Record<string, unknown>>("/api/checkout/estimate", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function createPaymentOrder(payload: {
  provider: "razorpay" | "cashfree";
  amount: number;
  receipt: string;
}) {
  return apiRequest<PaymentOrderResponse>("/api/payments/create-order", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function createOrder(payload: Record<string, unknown>) {
  return apiRequest<Record<string, unknown>>("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchOrders(scope?: "all") {
  return apiRequest<Array<Record<string, unknown>>>(
    `/api/orders${scope ? `?scope=${scope}` : ""}`,
    {
      method: "GET"
    }
  );
}

export function trackOrder(trackingId: string) {
  return apiRequest<Record<string, unknown>>(`/api/orders/track/${trackingId}`, {
    method: "GET"
  });
}
