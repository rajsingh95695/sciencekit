import { ImportProduct } from "@/components/admin/import-product";

export const metadata = {
  title: "Import Product | Admin"
};

export default function AdminImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Catalog</p>
        <h1 className="font-[var(--font-display)] text-3xl font-bold">Auto Importer</h1>
      </div>
      <ImportProduct />
    </div>
  );
}
