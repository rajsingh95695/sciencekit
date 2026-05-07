import { createHmac } from "node:crypto";

import Razorpay from "razorpay";

import { getRazorpayEnv } from "@/lib/env";

let razorpayInstance: Razorpay | null = null;

function getRazorpay() {
  if (!razorpayInstance) {
    const env = getRazorpayEnv();

    razorpayInstance = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET
    });
  }

  return razorpayInstance;
}

export async function createRazorpayOrder(input: {
  amount: number;
  receipt: string;
  notes?: Record<string, string>;
}) {
  const order = await getRazorpay().orders.create({
    amount: Math.round(input.amount * 100),
    currency: "INR",
    receipt: input.receipt,
    notes: input.notes
  });

  return {
    provider: "razorpay" as const,
    keyId: getRazorpayEnv().RAZORPAY_KEY_ID,
    orderId: order.id,
    amount: input.amount,
    currency: "INR",
    gatewayPayload: order
  };
}

export function verifyRazorpayPayment(input: {
  paymentOrderId: string;
  paymentId: string;
  paymentSignature: string;
}) {
  const signature = createHmac("sha256", getRazorpayEnv().RAZORPAY_KEY_SECRET)
    .update(`${input.paymentOrderId}|${input.paymentId}`)
    .digest("hex");

  return signature === input.paymentSignature;
}
