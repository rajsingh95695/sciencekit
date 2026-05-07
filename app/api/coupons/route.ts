import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { logAdminAction } from "@/lib/logger";
import { couponSchema } from "@/lib/validators";
import Coupon from "@/models/Coupon";

export const GET = withApiHandler(
  async () => {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    return apiSuccess(coupons);
  },
  {
    auth: "admin",
    csrf: false
  }
);

export const POST = withApiHandler(
  async (request: NextRequest, context) => {
    const payload = couponSchema.parse(await parseJson(request));
    const coupon = await Coupon.create({
      ...payload,
      code: payload.code.toUpperCase(),
      expiryDate: new Date(payload.expiryDate)
    });

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "create_coupon",
      resource: "coupon",
      resourceId: coupon._id.toString()
    });

    return apiSuccess(coupon, { status: 201 });
  },
  {
    auth: "admin"
  }
);
