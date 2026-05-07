import mongoose from "mongoose";

import { getDatabaseEnv } from "@/lib/env";

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cache = global.mongooseCache || { conn: null, promise: null };

global.mongooseCache = cache;

export async function connectToDB() {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    const { MONGODB_URI: uri } = getDatabaseEnv();

    cache.promise = mongoose.connect(uri, {
      autoIndex: process.env.NODE_ENV !== "production"
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
