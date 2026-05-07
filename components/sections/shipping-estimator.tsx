"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/services/api-client";
import { formatCurrency } from "@/lib/utils";

type EstimateResult = {
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
};

export function ShippingEstimator({
  product
}: {
  product: Record<string, any>;
}) {
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cashfree" | "cod">("razorpay");
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const baseAddress = useMemo(
    () => ({
      fullName: "Estimate User",
      phone: "9999999999",
      line1: "Estimator",
      city: "Estimator City",
      state: "Estimator State",
      postalCode,
      country: "India"
    }),
    [postalCode]
  );

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div>
          <CardTitle className="text-xl">Shipping estimator</CardTitle>
          <CardDescription>Estimate delivery charges and tax before checkout.</CardDescription>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
          />
          <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="razorpay">Razorpay</SelectItem>
              <SelectItem value="cashfree">Cashfree</SelectItem>
              <SelectItem value="cod">COD</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={async () => {
              try {
                const response = await apiRequest<EstimateResult>("/api/checkout/estimate", {
                  method: "POST",
                  body: JSON.stringify({
                    items: [
                      {
                        productId: product._id,
                        quantity: 1
                      }
                    ],
                    address: baseAddress,
                    paymentMethod
                  })
                });
                setEstimate(response);
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to estimate shipping.");
              }
            }}
          >
            Estimate
          </Button>
        </div>
        {estimate ? (
          <div className="grid gap-2 text-sm text-[var(--muted-foreground)]">
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(estimate.shippingAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <span>{formatCurrency(estimate.taxAmount)}</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-[var(--foreground)]">
              <span>Total delivered cost</span>
              <span>{formatCurrency(estimate.totalAmount)}</span>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
