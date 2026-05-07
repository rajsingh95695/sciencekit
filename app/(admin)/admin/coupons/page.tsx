import { ResourceManager } from "@/components/admin/resource-manager";

export default function AdminCouponsPage() {
  return (
    <ResourceManager
      title="Manage Coupons"
      description="Discount configuration for campaigns and seasonal sales."
      endpoint="/api/coupons"
      fields={[
        { key: "code", label: "Code", type: "text" },
        { key: "discountType", label: "Discount Type", type: "text" },
        { key: "value", label: "Value", type: "number" },
        { key: "expiryDate", label: "Expiry Date", type: "date" },
        { key: "usageLimit", label: "Usage Limit", type: "number" },
        { key: "active", label: "Active", type: "checkbox" }
      ]}
      itemLabelKey="code"    />
  );
}
