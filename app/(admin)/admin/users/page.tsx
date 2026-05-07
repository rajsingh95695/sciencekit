import { UsersManager } from "@/components/admin/users-manager";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Users</p>
        <h1 className="font-[var(--font-display)] text-4xl font-bold">Manage roles</h1>
      </div>
      <UsersManager />
    </div>
  );
}
