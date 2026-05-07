"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import { addToWishlist } from "@/services/cart-service";
import { formatCurrency, getDiscountPercentage } from "@/lib/utils";

export function ProductCard({ product }: { product: Record<string, any> }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const imageUrl = product.images?.[0]?.url;
  const discountPercent = getDiscountPercentage(product.price, product.discountPrice);
  const componentCount = Array.isArray(product.componentsIncluded) ? product.componentsIncluded.length : 0;

  return (
    <Card className="group spotlight-card h-full overflow-hidden border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,255,0.92))] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(7,18,37,0.12)]">
      <CardContent className="flex h-full flex-col p-0">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--muted)]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-[var(--muted-foreground)]">
                No image
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(7,18,37,0.7))]" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {product.featured ? <Badge variant="accent">Featured</Badge> : null}
              <Badge className="bg-white/85 text-[var(--foreground)]">{product.difficulty}</Badge>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-semibold text-white">
              <span className="rounded-full bg-white/14 px-3 py-1 backdrop-blur-sm">
                {componentCount > 0 ? `${componentCount} components` : "Project kit"}
              </span>
              <span className="rounded-full bg-white/14 px-3 py-1 backdrop-blur-sm">
                {product.stock > 0 ? `${product.stock} in stock` : "Made to order"}
              </span>
            </div>
          </div>
        </Link>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              {product.category}
            </p>
            <Link href={`/products/${product.slug}`}>
              <h3 className="line-clamp-2 font-[var(--font-display)] text-xl font-bold">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Star className="h-4 w-4 fill-current text-[var(--accent)]" />
              <span>{(product.ratings || 0).toFixed(1)}</span>
              <span>({product.reviewsCount || 0})</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[var(--secondary)] px-3 py-1 font-medium text-[var(--secondary-foreground)]">
              {product.subcategory || "Readymade build"}
            </span>
            <span className="rounded-full bg-[var(--muted)] px-3 py-1 font-medium text-[var(--muted-foreground)]">
              Viva-ready finish
            </span>
          </div>
          <div className="mt-auto flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-bold">{formatCurrency(product.discountPrice || product.price)}</p>
              {product.discountPrice ? (
                <p className="text-xs text-[var(--muted-foreground)]">
                  <span className="line-through">{formatCurrency(product.price)}</span> - Save {discountPercent}%
                </p>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-white/70"
                onClick={async () => {
                  if (!user) {
                    toast.error("Login to save products to wishlist.");
                    return;
                  }

                  await addToWishlist(product._id);
                  toast.success("Added to wishlist.");
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                className="px-4"
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
                <span className="hidden sm:inline">Add to cart</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
