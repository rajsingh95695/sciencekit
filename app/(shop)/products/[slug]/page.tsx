import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/product-grid";
import { ProductDetailActions } from "@/components/sections/product-detail-actions";
import { RecentlyViewedStrip } from "@/components/sections/recently-viewed-strip";
import { ReviewComposer } from "@/components/sections/review-composer";
import { ShippingEstimator } from "@/components/sections/shipping-estimator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { sanitizeRichHtml } from "@/lib/content";
import { connectToDB } from "@/lib/db";
import { getProductBySlug } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectToDB();
  const data = await getProductBySlug(slug);

  if (!data) {
    return {};
  }

  return {
    title: data.product.name,
    description: data.product.description.replace(/<[^>]*>/g, " ").slice(0, 160)
  };
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDB();
  const data = await getProductBySlug(slug);

  if (!data) {
    notFound();
  }

  const { product, relatedProducts, reviews } = data;

  return (
    <div className="page-shell space-y-16 py-10">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <Card className="overflow-hidden">
          <div className="relative aspect-square bg-[var(--muted)]">
            {product.images?.[0]?.url ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-[var(--muted-foreground)]">No image</div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge>{product.category}</Badge>
              <Badge variant="accent">{product.difficulty}</Badge>
            </div>
            <h1 className="font-[var(--font-display)] text-4xl font-bold text-balance">{product.name}</h1>
            <p className="text-lg text-[var(--muted-foreground)]">
              {formatCurrency(product.discountPrice || product.price)}
              {product.discountPrice ? (
                <span className="ml-2 text-sm text-[var(--muted-foreground)] line-through">
                  {formatCurrency(product.price)}
                </span>
              ) : null}
            </p>
            <CardDescription>Stock available: {product.stock}</CardDescription>
          </div>

          <div className="rich-text" dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(product.description) }} />

          <ProductDetailActions product={product} />

          <ShippingEstimator product={product} />

          <Card>
            <CardContent className="space-y-4 p-6">
              <CardTitle className="text-xl">Components included</CardTitle>
              <div className="flex flex-wrap gap-2">
                {(product.componentsIncluded || []).map((item: string) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Reviews</p>
          <h2 className="font-[var(--font-display)] text-3xl font-bold">What buyers say</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.length ? (
            reviews.map((review: any) => (
              <Card key={review._id.toString()}>
                <CardContent className="space-y-3 p-6">
                  <p className="font-semibold">{review.userId?.name || "Verified buyer"}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Rating: {review.rating}/5</p>
                  <p>{review.comment}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-[var(--muted-foreground)]">No reviews yet.</CardContent>
            </Card>
          )}
        </div>
        <ReviewComposer productId={product._id.toString()} reviews={reviews as Array<Record<string, any>>} />
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Related</p>
          <h2 className="font-[var(--font-display)] text-3xl font-bold">Customers also explore</h2>
        </div>
        <ProductGrid products={relatedProducts} />
      </section>

      <RecentlyViewedStrip />
    </div>
  );
}
