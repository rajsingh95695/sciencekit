import { OrdersManager } from "@/components/admin/orders-manager";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Orders</p>
        <h1 className="font-[var(--font-display)] text-4xl font-bold">Manage fulfillment</h1>
      </div>
      <OrdersManager />
    </div>
  );
}
