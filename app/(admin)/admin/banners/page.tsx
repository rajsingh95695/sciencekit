import { CloudinaryUploader } from "@/components/admin/cloudinary-uploader";
import { ResourceManager } from "@/components/admin/resource-manager";

export default function AdminBannersPage() {
  return (
    <div className="space-y-8">
      <CloudinaryUploader />
      <ResourceManager
        title="Manage Banners"
        description="Homepage hero and campaign banner controls."
        endpoint="/api/banners"
        fields={[
          { key: "title", label: "Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "textarea" },
          { key: "image", label: "Image URL", type: "text" },
          { key: "link", label: "Link", type: "text" },
          { key: "active", label: "Active", type: "checkbox" }
        ]}
        itemLabelKey="title"
      />
    </div>
  );
}
