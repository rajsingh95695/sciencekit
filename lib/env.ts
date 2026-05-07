import { z } from "zod";

const databaseEnvSchema = z.object({
  MONGODB_URI: z.string().min(1)
});

const authEnvSchema = z.object({
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32)
});

const razorpayEnvSchema = z.object({
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1)
});

const cashfreeEnvSchema = z.object({
  CASHFREE_APP_ID: z.string().min(1),
  CASHFREE_SECRET_KEY: z.string().min(1)
});

const cloudinaryEnvSchema = z.object({
  CLOUDINARY_URL: z.string().min(1)
});

const emailEnvSchema = z.object({
  EMAIL_SERVER: z.string().min(1)
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional()
});

let parsedDatabaseEnv: z.infer<typeof databaseEnvSchema> | null = null;
let parsedAuthEnv: z.infer<typeof authEnvSchema> | null = null;
let parsedRazorpayEnv: z.infer<typeof razorpayEnvSchema> | null = null;
let parsedCashfreeEnv: z.infer<typeof cashfreeEnvSchema> | null = null;
let parsedCloudinaryEnv: z.infer<typeof cloudinaryEnvSchema> | null = null;
let parsedEmailEnv: z.infer<typeof emailEnvSchema> | null = null;
let parsedClientEnv: z.infer<typeof clientEnvSchema> | null = null;

export function getDatabaseEnv() {
  if (!parsedDatabaseEnv) {
    parsedDatabaseEnv = databaseEnvSchema.parse({
      MONGODB_URI: process.env.MONGODB_URI
    });
  }

  return parsedDatabaseEnv;
}

export function getAuthEnv() {
  if (!parsedAuthEnv) {
    parsedAuthEnv = authEnvSchema.parse({
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET
    });
  }

  return parsedAuthEnv;
}

export function getRazorpayEnv() {
  if (!parsedRazorpayEnv) {
    parsedRazorpayEnv = razorpayEnvSchema.parse({
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET
    });
  }

  return parsedRazorpayEnv;
}

export function getCashfreeEnv() {
  if (!parsedCashfreeEnv) {
    parsedCashfreeEnv = cashfreeEnvSchema.parse({
      CASHFREE_APP_ID: process.env.CASHFREE_APP_ID,
      CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY
    });
  }

  return parsedCashfreeEnv;
}

export function getCloudinaryEnv() {
  if (!parsedCloudinaryEnv) {
    parsedCloudinaryEnv = cloudinaryEnvSchema.parse({
      CLOUDINARY_URL: process.env.CLOUDINARY_URL
    });
  }

  return parsedCloudinaryEnv;
}

export function getEmailEnv() {
  if (!parsedEmailEnv) {
    parsedEmailEnv = emailEnvSchema.parse({
      EMAIL_SERVER: process.env.EMAIL_SERVER
    });
  }

  return parsedEmailEnv;
}

export function getClientEnv() {
  if (!parsedClientEnv) {
    parsedClientEnv = clientEnvSchema.parse({
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID
    });
  }

  return parsedClientEnv;
}
