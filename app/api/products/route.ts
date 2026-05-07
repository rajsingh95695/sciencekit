import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { sanitizeRichHtml } from "@/lib/content";
import { getProducts } from "@/lib/data";
import { ValidationError } from "@/lib/errors";
import { logAdminAction } from "@/lib/logger";
import { bulkProductSchema, productSchema } from "@/lib/validators";
import Product from "@/models/Product";
import { slugify, toNumber } from "@/lib/utils";

export const GET = withApiHandler(
  async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const result = await getProducts({
      query: searchParams.get("q") || undefined,
      category: searchParams.get("category") || undefined,
      subcategory: searchParams.get("subcategory") || undefined,
      difficulty:
        (searchParams.get("difficulty") as "Easy" | "Medium" | "Hard" | null) || undefined,
      minPrice: toNumber(searchParams.get("minPrice")),
      maxPrice: toNumber(searchParams.get("maxPrice")),
      rating: toNumber(searchParams.get("rating")),
      featured: searchParams.get("featured") === "true" ? true : undefined,
      sort:
        (searchParams.get("sort") as
          | "newest"
          | "price-asc"
          | "price-desc"
          | "trending"
          | null) || "newest",
      page: toNumber(searchParams.get("page"), 1),
      limit: toNumber(searchParams.get("limit"), 12)
    });

    return apiSuccess(result);
  },
  {
    auth: "public",
    csrf: false
  }
);

export const POST = withApiHandler(
  async (request: NextRequest, context) => {
    const body = await parseJson<unknown>(request);

    if (Array.isArray(body)) {
      const products = bulkProductSchema.parse(body).map((item) => ({
        ...item,
        description: sanitizeRichHtml(item.description),
        slug: item.slug || slugify(item.name)
      }));
      const created = await Product.insertMany(products, { ordered: false });

      await logAdminAction({
        adminId: context.currentUser!.id,
        action: "bulk_create_products",
        resource: "product",
        payload: {
          count: created.length
        }
      });

      return apiSuccess({
        created
      });
    }

    const payload = productSchema.parse(body);
    const slug = payload.slug || slugify(payload.name);
    const existing = await Product.findOne({ slug });

    if (existing) {
      throw new ValidationError("A product with this slug already exists.");
    }

    const product = await Product.create({
      ...payload,
      description: sanitizeRichHtml(payload.description),
      slug
    });

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "create_product",
      resource: "product",
      resourceId: product._id.toString()
    });

    return apiSuccess(product, { status: 201 });
  },
  {
    auth: "admin"
  }
);
