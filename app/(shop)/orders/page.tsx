import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Order from "@/models/Order";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function OrdersPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  await connectToDB();
  const orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 }).lean();

  return (
    <div className="page-shell py-10">
      <div className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Orders</p>
        <h1 className="font-[var(--font-display)] text-4xl font-bold">Your purchase history</h1>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id.toString()}>
            <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">Order #{order._id.toString()}</CardTitle>
                <CardDescription>
                  {formatDate(order.createdAt)} · {order.orderStatus} · {formatCurrency(order.totalAmount)}
                </CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link href={`/orders/${order._id.toString()}`}>View details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
