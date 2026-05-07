import Link from "next/link";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { connectToDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { formatDate } from "@/lib/utils";

export default async function BlogPage() {
  await connectToDB();
  const posts = await BlogPost.find({ published: true }).sort({ createdAt: -1 }).lean();

  return (
    <div className="page-shell py-10">
      <div className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Blog</p>
        <h1 className="font-[var(--font-display)] text-4xl font-bold">Traffic-driving project guides and explainers</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post._id.toString()}>
            <Card className="h-full transition hover:-translate-y-1">
              <CardContent className="space-y-4 p-6">
                <p className="text-sm text-[var(--muted-foreground)]">{formatDate(post.createdAt)}</p>
                <CardTitle className="text-2xl">{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
