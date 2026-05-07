import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function DashboardCards({ metrics }: { metrics: Record<string, number> }) {
  const items = [
    { label: "Revenue", value: formatCurrency(metrics.revenue || 0), description: "Paid orders total" },
    { label: "Orders", value: String(metrics.orderCount || 0), description: "All customer orders" },
    { label: "Users", value: String(metrics.userCount || 0), description: "Registered accounts" },
    {
      label: "AOV",
      value: formatCurrency(metrics.averageOrderValue || 0),
      description: "Average order value"
    },
    {
      label: "Pending",
      value: String(metrics.pendingOrders || 0),
      description: "Orders needing action"
    },
    {
      label: "Low Stock",
      value: String(metrics.lowStockProducts || 0),
      description: "Products at or below 5 units"
    }
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="space-y-2 p-6">
            <CardDescription>{item.label}</CardDescription>
            <CardTitle className="text-3xl">{item.value}</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)]">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
