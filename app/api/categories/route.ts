import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { logAdminAction } from "@/lib/logger";
import { categorySchema } from "@/lib/validators";
import Category from "@/models/Category";
import { slugify } from "@/lib/utils";

export const GET = withApiHandler(
  async () => {
    const categories = await Category.find({})
      .populate("parentCategory", "name slug")
      .sort({ createdAt: -1 });

    return apiSuccess(categories);
  },
  {
    auth: "public",
    csrf: false
  }
);

export const POST = withApiHandler(
  async (request: NextRequest, context) => {
    const payload = categorySchema.parse(await parseJson(request));
    const slug = payload.slug || slugify(payload.name);
    const existing = await Category.findOne({ slug });

    if (existing) {
      throw new ValidationError("A category with this slug already exists.");
    }

    const category = await Category.create({
      ...payload,
      slug
    });

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "create_category",
      resource: "category",
      resourceId: category._id.toString()
    });

    return apiSuccess(category, { status: 201 });
  },
  {
    auth: "admin"
  }
);
