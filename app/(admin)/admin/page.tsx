import { DashboardCards } from "@/components/admin/dashboard-cards";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { connectToDB } from "@/lib/db";
import { getAdminDashboardData } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  await connectToDB();
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Admin</p>
        <h1 className="font-[var(--font-display)] text-4xl font-bold">Operations dashboard</h1>
      </div>
      <DashboardCards metrics={data.metrics} />
      <Card>
        <CardContent className="space-y-4 p-6">
          <CardTitle className="text-2xl">Recent admin activity</CardTitle>
          {data.recentLogs.map((log: any) => (
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4" key={log._id.toString()}>
              <div>
                <p className="font-semibold">{log.action}</p>
                <CardDescription>{log.resource}</CardDescription>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">{formatDate(log.createdAt, "dd MMM yyyy, hh:mm a")}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
