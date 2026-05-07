import { ProductGrid } from "@/components/product-grid";
import { connectToDB } from "@/lib/db";
import { getProducts } from "@/lib/data";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";

  await connectToDB();
  const result = await getProducts({
    query,
    page: 1,
    limit: 12,
    sort: "trending"
  });

  return (
    <div className="page-shell py-10">
      <div className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Search</p>
        <h1 className="font-[var(--font-display)] text-4xl font-bold">Results for "{query}"</h1>
      </div>
      <ProductGrid products={result.items} />
    </div>
  );
}
