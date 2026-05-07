import type { Difficulty, OrderStatus, PaymentMethod } from "@/types";

export const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

export const paymentMethods: PaymentMethod[] = ["razorpay", "cashfree", "cod"];

export const orderStatuses: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled"
];
