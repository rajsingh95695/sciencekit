import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";
import { wishlistMutationSchema } from "@/lib/validators";
import User from "@/models/User";

export const GET = withApiHandler(
  async (_request, context) => {
    const user = await User.findById(context.currentUser!.id).populate("wishlist");

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return apiSuccess(user.wishlist);
  },
  {
    auth: "user",
    csrf: false
  }
);

export const POST = withApiHandler(
  async (request: NextRequest, context) => {
    const payload = wishlistMutationSchema.parse(await parseJson(request));
    const user = await User.findById(context.currentUser!.id);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (!user.wishlist.some((id: { toString(): string }) => id.toString() === payload.productId)) {
      user.wishlist.push(payload.productId);
      await user.save();
    }

    const updated = await User.findById(context.currentUser!.id).populate("wishlist");
    return apiSuccess(updated?.wishlist || []);
  },
  {
    auth: "user"
  }
);

export const DELETE = withApiHandler(
  async (request: NextRequest, context) => {
    const productId = request.nextUrl.searchParams.get("productId");
    const user = await User.findById(context.currentUser!.id);

    if (!user || !productId) {
      throw new NotFoundError("Wishlist item not found.");
    }

    user.wishlist = user.wishlist.filter(
      (id: { toString(): string }) => id.toString() !== productId
    );
    await user.save();

    const updated = await User.findById(context.currentUser!.id).populate("wishlist");
    return apiSuccess(updated?.wishlist || []);
  },
  {
    auth: "user"
  }
);
