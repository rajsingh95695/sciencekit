import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { logAdminAction } from "@/lib/logger";
import { categorySchema } from "@/lib/validators";
import Category from "@/models/Category";
import { slugify } from "@/lib/utils";

export const GET = withApiHandler(
  async (_request, { params }) => {
    const { id } = await params;
    const category = await Category.findById(id).populate("parentCategory", "name slug");

    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    return apiSuccess(category);
  },
  {
    auth: "public",
    csrf: false
  }
);

export const PATCH = withApiHandler(
  async (request: NextRequest, context) => {
    const { id } = await context.params;
    const payload = categorySchema.partial().parse(await parseJson(request));
    const category = await Category.findById(id);

    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    Object.assign(category, payload);

    if (payload.name && !payload.slug) {
      category.slug = slugify(payload.name);
    }

    await category.save();

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "update_category",
      resource: "category",
      resourceId: category._id.toString()
    });

    return apiSuccess(category);
  },
  {
    auth: "admin"
  }
);

export const DELETE = withApiHandler(
  async (_request, context) => {
    const { id } = await context.params;
    const childrenCount = await Category.countDocuments({ parentCategory: id });

    if (childrenCount > 0) {
      throw new ValidationError("Delete child categories first.");
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new NotFoundError("Category not found.");
    }

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "delete_category",
      resource: "category",
      resourceId: id
    });

    return apiSuccess({ deleted: true });
  },
  {
    auth: "admin"
  }
);
