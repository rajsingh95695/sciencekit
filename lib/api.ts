import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdminSession, requireUserSession } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";
import { connectToDB } from "@/lib/db";
import { ApiError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { enforceRateLimit } from "@/lib/rate-limit";
import type { SessionUser } from "@/types";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

type AuthMode = "public" | "user" | "admin";

export type RouteContext<P = Record<string, string>> = {
  params: Promise<P>;
  currentUser?: SessionUser;
};

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(
    {
      success: true,
      data
    },
    init
  );
}

function handleRouteError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.details
      },
      {
        status: error.statusCode
      }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed.",
        details: error.issues
      },
      {
        status: 400
      }
    );
  }

  if (
    typeof error === "object" &&
    error &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    const statusCode = error.statusCode as number;
    const message = "message" in error ? String(error.message) : "Request failed.";
    const response = NextResponse.json(
      {
        success: false,
        error: message
      },
      {
        status: statusCode
      }
    );

    if ("retryAfter" in error && typeof error.retryAfter === "number") {
      response.headers.set("Retry-After", String(error.retryAfter));
    }

    return response;
  }

  logger.error("Unhandled route error.", error);
  return NextResponse.json(
    {
      success: false,
      error: "Something went wrong."
    },
    {
      status: 500
    }
  );
}

export function withApiHandler<P = Record<string, string>>(
  handler: (request: NextRequest, context: RouteContext<P>) => Promise<NextResponse>,
  options?: {
    auth?: AuthMode;
    csrf?: boolean;
    rateLimit?: false | { bucket: string; limit: number; windowMs: number };
  }
) {
  return async (request: NextRequest, context: { params: Promise<P> }) => {
    try {
      await connectToDB();

      if (options?.rateLimit !== false) {
        await enforceRateLimit(request, {
          bucket: options?.rateLimit?.bucket || request.nextUrl.pathname,
          limit: options?.rateLimit?.limit || 80,
          windowMs: options?.rateLimit?.windowMs || 60_000
        });
      }

      if (options?.csrf !== false && !SAFE_METHODS.has(request.method)) {
        verifyCsrf(request);
      }

      let currentUser: SessionUser | undefined;

      if (options?.auth === "user") {
        currentUser = await requireUserSession();
      }

      if (options?.auth === "admin") {
        currentUser = await requireAdminSession();
      }

      return await handler(request, {
        ...context,
        currentUser
      });
    } catch (error) {
      return handleRouteError(error);
    }
  };
}

export async function parseJson<T>(request: NextRequest) {
  return (await request.json()) as T;
}
