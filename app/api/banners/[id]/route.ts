import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";
import { logAdminAction } from "@/lib/logger";
import { bannerSchema } from "@/lib/validators";
import Banner from "@/models/Banner";

export const PATCH = withApiHandler(
  async (request: NextRequest, context) => {
    const { id } = await context.params;
    const payload = bannerSchema.partial().parse(await parseJson(request));
    const banner = await Banner.findByIdAndUpdate(id, payload, { returnDocument: "after" });

    if (!banner) {
      throw new NotFoundError("Banner not found.");
    }

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "update_banner",
      resource: "banner",
      resourceId: id
    });

    return apiSuccess(banner);
  },
  {
    auth: "admin"
  }
);

export const DELETE = withApiHandler(
  async (_request, context) => {
    const { id } = await context.params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      throw new NotFoundError("Banner not found.");
    }

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "delete_banner",
      resource: "banner",
      resourceId: id
    });

    return apiSuccess({ deleted: true });
  },
  {
    auth: "admin"
  }
);
