import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { logAdminAction } from "@/lib/logger";
import { bannerSchema } from "@/lib/validators";
import Banner from "@/models/Banner";

export const GET = withApiHandler(
  async (request: NextRequest) => {
    const all = request.nextUrl.searchParams.get("all") === "true";
    const banners = await Banner.find(all ? {} : { active: true }).sort({ createdAt: -1 }).lean();
    return apiSuccess(banners);
  },
  {
    auth: "public",
    csrf: false
  }
);

export const POST = withApiHandler(
  async (request: NextRequest, context) => {
    const payload = bannerSchema.parse(await parseJson(request));
    const banner = await Banner.create(payload);

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "create_banner",
      resource: "banner",
      resourceId: banner._id.toString()
    });

    return apiSuccess(banner, { status: 201 });
  },
  {
    auth: "admin"
  }
);
