import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { reviewSchema } from "@/lib/validators";
import Review from "@/models/Review";
import { syncProductRatings } from "@/lib/reviews";

export const PATCH = withApiHandler(
  async (request: NextRequest, context) => {
    const { id } = await context.params;
    const payload = reviewSchema.partial().parse(await parseJson(request));
    const review = await Review.findById(id);

    if (!review) {
      throw new NotFoundError("Review not found.");
    }

    if (
      context.currentUser!.role !== "admin" &&
      review.userId.toString() !== context.currentUser!.id
    ) {
      throw new ForbiddenError();
    }

    Object.assign(review, payload);
    await review.save();
    await syncProductRatings(review.productId.toString());

    return apiSuccess(review);
  },
  {
    auth: "user"
  }
);

export const DELETE = withApiHandler(
  async (_request, context) => {
    const { id } = await context.params;
    const review = await Review.findById(id);

    if (!review) {
      throw new NotFoundError("Review not found.");
    }

    if (
      context.currentUser!.role !== "admin" &&
      review.userId.toString() !== context.currentUser!.id
    ) {
      throw new ForbiddenError();
    }

    const productId = review.productId.toString();
    await review.deleteOne();
    await syncProductRatings(productId);

    return apiSuccess({ deleted: true });
  },
  {
    auth: "user"
  }
);
