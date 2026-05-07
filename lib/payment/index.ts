import { createCashfreeOrder, verifyCashfreeOrder } from "@/lib/payment/cashfree";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/payment/razorpay";
import type { PaymentMethod } from "@/types";

export async function createGatewayOrder(input: {
  provider: Exclude<PaymentMethod, "cod">;
  amount: number;
  receipt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}) {
  if (input.provider === "razorpay") {
    return createRazorpayOrder({
      amount: input.amount,
      receipt: input.receipt,
      notes: {
        customerId: input.customer.id
      }
    });
  }

  return createCashfreeOrder({
    amount: input.amount,
    orderId: input.receipt,
    customer: input.customer
  });
}

export async function verifyGatewayPayment(input: {
  provider: Exclude<PaymentMethod, "cod">;
  paymentOrderId: string;
  paymentId?: string;
  paymentSignature?: string;
}) {
  if (input.provider === "razorpay") {
    if (!input.paymentId || !input.paymentSignature) {
      return false;
    }

    return verifyRazorpayPayment({
      paymentOrderId: input.paymentOrderId,
      paymentId: input.paymentId,
      paymentSignature: input.paymentSignature
    });
  }

  return verifyCashfreeOrder(input.paymentOrderId);
}
