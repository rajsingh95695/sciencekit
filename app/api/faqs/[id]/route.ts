import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";
import { logAdminAction } from "@/lib/logger";
import { faqSchema } from "@/lib/validators";
import FAQ from "@/models/FAQ";

export const PATCH = withApiHandler(
  async (request: NextRequest, context) => {
    const { id } = await context.params;
    const payload = faqSchema.partial().parse(await parseJson(request));
    const faq = await FAQ.findByIdAndUpdate(id, payload, { returnDocument: "after" });

    if (!faq) {
      throw new NotFoundError("FAQ not found.");
    }

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "update_faq",
      resource: "faq",
      resourceId: id
    });

    return apiSuccess(faq);
  },
  {
    auth: "admin"
  }
);

export const DELETE = withApiHandler(
  async (_request, context) => {
    const { id } = await context.params;
    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      throw new NotFoundError("FAQ not found.");
    }

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "delete_faq",
      resource: "faq",
      resourceId: id
    });

    return apiSuccess({ deleted: true });
  },
  {
    auth: "admin"
  }
);
