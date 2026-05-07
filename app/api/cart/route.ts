import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";
import { cartMergeSchema, cartMutationSchema } from "@/lib/validators";
import User from "@/models/User";

async function getHydratedCart(userId: string) {
  const user = await User.findById(userId)
    .populate("cart.productId")
    .populate("saveForLater.productId");

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  return {
    cart: user.cart,
    saveForLater: user.saveForLater
  };
}

export const GET = withApiHandler(
  async (_request, context) => {
    const data = await getHydratedCart(context.currentUser!.id);
    return apiSuccess(data);
  },
  {
    auth: "user",
    csrf: false
  }
);

export const POST = withApiHandler(
  async (request: NextRequest, context) => {
    const body = await parseJson<unknown>(request);
    const user = await User.findById(context.currentUser!.id);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (typeof body === "object" && body && "items" in body) {
      const payload = cartMergeSchema.parse(body);

      payload.items.forEach((item) => {
        const existing = user.cart.find(
          (cartItem: { productId: { toString(): string } }) =>
            cartItem.productId.toString() === item.productId
        );

        if (existing) {
          existing.quantity += item.quantity;
        } else {
          user.cart.push(item);
        }
      });
    } else {
      const payload = cartMutationSchema.parse(body);
      const existing = user.cart.find(
        (item: { productId: { toString(): string } }) =>
          item.productId.toString() === payload.productId
      );

      if (existing) {
        existing.quantity += payload.quantity;
      } else {
        user.cart.push(payload);
      }
    }

    await user.save();
    const data = await getHydratedCart(context.currentUser!.id);
    return apiSuccess(data);
  },
  {
    auth: "user"
  }
);

export const PATCH = withApiHandler(
  async (request: NextRequest, context) => {
    const payload = cartMutationSchema.parse(await parseJson(request));
    const user = await User.findById(context.currentUser!.id);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const item = user.cart.find(
      (cartItem: { productId: { toString(): string } }) =>
        cartItem.productId.toString() === payload.productId
    );

    if (!item) {
      throw new NotFoundError("Cart item not found.");
    }

    item.quantity = payload.quantity;
    await user.save();

    return apiSuccess(await getHydratedCart(context.currentUser!.id));
  },
  {
    auth: "user"
  }
);

export const DELETE = withApiHandler(
  async (request: NextRequest, context) => {
    const productIdParam = request.nextUrl.searchParams.get("productId");
    const user = await User.findById(context.currentUser!.id);

    if (!user || !productIdParam) {
      throw new NotFoundError("Cart item not found.");
    }

    // Decode the productId since it's URL encoded
    const productId = decodeURIComponent(productIdParam);

    // Ensure we compare string IDs consistently
    user.cart = user.cart.filter(
      (item: { productId: { toString(): string } }) => {
        const itemId = item.productId.toString();
        return itemId !== productId;
      }
    );
    await user.save();

    return apiSuccess(await getHydratedCart(context.currentUser!.id));
  },
  {
    auth: "user"
  }
);
