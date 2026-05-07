"use client";

import { useEffect, useState } from "react";

import { useRecentlyViewed } from "@/context/recently-viewed-context";
import { fetchRecentlyViewed } from "@/services/product-service";
import { ProductGrid } from "@/components/product-grid";

export function RecentlyViewedStrip() {
  const { ids } = useRecentlyViewed();
  const [products, setProducts] = useState<Array<Record<string, any>>>([]);

  useEffect(() => {
    if (!ids.length) {
      setProducts([]);
      return;
    }

    fetchRecentlyViewed(ids).then(setProducts).catch(() => setProducts([]));
  }, [ids]);

  if (!products.length) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Recently Viewed</p>
        <h2 className="font-[var(--font-display)] text-3xl font-bold">Continue exploring</h2>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
