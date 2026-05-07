import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { reviewSchema } from "@/lib/validators";
import Review from "@/models/Review";
import { syncProductRatings } from "@/lib/reviews";

export const GET = withApiHandler(
  async (request: NextRequest) => {
    const productId = request.nextUrl.searchParams.get("productId");
    const query = productId ? { productId } : {};

    const reviews = await Review.find(query)
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(reviews);
  },
  {
    auth: "public",
    csrf: false
  }
);

export const POST = withApiHandler(
  async (request: NextRequest, context) => {
    const payload = reviewSchema.parse(await parseJson(request));
    const review = await Review.findOneAndUpdate(
      {
        userId: context.currentUser!.id,
        productId: payload.productId
      },
      {
        ...payload,
        userId: context.currentUser!.id
      },
      {
        returnDocument: "after",
        upsert: true
      }
    );

    await syncProductRatings(payload.productId);

    return apiSuccess(review, { status: 201 });
  },
  {
    auth: "user"
  }
);
