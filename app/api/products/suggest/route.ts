import { NextRequest } from "next/server";

import { apiSuccess, withApiHandler } from "@/lib/api";
import Product from "@/models/Product";

export const GET = withApiHandler(
  async (request: NextRequest) => {
    const query = request.nextUrl.searchParams.get("q")?.trim();

    if (!query) {
      return apiSuccess([]);
    }

    const suggestions = await Product.find({
      $or: [
        {
          name: {
            $regex: query,
            $options: "i"
          }
        },
        {
          category: {
            $regex: query,
            $options: "i"
          }
        },
        {
          subcategory: {
            $regex: query,
            $options: "i"
          }
        },
        {
          tags: {
            $elemMatch: {
              $regex: query,
              $options: "i"
            }
          }
        }
      ]
    })
      .sort({ featured: -1, trendingScore: -1, createdAt: -1 })
      .select("name slug category subcategory images price discountPrice")
      .limit(6)
      .lean();

    return apiSuccess(suggestions);
  },
  {
    auth: "public",
    csrf: false,
    rateLimit: {
      bucket: "product-suggest",
      limit: 120,
      windowMs: 60_000
    }
  }
);
