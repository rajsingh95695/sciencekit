import type { Route } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";

const adminLinks: Array<{ href: string; label: string }> = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/import", label: "Import Product" },
  { href: "/admin/bulk-import", label: "Bulk Import" },
  { href: "/admin/bulk-price-editor", label: "Bulk Price Editor" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/content", label: "Blog & FAQ" },
  { href: "/admin/ops", label: "Ops" }
];

export function AdminSidebar() {
  return (
    <Card className="sticky top-24 p-3">
      <div className="space-y-1">
        {adminLinks.map((link) => (
          <Link
            href={link.href as any}
            key={link.href}
            className="block rounded-2xl px-4 py-3 text-sm font-medium hover:bg-[var(--muted)]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </Card>
  );
}
