"use client";

import useEmblaCarousel from "embla-carousel-react";

import { ProductCard } from "@/components/product-card";

export function ProductCarousel({ products }: { products: Array<Record<string, any>> }) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true
  });

  if (!products.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-[var(--border)] p-10 text-center text-[var(--muted-foreground)]">
        No products found for this section yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="-ml-4 flex">
        {products.map((product) => (
          <div className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] xl:flex-[0_0_33.333%]" key={product._id || product.slug}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
