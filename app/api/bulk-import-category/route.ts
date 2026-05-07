import { NextRequest } from "next/server";
import { z } from "zod";
import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { scrapeCategoryUrls, scrapeProduct } from "@/lib/scraper";
import { formatProductDataAI } from "@/lib/aiFormatter";
import Product from "@/models/Product";

const bulkImportSchema = z.object({
  url: z.string().url(),
  priceOverrides: z.record(z.string(), z.number()).optional(),
});

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const { url, priceOverrides } = bulkImportSchema.parse(await parseJson(request));
    // 1. Scrape all product links from the category
    const links = await scrapeCategoryUrls(url);
    if (!links || links.length === 0) {
      throw new Error("No product links found on this category page.");
    }
    // 2. Filter out already imported products
    const existingProducts = await Product.find({ originalUrl: { $in: links } }).select("originalUrl").lean();
    const existingUrls = existingProducts.map((p) => p.originalUrl);
    const newLinks = links.filter((link) => !existingUrls.includes(link));
    let imported = 0;
    let failed = 0;
    for (const link of newLinks) {
      try {
        // Throttle to avoid blocking
        await new Promise((res) => setTimeout(res, 1200));
        // Scrape product data
        const scrapedData = await scrapeProduct(link);
        if (!scrapedData || !scrapedData.title) continue;
        const aiFormatted = await formatProductDataAI({
          title: scrapedData.title,
          description: scrapedData.description,
          brand: scrapedData.brand,
          specs: scrapedData.specs,
          variants: scrapedData.variants,
        });
        // Prepare product payload
        // Price is set to null initially - use Bulk Price Editor to set prices
        const price = priceOverrides && priceOverrides[link] ? priceOverrides[link] : null;
        const payload = {
          name: aiFormatted.cleanTitle,
          slug: aiFormatted.cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          description: aiFormatted.cleanDescription,
          category: '',
          subcategory: '',
          price,
          discountPrice: price,
          stock: 10,
          difficulty: 'Medium',
          images: scrapedData.images || [],
          tags: aiFormatted.features || [],
          componentsIncluded: aiFormatted.features || [],
          brand: scrapedData.brand || '',
          videoUrl: scrapedData.videoUrl || '',
          variants: scrapedData.variants || [],
          featured: false,
          trendingScore: 0,
          originalUrl: link,
        };
        // Save product
        await Product.create(payload);
        imported++;
      } catch (err) {
        failed++;
      }
    }
    return apiSuccess({
      totalFound: links.length,
      alreadyImported: existingUrls.length,
      imported,
      failed,
    });
  },
  { auth: "admin" }
);
