"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { getWishlist, removeFromWishlist } from "@/services/cart-service";
import { formatCurrency } from "@/lib/utils";

export default function WishlistPage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [items, setItems] = useState<Array<Record<string, any>>>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    getWishlist().then(setItems).catch((error) => {
      toast.error(error instanceof Error ? error.message : "Unable to load wishlist.");
    });
  }, [user]);

  if (!user) {
    return (
      <div className="page-shell py-10">
        <Card className="mx-auto max-w-xl">
          <CardContent className="space-y-4 p-8 text-center">
            <CardTitle className="text-3xl">Wishlist is available after login</CardTitle>
            <CardDescription>Sign in to save project kits and sync them across devices.</CardDescription>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-shell py-10">
      <div className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Wishlist</p>
        <h1 className="font-[var(--font-display)] text-4xl font-bold">Saved builds</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {items.map((item) => (
          <Card key={item._id}>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{item.name}</CardTitle>
                <CardDescription>{item.category}</CardDescription>
                <p className="font-semibold">{formatCurrency(item.discountPrice || item.price)}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={async () => {
                    await addItem({
                      productId: item._id,
                      quantity: 1,
                      product: item
                    });
                    toast.success("Added to cart.");
                  }}
                >
                  Add to cart
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    await removeFromWishlist(item._id);
                    toast.success("Removed from wishlist.");
                    setItems((current) => current.filter((entry) => entry._id !== item._id));
                  }}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
