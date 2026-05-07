import { ResourceManager } from "@/components/admin/resource-manager";

export default function AdminContentPage() {
  return (
    <div className="space-y-8">
      <ResourceManager
        title="Manage Blog Posts"
        description="SEO-focused content and traffic capture."
        endpoint="/api/blog"
        fields={[
          { key: "title", label: "Title", type: "text" },
          { key: "slug", label: "Slug", type: "text" },
          { key: "excerpt", label: "Excerpt", type: "textarea" },
          { key: "content", label: "Content (HTML)", type: "textarea" },
          { key: "coverImage", label: "Cover Image", type: "text" },
          { key: "tags", label: "Tags", type: "array" },
          { key: "featured", label: "Featured", type: "checkbox" },
          { key: "published", label: "Published", type: "checkbox" }
        ]}
        itemLabelKey="title"
      />
      <ResourceManager
        title="Manage FAQ"
        description="Pre-sales answers and support reduction content."
        endpoint="/api/faqs"
        fields={[
          { key: "question", label: "Question", type: "textarea" },
          { key: "answer", label: "Answer", type: "textarea" },
          { key: "category", label: "Category", type: "text" },
          { key: "active", label: "Active", type: "checkbox" },
          { key: "order", label: "Display Order", type: "number" }
        ]}
        itemLabelKey="question"
      />
    </div>
  );
}
