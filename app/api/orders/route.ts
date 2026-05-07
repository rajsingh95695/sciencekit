import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { sendOrderConfirmationEmail } from "@/lib/mail";
import { computeOrderPricing } from "@/lib/order-utils";
import { verifyGatewayPayment } from "@/lib/payment";
import { createOrderSchema } from "@/lib/validators";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { makeTrackingId } from "@/lib/utils";

export const GET = withApiHandler(
  async (request: NextRequest, context) => {
    const scope = request.nextUrl.searchParams.get("scope");
    const query =
      context.currentUser!.role === "admin" && scope === "all"
        ? {}
        : { userId: context.currentUser!.id };

    const orders = await Order.find(query)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(orders);
  },
  {
    auth: "user",
    csrf: false
  }
);

export const POST = withApiHandler(
  async (request: NextRequest, context) => {
    const payload = createOrderSchema.parse(await parseJson(request));
    const user = await User.findById(context.currentUser!.id);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (payload.paymentMethod !== "cod") {
      if (!payload.paymentOrderId) {
        throw new ValidationError("Payment order reference missing.");
      }

      const existingOrder = await Order.findOne({
        paymentMethod: payload.paymentMethod,
        paymentOrderId: payload.paymentOrderId
      });

      if (existingOrder) {
        return apiSuccess(existingOrder);
      }

      const verified = await verifyGatewayPayment({
        provider: payload.paymentMethod,
        paymentOrderId: payload.paymentOrderId,
        paymentId: payload.paymentId,
        paymentSignature: payload.paymentSignature
      });

      if (!verified) {
        throw new ValidationError("Payment verification failed.");
      }
    }

    const pricing = await computeOrderPricing(payload);

    const order = await Order.create({
      userId: user._id,
      items: pricing.items,
      subtotal: pricing.subtotal,
      taxAmount: pricing.taxAmount,
      shippingAmount: pricing.shippingAmount,
      totalAmount: pricing.totalAmount,
      discount: pricing.discount,
      couponCode: pricing.couponCode || undefined,
      paymentMethod: payload.paymentMethod,
      paymentStatus:
        payload.paymentMethod === "cod" ? "pending" : "paid",
      paymentId: payload.paymentId,
      paymentOrderId: payload.paymentOrderId,
      orderStatus: "pending",
      shippingTrackingId: makeTrackingId(),
      address: payload.address
    });

    if (pricing.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: pricing.couponCode },
        {
          $inc: {
            usedCount: 1
          }
        }
      );
    }

    await Promise.all(
      pricing.items.map((item) =>
        Product.findByIdAndUpdate(item.productId, {
          $inc: {
            stock: -item.quantity,
            trendingScore: item.quantity
          }
        })
      )
    );

    user.cart = user.cart.filter(
      (cartItem: { productId: { toString(): string } }) =>
        !payload.items.some((item) => item.productId === cartItem.productId.toString())
    );

    const addressExists = user.addresses.some(
      (address: {
        line1: string;
        postalCode: string;
        city: string;
      }) =>
        address.line1 === payload.address.line1 &&
        address.postalCode === payload.address.postalCode &&
        address.city === payload.address.city
    );

    if (!addressExists) {
      user.addresses.push(payload.address);
    }

    await user.save();

    await sendOrderConfirmationEmail(user.email, order._id.toString(), order.totalAmount);

    return apiSuccess(order, {
      status: 201
    });
  },
  {
    auth: "user"
  }
);
