import { BulkUploadCard } from "@/components/admin/bulk-upload-card";
import { CloudinaryUploader } from "@/components/admin/cloudinary-uploader";
import { ResourceManager } from "@/components/admin/resource-manager";

export default function AdminProductsPage() {
  return (
    <div className="space-y-8">
      <CloudinaryUploader />
      <BulkUploadCard />
      <ResourceManager
        title="Manage Products"
        description="Create, update, and remove project kits."
        endpoint="/api/products"
        fields={[
          { key: "name", label: "Name", type: "text" },
          { key: "slug", label: "Slug", type: "text" },
          { key: "description", label: "Description (HTML)", type: "textarea" },
          { key: "category", label: "Category", type: "text" },
          { key: "subcategory", label: "Subcategory", type: "text" },
          { key: "price", label: "Price", type: "number" },
          { key: "discountPrice", label: "Discount Price", type: "number" },
          { key: "stock", label: "Stock", type: "number" },
          { key: "difficulty", label: "Difficulty", type: "text" },
          { key: "images", label: "Images JSON", type: "json" },
          { key: "videoUrl", label: "Video URL", type: "text" },
          { key: "componentsIncluded", label: "Components (comma separated)", type: "array" },
          { key: "tags", label: "Tags (comma separated)", type: "array" },
          { key: "featured", label: "Featured", type: "checkbox" },
          { key: "trendingScore", label: "Trending Score", type: "number" }
        ]}
        itemLabelKey="name"
      />
    </div>
  );
}
