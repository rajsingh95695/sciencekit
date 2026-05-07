"use client";

import Link from "next/link";
import { toast } from "sonner";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import { moveBackToCart, moveToSaveForLater } from "@/services/cart-service";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { user } = useAuth();
  const { cart, saveForLater, updateItem, removeItem, refreshCart } = useCart();
  const subtotal = cart.reduce((total, item) => {
    const price = Number(item.product?.discountPrice || item.product?.price || 0);
    return total + price * item.quantity;
  }, 0);

  return (
    <div className="page-shell grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Cart</p>
          <h1 className="font-[var(--font-display)] text-4xl font-bold">Your project kit bag</h1>
        </div>

        {cart.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-[var(--muted-foreground)]">
              Your cart is empty. Start exploring the catalog to add a project.
            </CardContent>
          </Card>
        ) : (
          cart.map((item) => (
            <Card key={item.productId}>
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{String(item.product?.name || "Project kit")}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {formatCurrency(Number(item.product?.discountPrice || item.product?.price || 0))}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    className="rounded-2xl border border-[var(--input)] bg-[var(--card)] px-3 py-2"
                    value={item.quantity}
                    onChange={(event) => void updateItem(item.productId, Number(event.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((quantity) => (
                      <option key={quantity} value={quantity}>
                        Qty {quantity}
                      </option>
                    ))}
                  </select>
                  {user ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={async () => {
                        try {
                          await moveToSaveForLater(item.productId);
                          await refreshCart();
                          toast.success("Moved to save for later.");
                        } catch (error) {
                          toast.error("Failed to move item to save for later");
                          console.error("Save for later error:", error);
                        }
                      }}
                    >
                      Save for later
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={async () => {
                      try {
                        await removeItem(item.productId);
                        toast.success("Item removed from cart");
                      } catch (error) {
                        toast.error("Failed to remove item from cart");
                        console.error("Remove item error:", error);
                      }
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {saveForLater.length ? (
          <Card>
            <CardContent className="space-y-4 p-6">
              <CardTitle className="text-2xl">Saved for later</CardTitle>
              {saveForLater.map((item) => (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4" key={item.productId}>
                  <div>
                    <p className="font-semibold">{String(item.product?.name || "Project kit")}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Qty {item.quantity}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      try {
                        await moveBackToCart(item.productId);
                        await refreshCart();
                        toast.success("Moved back to cart.");
                      } catch (error) {
                        toast.error("Failed to move item back to cart");
                        console.error("Move back to cart error:", error);
                      }
                    }}
                  >
                    Move to cart
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Card className="h-fit lg:sticky lg:top-24">
        <CardContent className="space-y-5 p-6">
          <CardTitle className="text-2xl">Order summary</CardTitle>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <CardDescription>
            Shipping and tax are calculated at checkout based on destination and payment method.
          </CardDescription>
          <Button asChild className="w-full" disabled={cart.length === 0}>
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
