import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { computeOrderPricing } from "@/lib/order-utils";
import { checkoutEstimateSchema } from "@/lib/validators";

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const payload = checkoutEstimateSchema.parse(await parseJson(request));
    const pricing = await computeOrderPricing(payload);

    return apiSuccess(pricing);
  },
  {
    auth: "public"
  }
);
