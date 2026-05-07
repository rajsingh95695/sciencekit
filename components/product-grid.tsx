import { ProductCard } from "@/components/product-card";

export function ProductGrid({ products }: { products: Array<Record<string, any>> }) {
  if (!products.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-[var(--border)] p-10 text-center text-[var(--muted-foreground)]">
        No products found for the current filters.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id || product.slug} product={product} />
      ))}
    </div>
  );
}
