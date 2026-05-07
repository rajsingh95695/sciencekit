import { ResourceManager } from "@/components/admin/resource-manager";

export default function AdminCategoriesPage() {
  return (
    <ResourceManager
      title="Manage Categories"
      description="Multi-level category setup for landing pages and filtering."
      endpoint="/api/categories"
      fields={[
        { key: "name", label: "Name", type: "text" },
        { key: "slug", label: "Slug", type: "text" },
        { key: "image", label: "Image URL", type: "text" },
        { key: "parentCategory", label: "Parent Category ID", type: "text" }
      ]}
      itemLabelKey="name"    />
  );
}
