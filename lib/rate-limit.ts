import { createHash } from "node:crypto";

import { NextRequest } from "next/server";

import RateLimit from "@/models/RateLimit";

export async function enforceRateLimit(
  request: NextRequest,
  options: {
    bucket: string;
    limit: number;
    windowMs: number;
  }
) {
  const ip =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const bucketStart = Math.floor(Date.now() / options.windowMs) * options.windowMs;
  const rawKey = `${options.bucket}:${ip}:${bucketStart}`;
  const key = createHash("sha256").update(rawKey).digest("hex");

  const doc = await RateLimit.findOneAndUpdate(
    { key },
    {
      $setOnInsert: {
        key,
        bucket: options.bucket,
        ip,
        expiresAt: new Date(bucketStart + options.windowMs)
      },
      $inc: {
        count: 1
      }
    },
    {
      returnDocument: "after",
      upsert: true
    }
  );

  if (doc.count > options.limit) {
    const retryAfter = Math.ceil((doc.expiresAt.getTime() - Date.now()) / 1000);
    const error = new Error("Too many requests.");
    Object.assign(error, { statusCode: 429, retryAfter });
    throw error;
  }
}
