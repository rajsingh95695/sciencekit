import { NextResponse } from "next/server";

import { withApiHandler } from "@/lib/api";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { generateInvoicePdf } from "@/lib/invoice";
import Order from "@/models/Order";

export const GET = withApiHandler(
  async (_request, context) => {
    const { id } = await context.params;
    const order = await Order.findById(id).populate("userId", "name email");

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    const populatedOrder = order as typeof order & {
      userId: {
        _id: { toString(): string };
        name: string;
        email: string;
      };
    };

    if (
      context.currentUser!.role !== "admin" &&
      populatedOrder.userId._id.toString() !== context.currentUser!.id
    ) {
      throw new ForbiddenError();
    }

    const pdf = await generateInvoicePdf({
      orderId: populatedOrder._id.toString(),
      createdAt: populatedOrder.createdAt,
      customerName: populatedOrder.address.fullName || populatedOrder.userId.name,
      customerEmail: populatedOrder.userId.email,
      address: [
        populatedOrder.address.line1,
        populatedOrder.address.line2,
        populatedOrder.address.city,
        populatedOrder.address.state,
        populatedOrder.address.postalCode,
        populatedOrder.address.country
      ]
        .filter(Boolean)
        .join(", "),
      items: populatedOrder.items.map((item: { name: string; quantity: number; price: number }) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: populatedOrder.subtotal,
      shipping: populatedOrder.shippingAmount,
      tax: populatedOrder.taxAmount,
      total: populatedOrder.totalAmount
    });

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=invoice-${populatedOrder._id.toString()}.pdf`
      }
    });
  },
  {
    auth: "user",
    csrf: false
  }
);
