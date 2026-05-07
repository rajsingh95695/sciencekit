import type { MetadataRoute } from "next";

import { connectToDB } from "@/lib/db";
import { siteConfig } from "@/config/site";
import BlogPost from "@/models/BlogPost";
import Product from "@/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectToDB();
    const [products, posts] = await Promise.all([
      Product.find({}).select("slug updatedAt").lean(),
      BlogPost.find({ published: true }).select("slug updatedAt").lean()
    ]);

    return [
      "",
      "/products",
      "/blog",
      "/faq",
      "/contact"
    ]
      .map((path) => ({
        url: `${siteConfig.url}${path}`,
        lastModified: new Date()
      }))
      .concat(
        products.map((product) => ({
          url: `${siteConfig.url}/products/${product.slug}`,
          lastModified: product.updatedAt || new Date()
        }))
      )
      .concat(
        posts.map((post) => ({
          url: `${siteConfig.url}/blog/${post.slug}`,
          lastModified: post.updatedAt || new Date()
        }))
      );
  } catch {
    return [
      {
        url: siteConfig.url,
        lastModified: new Date()
      }
    ];
  }
}
