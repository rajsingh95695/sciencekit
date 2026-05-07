import { NextRequest } from "next/server";
import { Types } from "mongoose";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { wishlistMutationSchema } from "@/lib/validators";
import User from "@/models/User";

// Define types for cart items
interface CartItem {
  productId: Types.ObjectId | { _id: Types.ObjectId } | any;
  quantity: number;
}

async function moveItem(userId: string, productId: string, fromCart: boolean) {
  try {
    const user = await User.findById(userId)
      .populate("cart.productId")
      .populate("saveForLater.productId");

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    // Helper to extract product ID from cart item (handles both populated and plain ObjectId)
    const extractProductId = (cartItem: CartItem): string => {
      if (cartItem.productId && typeof cartItem.productId === 'object') {
        // If populated, productId is a Product document with _id
        if (cartItem.productId._id) {
          return cartItem.productId._id.toString();
        }
        // Otherwise it's an ObjectId
        return cartItem.productId.toString();
      }
      // Fallback (should not happen)
      return cartItem.productId?.toString() || '';
    };

    if (fromCart) {
      const item = user.cart.find(
        (cartItem: CartItem) => extractProductId(cartItem) === productId
      );

      if (!item) {
        throw new NotFoundError("Item not found in cart.");
      }

      user.cart = user.cart.filter(
        (cartItem: CartItem) => extractProductId(cartItem) !== productId
      );
      user.saveForLater.push({
        productId,
        quantity: item.quantity
      });
    } else {
      const item = user.saveForLater.find(
        (cartItem: CartItem) => extractProductId(cartItem) === productId
      );

      if (!item) {
        throw new NotFoundError("Item not found in save for later.");
      }

      user.saveForLater = user.saveForLater.filter(
        (cartItem: CartItem) => extractProductId(cartItem) !== productId
      );
      user.cart.push({
        productId,
        quantity: item.quantity
      });
    }

    await user.save();

    return {
      cart: user.cart,
      saveForLater: user.saveForLater
    };
  } catch (error) {
    logger.error("Error in moveItem", { userId, productId, fromCart, error });
    throw error;
  }
}

export const POST = withApiHandler(
  async (request: NextRequest, context) => {
    const payload = wishlistMutationSchema.parse(await parseJson(request));
    return apiSuccess(await moveItem(context.currentUser!.id, payload.productId, true));
  },
  {
    auth: "user"
  }
);

export const DELETE = withApiHandler(
  async (request: NextRequest, context) => {
    const payload = wishlistMutationSchema.parse(await parseJson(request));
    return apiSuccess(await moveItem(context.currentUser!.id, payload.productId, false));
  },
  {
    auth: "user"
  }
);
