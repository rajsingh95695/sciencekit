import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { couponValidationSchema } from "@/lib/validators";
import Coupon from "@/models/Coupon";

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const payload = couponValidationSchema.parse(await parseJson(request));
    const coupon = await Coupon.findOne({
      code: payload.code.toUpperCase(),
      active: true,
      expiryDate: {
        $gt: new Date()
      }
    });

    if (!coupon || coupon.usedCount >= coupon.usageLimit) {
      return apiSuccess({
        valid: false,
        discount: 0
      });
    }

    const discount =
      coupon.discountType === "percentage"
        ? Number(((payload.subtotal * coupon.value) / 100).toFixed(2))
        : coupon.value;

    return apiSuccess({
      valid: true,
      code: coupon.code,
      discount
    });
  },
  {
    auth: "public"
  }
);
