// Worker script to process bulk import jobs
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import mongoose from 'mongoose';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sciencekit';
const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error('REDIS_URL is required to start the bulk import worker.');
}

// Connect to MongoDB
await mongoose.connect(MONGODB_URI);
console.log('Connected to MongoDB');

// Create Redis connection
const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Import schemas (we need to define them here since we can't easily import TS files)
const importJobSchema = new mongoose.Schema({
  url: String,
  targetCategory: String,
  targetSubcategory: String,
  status: { type: String, default: 'pending' },
  totalProducts: { type: Number, default: 0 },
  importedCount: { type: Number, default: 0 },
  skippedCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  logs: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: [String],
  brand: String,
  specs: Object,
  variants: [String],
  slug: String,
  originalUrl: String,
  price: Number,
  category: String,
  subcategory: String
});

const ImportJob = mongoose.models.ImportJob || mongoose.model('ImportJob', importJobSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Helper function to extract product data
async function extractProductData(link) {
  try {
    const res = await axios.get(link, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BulkImporter/1.0)' },
      timeout: 15000,
    });
    const $ = cheerio.load(res.data);
    const title = $('h1.product-title').text().trim() || $('title').text().trim();
    const description = $('.product-description').html() || '';
    const images = [];
    $('img.product-image, .product-gallery img').each((_, el) => {
      const src = $(el).attr('src');
      if (src) images.push(src.startsWith('http') ? src : new URL(src, link).toString());
    });
    const brand = $('[itemprop="brand"]').text().trim() || '';
    const specs = {};
    $('.specs-table tr').each((_, el) => {
      const key = $(el).find('th,td').first().text().trim();
      const val = $(el).find('td').last().text().trim();
      if (key && val) specs[key] = val;
    });
    const variants = [];
    $('.variant-option').each((_, el) => {
      const v = $(el).text().trim();
      if (v) variants.push(v);
    });
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + uuidv4().slice(0, 8);
    
    return {
      title,
      description,
      images,
      brand,
      specs,
      variants,
      slug,
      originalUrl: link,
      price: null,
    };
  } catch (err) {
    console.error(`Failed to extract data from ${link}:`, err.message);
    return null;
  }
}

// Helper function to crawl category
async function crawlCategory(url) {
  try {
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BulkImporter/1.0)' },
      timeout: 15000,
    });
    const $ = cheerio.load(res.data);
    const links = [];
    $('a[href*="/products/"], a[href*="/product/"], a[href*="/item/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        const fullUrl = href.startsWith('http') ? href : new URL(href, url).toString();
        if (!links.includes(fullUrl)) links.push(fullUrl);
      }
    });
    return links.slice(0, 50); // Limit to 50 products per category
  } catch (err) {
    console.error('Failed to crawl category:', err.message);
    return [];
  }
}

// Helper function to check for duplicates
async function isDuplicate({ slug, title, url }) {
  const existing = await Product.findOne({
    $or: [
      { slug },
      { originalUrl: url },
      { title: { $regex: new RegExp('^' + title.slice(0, 20), 'i') } }
    ]
  });
  return !!existing;
}

// Create the worker
const worker = new Worker('importQueue', async (job) => {
  const { jobId, url, targetCategory, targetSubcategory } = job.data;
  const importJob = await ImportJob.findById(jobId);
  if (!importJob) {
    console.error(`Job ${jobId} not found`);
    return;
  }
  
  console.log(`Starting import job ${jobId} for ${url}`);
  
  try {
    importJob.status = 'running';
    await importJob.save();
    
    const productLinks = await crawlCategory(url);
    importJob.totalProducts = productLinks.length;
    await importJob.save();
    
    console.log(`Found ${productLinks.length} products`);
    
    for (const link of productLinks) {
      const productData = await extractProductData(link);
      if (!productData) {
        importJob.failedCount++;
        importJob.logs.push(`Failed: ${link}`);
        await importJob.save();
        continue;
      }
      
      const duplicate = await isDuplicate({ 
        slug: productData.slug, 
        title: productData.title, 
        url: link 
      });
      
      if (duplicate) {
        importJob.skippedCount++;
        importJob.logs.push(`Skipped duplicate: ${link}`);
        await importJob.save();
        continue;
      }
      
      // Add category info
      productData.category = targetCategory;
      productData.subcategory = targetSubcategory || '';
      
      await Product.create(productData);
      importJob.importedCount++;
      importJob.logs.push(`Imported: ${link}`);
      await importJob.save();
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    importJob.status = 'completed';
    await importJob.save();
    console.log(`Job ${jobId} completed`);
    
  } catch (err) {
    console.error(`Job ${jobId} failed:`, err.message);
    importJob.status = 'failed';
    importJob.logs.push('Fatal error: ' + err.message);
    await importJob.save();
  }
}, { 
  connection,
  concurrency: 2 
});

console.log('Worker started, waiting for jobs...');

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  await worker.close();
  await mongoose.disconnect();
  process.exit(0);
});
