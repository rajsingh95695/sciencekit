import * as cheerio from "cheerio";

export async function scrapeProduct(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      },
      next: { revalidate: 0 }
    });
    
    if (!response.ok) throw new Error("Failed to fetch page");
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Clean up noisy tags
    $("script, style, noscript, iframe, svg, nav, footer, header").remove();
    
    // OpenGraph Fallbacks
    const ogTitle = $("meta[property='og:title']").attr("content");
    const ogImage = $("meta[property='og:image']").attr("content");
    const ogDesc = $("meta[property='og:description']").attr("content");
    
    // Title Extraction
    const title = $("#productTitle").text().trim() || ogTitle || $("title").text().trim();
    
    // Description Extraction
    let description = $("#feature-bullets").html() || $("#productDescription").html() || ogDesc || "";
    description = description.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    
    // Brand Extraction
    const brand = $("#bylineInfo").text().trim() || $(".brand-link").text().trim() || "";

    // Ratings Extraction
    let ratingsText = $("#acrPopover").attr("title") || $(".a-icon-star .a-icon-alt").first().text() || "";
    const ratings = parseFloat(ratingsText.split(" ")[0]) || 0;

    // Specifications Extraction
    const specs: Record<string, string> = {};
    $("#productDetails_techSpec_section_1 tr").each((_, row) => {
      const key = $(row).find("th").text().trim();
      const val = $(row).find("td").text().trim();
      if (key && val) {
        specs[key] = val.replace(/\s+/g, " ");
      }
    });

    // Variants Extraction (Basic dropdowns or list items)
    const variants: string[] = [];
    $("#twister ul li").each((_, li) => {
      const variantText = $(li).text().trim().replace(/\s+/g, " ");
      if (variantText) variants.push(variantText);
    });

    // Video Extraction
    let videoUrl = "";
    $("video").each((_, vid) => {
      const src = $(vid).attr("src") || $(vid).find("source").attr("src");
      if (src) videoUrl = src;
    });
    
    // Image Extraction
    const images: string[] = [];
    if (ogImage) images.push(ogImage);
    
    $("img").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("data-old-hires");
      if (src && src.startsWith("http") && !src.includes("sprite") && !src.includes("icon") && !src.includes("logo")) {
        images.push(src);
      }
    });
    
    const uniqueImages = Array.from(new Set(images)).slice(0, 5);
    
    return {
      title,
      description,
      brand,
      ratings,
      specs,
      variants,
      videoUrl,
      images: uniqueImages,
      rawHtml: html.slice(0, 15000)
    };
  } catch (error) {
    console.error("Scraping error:", error);
    return null;
  }
}

export async function scrapeCategoryUrls(categoryUrl: string) {
  try {
    const response = await fetch(categoryUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      next: { revalidate: 0 }
    });
    
    if (!response.ok) throw new Error("Failed to fetch category page");
    
    const html = await response.text();
    const $ = cheerio.load(html);
    const baseUrl = new URL(categoryUrl).origin;
    const links: string[] = [];

    $("a").each((_, el) => {
      let href = $(el).attr("href");
      if (!href || href === "#" || href.startsWith("javascript")) return;
      
      if (href.startsWith("/")) href = baseUrl + href;
      if (!href.startsWith("http")) return;

      const lowerHref = href.toLowerCase();
      // Common product URL patterns
      if (
        lowerHref.includes("/p/") ||
        lowerHref.includes("/dp/") ||
        lowerHref.includes("/product/") ||
        lowerHref.includes("/item/") ||
        lowerHref.includes("?pid=") ||
        lowerHref.includes("-p-")
      ) {
        // Clean URL to prevent duplicates from tracking params
        const cleanHref = href.split("#")[0].split("?")[0];
        if (cleanHref !== categoryUrl) {
          links.push(cleanHref);
        }
      }
    });

    return Array.from(new Set(links)).slice(0, 100);
  } catch (error) {
    console.error("Category Scrape Error:", error);
    return [];
  }
}
