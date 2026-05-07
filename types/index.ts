export type Role = "user" | "admin";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type PaymentMethod = "razorpay" | "cashfree" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Address {
  label?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface MediaAsset {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  difficulty?: Difficulty;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  featured?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "trending";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface DashboardMetrics {
  revenue: number;
  orderCount: number;
  userCount: number;
  averageOrderValue: number;
  pendingOrders: number;
  lowStockProducts: number;
}
