"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/cart-context";
import { apiRequest } from "@/services/api-client";
import {
  createOrder,
  createPaymentOrder,
  estimateCheckout,
  type PaymentOrderResponse
} from "@/services/order-service";
import { formatCurrency } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
    Cashfree?: (options: { mode: "sandbox" | "production" }) => {
      checkout: (options: Record<string, unknown>) => Promise<unknown>;
    };
  }
}

const CASHFREE_RETURN_PATH = "/checkout?cashfree_order_id={order_id}";
type PaymentMethodValue = "razorpay" | "cashfree" | "cod";

function getOrderId(order: Record<string, unknown>) {
  const id = order._id || order.id;
  return typeof id === "string" ? id : "";
}

function getGatewayAmount(paymentOrder: PaymentOrderResponse, fallbackAmount: number) {
  return typeof paymentOrder.gatewayPayload?.amount === "number"
    ? paymentOrder.gatewayPayload.amount
    : fallbackAmount;
}

function loadScript(src: string) {
  return new Promise<boolean>((resolve) => {
    const existing = document.querySelector(`script[src="${src}"]`);

    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();
  const { cart, refreshCart } = useCart();
  const [address, setAddress] = useState<any>({
    fullName: user?.name || "",
    phone: user?.phone || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India"
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodValue>("razorpay");
  const [couponCode, setCouponCode] = useState("");
  const [estimate, setEstimate] = useState<Record<string, any> | null>(null);
  const [processing, setProcessing] = useState(false);

  const orderItems = useMemo(
    () =>
      cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      })),
    [cart]
  );

  useEffect(() => {
    if (user?.addresses?.length) {
      setAddress(user.addresses[0]);
    }
  }, [user]);

  useEffect(() => {
    if (!cart.length || !address.line1 || !address.postalCode) {
      return;
    }

    estimateCheckout({
      items: orderItems,
      address,
      paymentMethod
    })
      .then(setEstimate)
      .catch(() => setEstimate(null));
  }, [orderItems, address, paymentMethod, cart.length]);

  useEffect(() => {
    const cashfreeOrderId = searchParams.get("cashfree_order_id");
    const pending = window.sessionStorage.getItem("sciencekit-pending-order");

    if (!cashfreeOrderId || !pending) {
      return;
    }

    const parsed = JSON.parse(pending) as Record<string, unknown>;

    void createOrder({
      ...parsed,
      paymentMethod: "cashfree",
      paymentOrderId: cashfreeOrderId
    })
      .then(async (order) => {
        window.sessionStorage.removeItem("sciencekit-pending-order");
        await refreshCart();
        await refreshUser();
        toast.success("Cashfree payment verified and order created.");
        router.replace(`/orders/${getOrderId(order)}`);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Cashfree payment verification failed.");
      });
  }, [searchParams, refreshCart, refreshUser, router]);

  if (!user) {
    return (
      <div className="page-shell py-10">
        <Card className="mx-auto max-w-xl">
          <CardContent className="space-y-4 p-8 text-center">
            <CardTitle className="text-3xl">Login required</CardTitle>
            <CardDescription>Checkout uses your secure account session and saved addresses.</CardDescription>
            <Button onClick={() => router.push("/login")}>Login to continue</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const placeOrder = async () => {
    if (!cart.length) {
      toast.error("Your cart is empty.");
      return;
    }

    const basePayload = {
      items: orderItems,
      address,
      couponCode: couponCode || undefined
    };

    try {
      setProcessing(true);

      if (paymentMethod === "cod") {
        const order = await createOrder({
          ...basePayload,
          paymentMethod
        });
        await refreshCart();
        toast.success("Order placed with Cash on Delivery.");
        router.push(`/orders/${getOrderId(order)}`);
        return;
      }

      if (!estimate) {
        toast.error("Please wait for shipping and tax estimation.");
        return;
      }

      const paymentOrder = await createPaymentOrder({
        provider: paymentMethod,
        amount: Number(estimate.totalAmount),
        receipt: `SKPAY${Date.now()}`
      });

      if (paymentMethod === "razorpay") {
        const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!loaded || !window.Razorpay) {
          throw new Error("Razorpay checkout failed to load.");
        }

        const razorpay = new window.Razorpay({
          key: paymentOrder.keyId,
          amount: getGatewayAmount(paymentOrder, Number(estimate.totalAmount)),
          currency: "INR",
          name: "ScienceKit",
          order_id: paymentOrder.orderId,
          handler: async (response: Record<string, string>) => {
            const order = await createOrder({
              ...basePayload,
              paymentMethod: "razorpay",
              paymentId: response.razorpay_payment_id,
              paymentOrderId: response.razorpay_order_id,
              paymentSignature: response.razorpay_signature
            });
            await refreshCart();
            await refreshUser();
            toast.success("Payment successful. Order created.");
            router.push(`/orders/${getOrderId(order)}`);
          },
          prefill: {
            name: address.fullName,
            email: user.email,
            contact: address.phone
          }
        });

        razorpay.open();
        return;
      }

      const loaded = await loadScript("https://sdk.cashfree.com/js/v3/cashfree.js");

      if (!loaded || !window.Cashfree) {
        throw new Error("Cashfree checkout failed to load.");
      }

      window.sessionStorage.setItem(
        "sciencekit-pending-order",
        JSON.stringify({
          ...basePayload
        })
      );

      const cashfree = window.Cashfree({
        mode: process.env.NODE_ENV === "production" ? "production" : "sandbox"
      });

      await cashfree.checkout({
        paymentSessionId: paymentOrder.paymentSessionId,
        returnUrl: `${window.location.origin}${CASHFREE_RETURN_PATH}`
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to complete checkout.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-shell grid gap-8 py-10 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Checkout</p>
          <h1 className="font-[var(--font-display)] text-4xl font-bold">Delivery and payment</h1>
        </div>
        <Card>
          <CardContent className="grid gap-4 p-6 md:grid-cols-2">
            {[
              ["fullName", "Full name"],
              ["phone", "Phone"],
              ["line1", "Address line 1"],
              ["line2", "Address line 2"],
              ["city", "City"],
              ["state", "State"],
              ["postalCode", "Postal code"],
              ["country", "Country"]
            ].map(([key, label]) => (
              <Input
                key={key}
                placeholder={label}
                value={address[key] || ""}
                onChange={(event) => setAddress((current: any) => ({ ...current, [key]: event.target.value }))}
              />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            <CardTitle className="text-2xl">Payment method</CardTitle>
            <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethodValue)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="razorpay">Razorpay</SelectItem>
                <SelectItem value="cashfree">Cashfree</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-3">
              <Input placeholder="Coupon code" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} />
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  if (!couponCode) {
                    return;
                  }
                  const result = await apiRequest<{ valid: boolean; discount: number }>("/api/coupons/validate", {
                    method: "POST",
                    body: JSON.stringify({
                      code: couponCode,
                      subtotal: estimate?.subtotal || 0
                    })
                  });
                  if (result.valid) {
                    toast.success(`Coupon applied. Discount: ${formatCurrency(result.discount)}`);
                  } else {
                    toast.error("Coupon is invalid or expired.");
                  }
                }}
              >
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit lg:sticky lg:top-24">
        <CardContent className="space-y-5 p-6">
          <CardTitle className="text-2xl">Summary</CardTitle>
          {cart.map((item) => (
            <div className="flex items-center justify-between text-sm" key={item.productId}>
              <span className="text-[var(--muted-foreground)]">
                {String(item.product?.name || item.productId)} x {item.quantity}
              </span>
              <span>{formatCurrency(Number(item.product?.discountPrice || item.product?.price || 0) * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-[var(--border)] pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Subtotal</span>
              <span>{formatCurrency(Number(estimate?.subtotal || 0))}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-[var(--muted-foreground)]">Shipping</span>
              <span>{formatCurrency(Number(estimate?.shippingAmount || 0))}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-[var(--muted-foreground)]">Tax</span>
              <span>{formatCurrency(Number(estimate?.taxAmount || 0))}</span>
            </div>
            <div className="mt-4 flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(Number(estimate?.totalAmount || 0))}</span>
            </div>
          </div>
          <Button className="w-full" disabled={processing || !cart.length} onClick={() => void placeOrder()}>
            {processing ? "Processing..." : "Place order"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
