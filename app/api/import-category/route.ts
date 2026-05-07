import { NextRequest } from "next/server";
import { z } from "zod";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { scrapeCategoryUrls } from "@/lib/scraper";
import Product from "@/models/Product";

const categoryImportSchema = z.object({
  url: z.string().url()
});

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const { url } = categoryImportSchema.parse(await parseJson(request));
    
    // 1. Scrape URLs from the category page
    const links = await scrapeCategoryUrls(url);
    if (!links || links.length === 0) {
      throw new Error("Could not find any valid product links on this page.");
    }
    
    // 2. Filter out already imported URLs
    const existingProducts = await Product.find({ 
      originalUrl: { $in: links } 
    }).select("originalUrl").lean();
    
    const existingUrls = existingProducts.map((p) => p.originalUrl);
    const newLinks = links.filter((link) => !existingUrls.includes(link));
    
    return apiSuccess({
      totalFound: links.length,
      alreadyImported: existingUrls.length,
      toImport: newLinks
    });
  },
  {
    auth: "admin"
  }
);
