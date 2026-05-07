import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";
import { logAdminAction } from "@/lib/logger";
import { couponSchema } from "@/lib/validators";
import Coupon from "@/models/Coupon";

export const PATCH = withApiHandler(
  async (request: NextRequest, context) => {
    const { id } = await context.params;
    const payload = couponSchema.partial().parse(await parseJson(request));
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      {
        ...payload,
        code: payload.code?.toUpperCase(),
        expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : undefined
      },
      { returnDocument: "after" }
    );

    if (!coupon) {
      throw new NotFoundError("Coupon not found.");
    }

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "update_coupon",
      resource: "coupon",
      resourceId: id
    });

    return apiSuccess(coupon);
  },
  {
    auth: "admin"
  }
);

export const DELETE = withApiHandler(
  async (_request, context) => {
    const { id } = await context.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      throw new NotFoundError("Coupon not found.");
    }

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "delete_coupon",
      resource: "coupon",
      resourceId: id
    });

    return apiSuccess({ deleted: true });
  },
  {
    auth: "admin"
  }
);
