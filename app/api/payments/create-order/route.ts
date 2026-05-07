import { NextRequest } from "next/server";
import { z } from "zod";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";
import { createGatewayOrder } from "@/lib/payment";
import User from "@/models/User";

const paymentOrderSchema = z.object({
  provider: z.enum(["razorpay", "cashfree"]),
  amount: z.number().positive(),
  receipt: z.string().min(3)
});

export const POST = withApiHandler(
  async (request: NextRequest, context) => {
    const payload = paymentOrderSchema.parse(await parseJson(request));
    const user = await User.findById(context.currentUser!.id);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const order = await createGatewayOrder({
      provider: payload.provider,
      amount: payload.amount,
      receipt: payload.receipt,
      customer: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "9999999999"
      }
    });

    return apiSuccess(order);
  },
  {
    auth: "user"
  }
);
