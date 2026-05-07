import { NextRequest } from "next/server";
import { z } from "zod";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import cloudinary from "@/lib/cloudinary";

const uploadExternalSchema = z.object({
  urls: z.array(z.string().url())
});

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const { urls } = uploadExternalSchema.parse(await parseJson(request));
    
    const uploadPromises = urls.map(async (url) => {
      try {
        const result = await cloudinary.uploader.upload(url, {
          folder: "sciencekit/products"
        });
        return {
          originalUrl: url,
          url: result.secure_url,
          publicId: result.public_id
        };
      } catch (error) {
        console.error(`Failed to upload external image ${url}:`, error);
        // Fallback to the original URL if Cloudinary upload fails
        return {
          originalUrl: url,
          url: url,
          publicId: ""
        };
      }
    });

    const results = await Promise.all(uploadPromises);

    return apiSuccess({ results });
  },
  {
    auth: "admin"
  }
);
