import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/sidebar";
import { getSessionUser } from "@/lib/auth";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="page-shell grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <div>{children}</div>
    </div>
  );
}
