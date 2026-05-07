import axios from 'axios';
import * as cheerio from 'cheerio';
import { randomDelay, getRandomUserAgent } from './queue';

export async function crawlCategory(categoryUrl: string): Promise<string[]> {
  let productLinks: string[] = [];
  let nextPage: string | null = categoryUrl;
  let visited = new Set<string>();
  while (nextPage && !visited.has(nextPage)) {
    visited.add(nextPage);
    const html = await fetchWithAntiBlock(nextPage);
    const $ = cheerio.load(html);
    // TODO: Extract product links for this page
    const links = extractProductLinks($, nextPage);
    productLinks.push(...links);
    // TODO: Detect next page link
    nextPage = extractNextPage($, nextPage);
    await randomDelay();
  }
  return Array.from(new Set(productLinks));
}

async function fetchWithAntiBlock(url: string): Promise<string> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await axios.get(url, {
        headers: { 'User-Agent': getRandomUserAgent() },
        timeout: 15000,
      });
      return res.data;
    } catch (err) {
      await randomDelay();
    }
  }
  throw new Error('Failed to fetch: ' + url);
}


// Generic product link extraction (update for your target site)
function extractProductLinks($: cheerio.CheerioAPI, baseUrl: string): string[] {
  // Example: all links with class 'product-link' or inside product grid
  const links: string[] = [];
  $('a.product-link, .product-grid a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !href.startsWith('#')) {
      links.push(new URL(href, baseUrl).toString());
    }
  });
  return links;
}


// Generic next page extraction (update for your target site)
function extractNextPage($: cheerio.CheerioAPI, baseUrl: string): string | null {
  // Example: next page link with rel="next" or class 'next'
  let nextHref = $('a[rel="next"]').attr('href') || $('a.next').attr('href');
  if (nextHref) {
    return new URL(nextHref, baseUrl).toString();
  }
  return null;
}
