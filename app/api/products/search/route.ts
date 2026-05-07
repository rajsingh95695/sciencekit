import { NextRequest } from "next/server";

import { apiSuccess, withApiHandler } from "@/lib/api";
import { getProducts } from "@/lib/data";
import { toNumber } from "@/lib/utils";

export const GET = withApiHandler(
  async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const data = await getProducts({
      query: searchParams.get("q") || undefined,
      category: searchParams.get("category") || undefined,
      difficulty:
        (searchParams.get("difficulty") as "Easy" | "Medium" | "Hard" | null) || undefined,
      minPrice: toNumber(searchParams.get("minPrice")),
      maxPrice: toNumber(searchParams.get("maxPrice")),
      rating: toNumber(searchParams.get("rating")),
      page: toNumber(searchParams.get("page"), 1),
      limit: toNumber(searchParams.get("limit"), 12),
      sort:
        (searchParams.get("sort") as
          | "newest"
          | "price-asc"
          | "price-desc"
          | "trending"
          | null) || "newest"
    });

    return apiSuccess(data);
  },
  {
    auth: "public",
    csrf: false
  }
);
