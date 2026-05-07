import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Order from "@/models/Order";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function OrderDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  await connectToDB();
  const order = await Order.findOne({
    _id: id,
    userId: user.id
  }).lean();

  if (!order) {
    notFound();
  }

  return (
    <div className="page-shell py-10">
      <Card>
        <CardContent className="space-y-6 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-3xl">Order #{order._id.toString()}</CardTitle>
              <CardDescription>
                Placed on {formatDate(order.createdAt)} · {order.orderStatus}
              </CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href={`/api/orders/${order._id.toString()}/invoice`} target="_blank">
                Download invoice
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3" key={item.slug}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="grid gap-3 text-sm text-[var(--muted-foreground)] md:grid-cols-2">
            <p>Total: {formatCurrency(order.totalAmount)}</p>
            <p>Tracking ID: {order.shippingTrackingId}</p>
            <p>Payment: {order.paymentMethod}</p>
            <p>Status: {order.paymentStatus}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
