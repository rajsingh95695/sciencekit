import Product from "@/models/Product";
import Banner from "@/models/Banner";
import BlogPost from "@/models/BlogPost";
import FAQ from "@/models/FAQ";
import Category from "@/models/Category";
import Review from "@/models/Review";
import Order from "@/models/Order";
import User from "@/models/User";
import AdminLog from "@/models/AdminLog";
import { buildProductQuery, buildSort } from "@/lib/search";
import type { SearchFilters } from "@/types";

function fixId(obj: any) {
  if (!obj) return obj;
  return { ...obj, _id: obj._id?.toString?.() ?? obj._id };
}

export async function getHomePageData() {
  const [featuredProducts, trendingProducts, banners, blogPosts, faqs, categories] =
    await Promise.all([
      Product.find({ featured: true }).sort({ createdAt: -1 }).limit(8).lean(),
      Product.find({}).sort({ trendingScore: -1, createdAt: -1 }).limit(8).lean(),
      Banner.find({ active: true }).sort({ createdAt: -1 }).lean(),
      BlogPost.find({ published: true }).sort({ createdAt: -1 }).limit(3).lean(),
      FAQ.find({ active: true }).sort({ order: 1 }).limit(6).lean(),
      Category.find({}).sort({ createdAt: -1 }).limit(12).lean()
    ]);

  return {
    featuredProducts: featuredProducts.map(fixId),
    trendingProducts: trendingProducts.map(fixId),
    banners: banners.map(fixId),
    blogPosts: blogPosts.map(fixId),
    faqs: faqs.map(fixId),
    categories: categories.map(fixId)
  };
}

export async function getProducts(filters: SearchFilters) {
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const query = buildProductQuery(filters);

  const [items, total] = await Promise.all([
    Product.find(query)
      .sort(buildSort(filters.sort))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(query)
  ]);

  // Fix _id for all items
  const fixedItems = items.map(fixId);

  return {
    items: fixedItems,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
}

export async function getProductBySlug(slug: string) {
  const productDoc = await Product.findOne({ slug }).lean();

  if (!productDoc) {
    return null;
  }

  const [relatedProductsDocs, reviews] = await Promise.all([
    Product.find({
      _id: {
        $ne: productDoc._id
      },
      category: productDoc.category
    })
      .sort({ trendingScore: -1 })
      .limit(4)
      .lean(),
    Review.find({ productId: productDoc._id }).sort({ createdAt: -1 }).populate("userId", "name").lean()
  ]);

  // Fix _id fields
  const product = fixId(productDoc);
  const relatedProducts = relatedProductsDocs.map(fixId);

  return {
    product,
    relatedProducts,
    reviews
  };
}

export async function getAdminDashboardData() {
  const [revenueAgg, orderCount, userCount, pendingOrders, lowStockProducts, recentLogs] =
    await Promise.all([
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid"
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$totalAmount"
            },
            orders: {
              $sum: 1
            }
          }
        }
      ]),
      Order.countDocuments(),
      User.countDocuments(),
      Order.countDocuments({ orderStatus: { $in: ["pending", "processing"] } }),
      Product.countDocuments({ stock: { $lte: 5 } }),
      AdminLog.find({}).sort({ createdAt: -1 }).limit(10).lean()
    ]);

  const revenue = revenueAgg[0]?.total || 0;
  const paidOrders = revenueAgg[0]?.orders || 0;

  return {
    metrics: {
      revenue,
      orderCount,
      userCount,
      averageOrderValue: paidOrders ? revenue / paidOrders : 0,
      pendingOrders,
      lowStockProducts
    },
    recentLogs
  };
}

export async function getCategoryTree() {
  const categories = await Category.find({}).lean();
  const byParent = new Map<string, typeof categories>();

  categories.forEach((category) => {
    const key = category.parentCategory ? String(category.parentCategory) : "root";
    const siblings = byParent.get(key) || [];
    siblings.push(category);
    byParent.set(key, siblings);
  });

  type CategoryNode = (typeof categories)[number] & { children: CategoryNode[] };

  const buildTree = (parentKey = "root"): CategoryNode[] =>
    (byParent.get(parentKey) || []).map((category) => ({
      ...category,
      children: buildTree(String(category._id))
    }));

  return buildTree();
}
