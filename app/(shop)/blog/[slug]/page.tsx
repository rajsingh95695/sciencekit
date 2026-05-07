import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { sanitizeRichHtml } from "@/lib/content";
import { connectToDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectToDB();
  const post = await BlogPost.findOne({ slug }).lean();

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default async function BlogDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDB();
  const post = await BlogPost.findOne({ slug }).lean();

  if (!post) {
    notFound();
  }

  return (
    <div className="page-shell py-10">
      <Card>
        <CardContent className="space-y-6 p-8 md:p-10">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              {formatDate(post.createdAt)}
            </p>
            <h1 className="font-[var(--font-display)] text-4xl font-bold text-balance">{post.title}</h1>
            <p className="text-lg text-[var(--muted-foreground)]">{post.excerpt}</p>
          </div>
          <article className="rich-text" dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(post.content) }} />
        </CardContent>
      </Card>
    </div>
  );
}
