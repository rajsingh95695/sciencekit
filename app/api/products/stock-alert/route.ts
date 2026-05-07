import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { stockAlertSchema } from "@/lib/validators";
import StockAlert from "@/models/StockAlert";

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const payload = stockAlertSchema.parse(await parseJson(request));

    await StockAlert.findOneAndUpdate(
      {
        email: payload.email,
        productId: payload.productId
      },
      {
        email: payload.email,
        productId: payload.productId,
        notified: false
      },
      {
        returnDocument: "after",
        upsert: true
      }
    );

    return apiSuccess({
      subscribed: true
    });
  },
  {
    auth: "public",
    rateLimit: {
      bucket: "stock-alert",
      limit: 20,
      windowMs: 60_000
    }
  }
);
