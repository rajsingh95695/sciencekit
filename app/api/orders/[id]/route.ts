import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { sendShippingUpdateEmail } from "@/lib/mail";
import { updateOrderSchema } from "@/lib/validators";
import Order from "@/models/Order";
import User from "@/models/User";
import { makeTrackingId } from "@/lib/utils";

async function getOrderForUser(orderId: string, userId: string, role: string) {
  const order = await Order.findById(orderId).populate("userId", "name email phone");

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  const populatedOrder = order as typeof order & {
    userId: {
      _id: { toString(): string };
      name?: string;
      email?: string;
      phone?: string;
    };
  };

  if (role !== "admin" && populatedOrder.userId._id.toString() !== userId) {
    throw new ForbiddenError();
  }

  return populatedOrder;
}

export const GET = withApiHandler(
  async (_request, context) => {
    const { id } = await context.params;
    const order = await getOrderForUser(id, context.currentUser!.id, context.currentUser!.role);
    return apiSuccess(order);
  },
  {
    auth: "user",
    csrf: false
  }
);

export const PATCH = withApiHandler(
  async (request: NextRequest, context) => {
    const { id } = await context.params;
    const payload = updateOrderSchema.parse(await parseJson(request));
    const order = await Order.findById(id);

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    const previousStatus = order.orderStatus;
    Object.assign(order, payload);

    if (payload.orderStatus === "shipped" && !payload.shippingTrackingId && !order.shippingTrackingId) {
      order.shippingTrackingId = makeTrackingId();
    }

    await order.save();

    if (previousStatus !== "shipped" && order.orderStatus === "shipped") {
      const user = await User.findById(order.userId);

      if (user) {
        await sendShippingUpdateEmail(
          user.email,
          order._id.toString(),
          order.shippingTrackingId || "Pending"
        );
      }
    }

    return apiSuccess(order);
  },
  {
    auth: "admin"
  }
);
