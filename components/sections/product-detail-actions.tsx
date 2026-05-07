"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { useRecentlyViewed } from "@/context/recently-viewed-context";
import { addToWishlist } from "@/services/cart-service";
import { subscribeStockAlert } from "@/services/product-service";

export function ProductDetailActions({
  product
}: {
  product: Record<string, any>;
}) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { trackProduct } = useRecentlyViewed();
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    trackProduct(product._id);
  }, [product._id, trackProduct]);

  return (
    <div className="space-y-4">
      {product.stock > 0 ? (
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            size="lg"
            onClick={async () => {
              await addItem({
                productId: product._id,
                quantity: 1,
                product
              });
              toast.success("Added to cart.");
            }}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={async () => {
              if (!user) {
                toast.error("Login to use wishlist.");
                return;
              }

              await addToWishlist(product._id);
              toast.success("Added to wishlist.");
            }}
          >
            <Heart className="h-4 w-4" />
            Save for later
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[var(--destructive)]">Out of stock</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter email for stock alert" />
            <Button
              type="button"
              onClick={async () => {
                await subscribeStockAlert({
                  email,
                  productId: product._id
                });
                toast.success("Stock alert created.");
              }}
            >
              Notify me
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
