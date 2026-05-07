import { FiltersSidebar } from "@/components/filters-sidebar";
import { ProductGrid } from "@/components/product-grid";
import { Card, CardContent } from "@/components/ui/card";
import { connectToDB } from "@/lib/db";
import { getProducts } from "@/lib/data";
import type { Difficulty, SearchFilters } from "@/types";
import { toNumber } from "@/lib/utils";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const difficultyParam = typeof params.difficulty === "string" ? params.difficulty : undefined;
  const sortParam = typeof params.sort === "string" ? params.sort : undefined;

  await connectToDB();
  const data = await getProducts({
    query: typeof params.q === "string" ? params.q : undefined,
    category: typeof params.category === "string" ? params.category : undefined,
    difficulty:
      difficultyParam === "Easy" || difficultyParam === "Medium" || difficultyParam === "Hard"
        ? (difficultyParam as Difficulty)
        : undefined,
    minPrice: typeof params.minPrice === "string" ? toNumber(params.minPrice) : undefined,
    maxPrice: typeof params.maxPrice === "string" ? toNumber(params.maxPrice) : undefined,
    rating: typeof params.rating === "string" ? toNumber(params.rating) : undefined,
    sort:
      sortParam === "newest" ||
      sortParam === "price-asc" ||
      sortParam === "price-desc" ||
      sortParam === "trending"
        ? (sortParam as SearchFilters["sort"])
        : "newest",
    page: typeof params.page === "string" ? toNumber(params.page, 1) : 1,
    limit: 12
  });

  return (
    <div className="page-shell py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Catalog</p>
        <h1 className="font-[var(--font-display)] text-4xl font-bold">Science and electronics project store</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <FiltersSidebar
          activeCategory={typeof params.category === "string" ? params.category : undefined}
          activeDifficulty={typeof params.difficulty === "string" ? params.difficulty : undefined}
        />
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5 text-sm text-[var(--muted-foreground)]">
              <span>
                Showing {data.items.length} of {data.total} projects
              </span>
              <span>Page {data.page}</span>
            </CardContent>
          </Card>
          <ProductGrid products={data.items} />
        </div>
      </div>
    </div>
  );
}
