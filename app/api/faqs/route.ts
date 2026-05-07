import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { logAdminAction } from "@/lib/logger";
import { faqSchema } from "@/lib/validators";
import FAQ from "@/models/FAQ";

export const GET = withApiHandler(
  async (request: NextRequest) => {
    const all = request.nextUrl.searchParams.get("all") === "true";
    const faqs = await FAQ.find(all ? {} : { active: true }).sort({ order: 1, createdAt: -1 }).lean();
    return apiSuccess(faqs);
  },
  {
    auth: "public",
    csrf: false
  }
);

export const POST = withApiHandler(
  async (request: NextRequest, context) => {
    const payload = faqSchema.parse(await parseJson(request));
    const faq = await FAQ.create(payload);

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "create_faq",
      resource: "faq",
      resourceId: faq._id.toString()
    });

    return apiSuccess(faq, { status: 201 });
  },
  {
    auth: "admin"
  }
);
