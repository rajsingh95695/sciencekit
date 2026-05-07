import { NextRequest } from "next/server";
import { z } from "zod";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { scrapeProduct } from "@/lib/scraper";
import { formatProductDataAI } from "@/lib/aiFormatter";

const importSchema = z.object({
  url: z.string().url()
});

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const { url } = importSchema.parse(await parseJson(request));
    
    const scrapedData = await scrapeProduct(url);
    if (!scrapedData || !scrapedData.title) {
      throw new Error("Failed to extract meaningful data from the provided URL. The site might be blocking scraping.");
    }
    
    const aiFormatted = await formatProductDataAI({
      title: scrapedData.title,
      description: scrapedData.description,
      brand: scrapedData.brand,
      specs: scrapedData.specs,
      variants: scrapedData.variants
    });
    
    return apiSuccess({
      originalUrl: url,
      title: aiFormatted.cleanTitle,
      description: aiFormatted.cleanDescription,
      features: aiFormatted.features,
      brand: scrapedData.brand,
      specs: scrapedData.specs,
      variants: scrapedData.variants,
      videoUrl: scrapedData.videoUrl,
      images: scrapedData.images
    });
  },
  {
    auth: "admin"
  }
);
