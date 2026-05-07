import type { SearchFilters } from "@/types";

export function buildProductQuery(filters: SearchFilters) {
  const query: Record<string, unknown> = {};

  if (filters.query) {
    query.$text = {
      $search: filters.query
    };
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.subcategory) {
    query.subcategory = filters.subcategory;
  }

  if (filters.difficulty) {
    query.difficulty = filters.difficulty;
  }

  if (typeof filters.featured === "boolean") {
    query.featured = filters.featured;
  }

  if (filters.rating) {
    query.ratings = {
      $gte: filters.rating
    };
  }

  if (filters.tags?.length) {
    query.tags = {
      $in: filters.tags
    };
  }

  if (filters.minPrice || filters.maxPrice) {
    query.$expr = {
      $and: [
        {
          $gte: [
            {
              $ifNull: ["$discountPrice", "$price"]
            },
            filters.minPrice ?? 0
          ]
        },
        {
          $lte: [
            {
              $ifNull: ["$discountPrice", "$price"]
            },
            filters.maxPrice ?? Number.MAX_SAFE_INTEGER
          ]
        }
      ]
    };
  }

  return query;
}

export function buildSort(sort?: SearchFilters["sort"]): Record<string, 1 | -1> {
  switch (sort) {
    case "price-asc":
      return { discountPrice: 1 as const, price: 1 as const };
    case "price-desc":
      return { discountPrice: -1 as const, price: -1 as const };
    case "trending":
      return { trendingScore: -1 as const, createdAt: -1 as const };
    case "newest":
    default:
      return { createdAt: -1 as const };
  }
}
