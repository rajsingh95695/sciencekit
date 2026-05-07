"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trackOrder } from "@/services/order-service";

export default function TrackOrderPage() {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState<Record<string, any> | null>(null);

  return (
    <div className="page-shell py-10">
      <Card className="mx-auto max-w-2xl">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <CardTitle className="text-3xl">Track your order</CardTitle>
            <CardDescription>Enter the ScienceKit tracking ID sent in your shipping update email.</CardDescription>
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={async (event) => {
              event.preventDefault();
              try {
                const response = await trackOrder(trackingId);
                setResult(response);
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Tracking lookup failed.");
              }
            }}
          >
            <Input value={trackingId} onChange={(event) => setTrackingId(event.target.value)} placeholder="SK123456789" />
            <Button>Track</Button>
          </form>
          {result ? (
            <Card>
              <CardContent className="space-y-3 p-6">
                <p className="text-sm text-[var(--muted-foreground)]">Tracking ID: {result.shippingTrackingId}</p>
                <h3 className="font-[var(--font-display)] text-2xl font-bold capitalize">{result.orderStatus}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Last updated: {new Date(result.updatedAt).toLocaleString("en-IN")}
                </p>
              </CardContent>
            </Card>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
