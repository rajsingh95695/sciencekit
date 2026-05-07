import { format } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatDate(value: Date | number | string, pattern = "dd MMM yyyy") {
  return format(new Date(value), pattern);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function unique<T>(items: T[]) {
  return [...new Set(items)];
}

export function extractText(input: string) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function getDiscountPercentage(price: number, discountPrice?: number | null) {
  if (!discountPrice || discountPrice >= price) {
    return 0;
  }

  return Math.round(((price - discountPrice) / price) * 100);
}

export function toNumber(input: string | null, fallback?: number) {
  if (!input) {
    return fallback;
  }

  const parsed = Number(input);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function buildAbsoluteUrl(pathname = "/") {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return new URL(pathname, base).toString();
}

export function makeTrackingId() {
  return `SK${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 900 + 100)}`;
}
