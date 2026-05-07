"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/services/api-client";

export function CloudinaryUploader() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div>
          <CardTitle className="text-2xl">Cloudinary upload helper</CardTitle>
          <CardDescription>Upload product or banner images and paste the returned URL into the form below.</CardDescription>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];

            if (!file) {
              return;
            }

            try {
              setUploading(true);
              const signature = await apiRequest<Record<string, string | number>>("/api/upload/sign", {
                method: "POST"
              });

              const formData = new FormData();
              formData.append("file", file);
              formData.append("api_key", String(signature.apiKey));
              formData.append("timestamp", String(signature.timestamp));
              formData.append("signature", String(signature.signature));
              formData.append("folder", String(signature.folder));

              const response = await fetch(
                `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
                {
                  method: "POST",
                  body: formData
                }
              );

              if (!response.ok) {
                throw new Error("Cloudinary upload failed.");
              }

              const payload = (await response.json()) as { secure_url: string };
              setUploadedUrl(payload.secure_url);
              await navigator.clipboard.writeText(payload.secure_url);
              toast.success("Upload complete. URL copied to clipboard.");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Upload failed.");
            } finally {
              setUploading(false);
            }
          }}
        />
        {uploading ? <p className="text-sm text-[var(--muted-foreground)]">Uploading...</p> : null}
        {uploadedUrl ? (
          <div className="rounded-2xl bg-[var(--muted)] p-4 text-sm break-all">{uploadedUrl}</div>
        ) : null}
        <Button
          type="button"
          variant="outline"
          disabled={!uploadedUrl}
          onClick={async () => {
            if (!uploadedUrl) {
              return;
            }

            await navigator.clipboard.writeText(uploadedUrl);
            toast.success("URL copied again.");
          }}
        >
          Copy URL
        </Button>
      </CardContent>
    </Card>
  );
}
