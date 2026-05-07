import { randomUUID } from "node:crypto";

import { getCashfreeEnv, getClientEnv } from "@/lib/env";

export async function createCashfreeOrder(input: {
  amount: number;
  orderId: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}) {
  const env = getCashfreeEnv();
  const clientEnv = getClientEnv();
  const endpoint =
    process.env.NODE_ENV === "production"
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": env.CASHFREE_APP_ID,
      "x-client-secret": env.CASHFREE_SECRET_KEY,
      "x-api-version": "2025-01-01",
      "x-request-id": randomUUID()
    },
    body: JSON.stringify({
      order_id: input.orderId,
      order_amount: input.amount,
      order_currency: "INR",
      customer_details: {
        customer_id: input.customer.id,
        customer_name: input.customer.name,
        customer_email: input.customer.email,
        customer_phone: input.customer.phone
      },
      order_meta: {
        return_url: `${clientEnv.NEXT_PUBLIC_BASE_URL}/checkout?cashfree_order_id={order_id}`
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Cashfree order creation failed: ${errorBody}`);
  }

  const order = (await response.json()) as {
    cf_order_id: string;
    payment_session_id: string;
  };

  return {
    provider: "cashfree" as const,
    orderId: order.cf_order_id,
    paymentSessionId: order.payment_session_id,
    amount: input.amount,
    currency: "INR",
    gatewayPayload: order
  };
}

export async function verifyCashfreeOrder(orderId: string) {
  const env = getCashfreeEnv();
  const endpoint =
    process.env.NODE_ENV === "production"
      ? `https://api.cashfree.com/pg/orders/${orderId}`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

  const response = await fetch(endpoint, {
    headers: {
      "x-client-id": env.CASHFREE_APP_ID,
      "x-client-secret": env.CASHFREE_SECRET_KEY,
      "x-api-version": "2025-01-01"
    }
  });

  if (!response.ok) {
    return false;
  }

  const payload = (await response.json()) as { order_status?: string };
  return payload.order_status === "PAID";
}
