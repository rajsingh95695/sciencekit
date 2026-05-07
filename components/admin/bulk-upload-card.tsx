"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/services/api-client";

export function BulkUploadCard() {
  const [payload, setPayload] = useState(`[
  {
    "name": "Smart Irrigation System",
    "description": "<p>Readymade irrigation project with automatic soil moisture monitoring and relay-based pump control.</p>",
    "category": "iot",
    "subcategory": "automation",
    "price": 3499,
    "discountPrice": 2999,
    "stock": 12,
    "images": [{ "url": "/catalog/iot.svg" }],
    "difficulty": "Medium",
    "componentsIncluded": ["ESP32", "Soil moisture sensor", "Relay module"],
    "tags": ["esp32", "agriculture", "iot"],
    "featured": true,
    "trendingScore": 8
  }
]`);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div>
          <CardTitle className="text-2xl">Bulk upload products</CardTitle>
          <CardDescription>Paste a JSON array to create multiple products in one request.</CardDescription>
        </div>
        <Textarea className="min-h-[220px] font-mono text-xs" value={payload} onChange={(event) => setPayload(event.target.value)} />
        <Button
          type="button"
          onClick={async () => {
            try {
              await apiRequest("/api/products", {
                method: "POST",
                body: payload
              });
              toast.success("Bulk upload completed.");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Bulk upload failed.");
            }
          }}
        >
          Upload JSON
        </Button>
      </CardContent>
    </Card>
  );
}
