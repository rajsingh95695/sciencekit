import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { sanitizeRichHtml } from "@/lib/content";
import { NotFoundError } from "@/lib/errors";
import { logAdminAction } from "@/lib/logger";
import { notifyRestockSubscribers } from "@/lib/stock-alerts";
import { productSchema } from "@/lib/validators";
import Product from "@/models/Product";
import { buildAbsoluteUrl, slugify } from "@/lib/utils";

export const GET = withApiHandler(
  async (_request, { params }) => {
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found.");
    }

    return apiSuccess(product);
  },
  {
    auth: "public",
    csrf: false
  }
);

export const PATCH = withApiHandler(
  async (request: NextRequest, context) => {
    const { id } = await context.params;
    const payload = productSchema.partial().parse(await parseJson(request));
    const product = await Product.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found.");
    }

    const previousStock = product.stock;
    Object.assign(product, payload);

    if (typeof payload.description === "string") {
      product.description = sanitizeRichHtml(payload.description);
    }

    if (payload.name && !payload.slug) {
      product.slug = slugify(payload.name);
    }

    await product.save();

    if (previousStock <= 0 && product.stock > 0) {
      await notifyRestockSubscribers({
        productId: product._id.toString(),
        productName: product.name,
        productUrl: buildAbsoluteUrl(`/products/${product.slug}`)
      });
    }

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "update_product",
      resource: "product",
      resourceId: product._id.toString()
    });

    return apiSuccess(product);
  },
  {
    auth: "admin"
  }
);

export const DELETE = withApiHandler(
  async (_request, context) => {
    const { id } = await context.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundError("Product not found.");
    }

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "delete_product",
      resource: "product",
      resourceId: id
    });

    return apiSuccess({
      deleted: true
    });
  },
  {
    auth: "admin"
  }
);
