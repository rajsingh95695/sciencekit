import { apiSuccess, withApiHandler } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";
import Order from "@/models/Order";

export const GET = withApiHandler(
  async (_request, { params }) => {
    const { trackingId } = await params;
    const order = await Order.findOne({
      shippingTrackingId: trackingId
    }).select("orderStatus shippingTrackingId createdAt updatedAt");

    if (!order) {
      throw new NotFoundError("Tracking information not found.");
    }

    return apiSuccess(order);
  },
  {
    auth: "public",
    csrf: false
  }
);
