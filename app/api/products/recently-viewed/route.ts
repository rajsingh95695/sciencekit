import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import Product from "@/models/Product";

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const payload = (await parseJson(request)) as {
      ids?: string[];
    };

    const ids = (payload.ids || []).slice(0, 12);

    if (!ids.length) {
      return apiSuccess([]);
    }

    const products = await Product.find({
      _id: {
        $in: ids
      }
    }).lean();

    return apiSuccess(products);
  },
  {
    auth: "public"
  }
);
