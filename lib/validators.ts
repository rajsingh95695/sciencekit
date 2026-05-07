import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid identifier.");

export const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(2),
  phone: z.string().min(10).max(15),
  line1: z.string().min(4),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(4).max(10),
  country: z.string().default("India"),
  isDefault: z.boolean().optional()
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(15).optional().default(""),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must contain an uppercase letter.")
    .regex(/[a-z]/, "Password must contain a lowercase letter.")
    .regex(/\d/, "Password must contain a number."),
  confirmPassword: z.string().min(8)
}).refine((value) => value.password === value.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match."
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must contain an uppercase letter.")
    .regex(/[a-z]/, "Password must contain a lowercase letter.")
    .regex(/\d/, "Password must contain a number.")
});

export const productSchema = z.object({
  name: z.string().min(3),
  slug: z.string().optional(),
  description: z.string().min(20),
  category: z.string().min(2),
  subcategory: z.string().optional().default(""),
  price: z.number().min(0),
  discountPrice: z.number().min(0).nullable().optional(),
  stock: z.number().int().min(0),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string().optional(),
        alt: z.string().optional()
      })
    )
    .default([]),
  videoUrl: z.string().optional().default(""),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  componentsIncluded: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  brand: z.string().optional().default(""),
  variants: z.array(z.any()).optional().default([]),
  specs: z.record(z.string(), z.string()).optional().default({}),
  featured: z.boolean().default(false),
  trendingScore: z.number().default(0),
  originalUrl: z.string().url().optional().or(z.literal("")),
  isDraft: z.boolean().default(false)
});

export const bulkProductSchema = z.array(productSchema).min(1);

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  image: z.string().optional().default(""),
  parentCategory: z.string().nullable().optional()
});

export const reviewSchema = z.object({
  productId: objectIdSchema,
  rating: z.number().min(1).max(5),
  comment: z.string().min(8)
});

export const couponSchema = z.object({
  code: z.string().min(3).max(24),
  discountType: z.enum(["percentage", "fixed"]),
  value: z.number().min(0),
  expiryDate: z.string().min(5),
  usageLimit: z.number().int().min(1).default(1),
  active: z.boolean().default(true)
});

export const bannerSchema = z.object({
  title: z.string().min(3),
  subtitle: z.string().optional().default(""),
  image: z.string().url(),
  link: z.string().min(1),
  active: z.boolean().default(true)
});

export const faqSchema = z.object({
  question: z.string().min(8),
  answer: z.string().min(10),
  category: z.string().default("General"),
  active: z.boolean().default(true),
  order: z.number().int().default(0)
});

export const blogPostSchema = z.object({
  title: z.string().min(8),
  slug: z.string().optional(),
  excerpt: z.string().min(24),
  content: z.string().min(80),
  coverImage: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true)
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  subject: z.string().min(4),
  message: z.string().min(20)
});

export const stockAlertSchema = z.object({
  email: z.string().email(),
  productId: objectIdSchema
});

export const wishlistMutationSchema = z.object({
  productId: objectIdSchema
});

export const cartItemSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().int().min(1).max(50)
});

export const cartMutationSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().int().min(1).max(50).default(1)
});

export const cartMergeSchema = z.object({
  items: z.array(cartItemSchema).default([])
});

export const couponValidationSchema = z.object({
  code: z.string().min(2),
  subtotal: z.number().min(0)
});

export const checkoutEstimateSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  paymentMethod: z.enum(["razorpay", "cashfree", "cod"]),
  address: addressSchema
});

export const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  address: addressSchema,
  paymentMethod: z.enum(["razorpay", "cashfree", "cod"]),
  couponCode: z.string().optional(),
  paymentId: z.string().optional(),
  paymentOrderId: z.string().optional(),
  paymentSignature: z.string().optional()
});

export const updateOrderSchema = z.object({
  orderStatus: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  shippingTrackingId: z.string().optional()
});

export const userRoleSchema = z.object({
  role: z.enum(["user", "admin"])
});
