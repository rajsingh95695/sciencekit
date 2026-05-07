import { ProductGrid } from "@/components/product-grid";
import { connectToDB } from "@/lib/db";
import { getProducts } from "@/lib/data";

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const category = slug.at(-1) || "";

  await connectToDB();
  const result = await getProducts({
    category,
    sort: "trending",
    limit: 12,
    page: 1
  });

  return (
    <div className="page-shell py-10">
      <div className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Category</p>
        <h1 className="font-[var(--font-display)] text-4xl font-bold capitalize">{category}</h1>
      </div>
      <ProductGrid products={result.items} />
    </div>
  );
}
