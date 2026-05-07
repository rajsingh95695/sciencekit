import process from "node:process";

import mongoose from "mongoose";

const slugify = (input) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required to seed starter catalog data.");
}

await mongoose.connect(process.env.MONGODB_URI);

const productSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const categorySchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const bannerSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const blogSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const faqSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", blogSchema);
const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", faqSchema);

const categories = [
  { name: "Arduino", slug: "arduino", image: "" },
  { name: "ESP32", slug: "esp32", image: "" },
  { name: "IoT", slug: "iot", image: "" },
  { name: "Robotics", slug: "robotics", image: "" }
];

const products = [
  {
    name: "Smart Home Automation Board",
    description: "<p>ESP32-powered home automation project with relay control and category-ready product presentation.</p>",
    category: "esp32",
    subcategory: "automation",
    price: 4499,
    discountPrice: 3999,
    stock: 20,
    images: [{ url: "/catalog/esp32.svg" }],
    difficulty: "Medium",
    componentsIncluded: ["ESP32", "Relay module", "Power supply"],
    tags: ["esp32", "iot", "home automation"],
    featured: true,
    trendingScore: 12
  },
  {
    name: "Line Follower Robot",
    description: "<p>Readymade robotics kit with sensors, motor control, and ready-to-order product packaging.</p>",
    category: "robotics",
    subcategory: "autonomous",
    price: 3599,
    discountPrice: 3199,
    stock: 14,
    images: [{ url: "/catalog/robotics.svg" }],
    difficulty: "Easy",
    componentsIncluded: ["Motor driver", "IR sensor array", "Chassis"],
    tags: ["robotics", "school project"],
    featured: true,
    trendingScore: 9
  }
];

const blogPosts = [
  {
    title: "How to choose the right electronics project for your category and budget",
    slug: "choose-final-year-electronics-project",
    excerpt: "A practical guide to selecting products that balance cost, feasibility, and buyer intent.",
    content: "<p>Choosing the right project means balancing category fit, budget, component availability, and target customer requirement.</p>",
    published: true,
    featured: true,
    tags: ["college", "electronics", "project selection"]
  }
];

const faqs = [
  {
    question: "Do the project kits come assembled?",
    answer: "Yes. ScienceKit focuses on readymade and dispatch-ready project builds.",
    active: true,
    order: 1
  },
  {
    question: "Can I request custom modifications?",
    answer: "Yes. Use the contact page for feature additions, quantity orders, or project adaptations.",
    active: true,
    order: 2
  }
];

const banners = [
  {
    title: "Ready-to-order Arduino and IoT projects",
    subtitle: "Single-vendor quality, structured product listing, and fast dispatch.",
    image: "/catalog/arduino.svg",
    link: "/products",
    active: true
  }
];

for (const category of categories) {
  await Category.findOneAndUpdate({ slug: category.slug }, category, { upsert: true, returnDocument: "after" });
}

for (const product of products) {
  const slug = slugify(product.name);
  await Product.findOneAndUpdate({ slug }, { ...product, slug }, { upsert: true, returnDocument: "after" });
}

for (const post of blogPosts) {
  await BlogPost.findOneAndUpdate({ slug: post.slug }, post, { upsert: true, returnDocument: "after" });
}

for (const faq of faqs) {
  await FAQ.findOneAndUpdate({ question: faq.question }, faq, { upsert: true, returnDocument: "after" });
}

for (const banner of banners) {
  await Banner.findOneAndUpdate({ title: banner.title }, banner, { upsert: true, returnDocument: "after" });
}

console.log("Starter catalog content seeded.");
await mongoose.disconnect();
