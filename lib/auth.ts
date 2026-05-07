import { createHash, randomBytes } from "node:crypto";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { getAuthEnv } from "@/lib/env";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";
import type { SessionUser } from "@/types";
import User from "@/models/User";

export const ACCESS_COOKIE = "sk_access";
export const REFRESH_COOKIE = "sk_refresh";
const ACCESS_TTL_SECONDS = 60 * 15;
const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 30;

type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  role: "user" | "admin";
};

export function hashOpaqueToken(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function getCookieOptions(maxAge: number, httpOnly = true) {
  return {
    path: "/",
    maxAge,
    httpOnly,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };
}

function toSessionUser(payload: JwtPayload): SessionUser {
  return {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    role: payload.role
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function signAccessToken(payload: JwtPayload) {
  const env = getAuthEnv();
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: ACCESS_TTL_SECONDS
  });
}

function signRefreshToken(userId: string) {
  const env = getAuthEnv();
  return jwt.sign(
    {
      sub: userId,
      type: "refresh"
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: REFRESH_TTL_SECONDS
    }
  );
}

export function verifyAccessToken(token: string) {
  const env = getAuthEnv();
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
  const env = getAuthEnv();
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload & {
    sub: string;
    type: "refresh";
  };
}

export function sanitizeUser(user: {
  _id: { toString(): string };
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  addresses?: unknown[];
  wishlist?: unknown[];
  cart?: unknown[];
  saveForLater?: unknown[];
}) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    addresses: user.addresses || [],
    wishlist: user.wishlist || [],
    cart: user.cart || [],
    saveForLater: user.saveForLater || []
  };
}

async function persistRefreshToken(userId: string, refreshToken: string) {
  const refreshTokenHash = hashOpaqueToken(refreshToken);

  await User.findByIdAndUpdate(userId, {
    $pull: {
      refreshTokens: {
        expiresAt: {
          $lt: new Date()
        }
      }
    }
  });

  await User.findByIdAndUpdate(userId, {
    $push: {
      refreshTokens: {
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000),
        createdAt: new Date()
      }
    }
  });
}

export async function setAuthCookies(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, tokens.accessToken, getCookieOptions(ACCESS_TTL_SECONDS));
  cookieStore.set(REFRESH_COOKIE, tokens.refreshToken, getCookieOptions(REFRESH_TTL_SECONDS));
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}

export async function createSession(user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: "user" | "admin";
}) {
  const userId = user._id.toString();
  const accessToken = signAccessToken({
    sub: userId,
    email: user.email,
    name: user.name,
    role: user.role
  });
  const refreshToken = signRefreshToken(userId);

  await persistRefreshToken(userId, refreshToken);
  await setAuthCookies({ accessToken, refreshToken });

  return {
    accessToken,
    refreshToken
  };
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    return toSessionUser(verifyAccessToken(token));
  } catch {
    return null;
  }
}

export async function requireUserSession() {
  const user = await getSessionUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}

export async function requireAdminSession() {
  const user = await requireUserSession();

  if (user.role !== "admin") {
    throw new ForbiddenError();
  }

  return user;
}

export async function refreshSessionFromCookie() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    throw new UnauthorizedError("Refresh token missing.");
  }

  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.sub);

  if (!user) {
    throw new UnauthorizedError("Invalid refresh session.");
  }

  const refreshTokenHash = hashOpaqueToken(refreshToken);
  const tokenExists = user.refreshTokens.some(
    (item: { tokenHash: string; expiresAt: Date }) =>
      item.tokenHash === refreshTokenHash && item.expiresAt.getTime() > Date.now()
  );

  if (!tokenExists) {
    throw new UnauthorizedError("Refresh token expired.");
  }

  user.refreshTokens = user.refreshTokens.filter(
    (item: { tokenHash: string; expiresAt: Date }) =>
      item.tokenHash !== refreshTokenHash && item.expiresAt.getTime() > Date.now()
  );
  await user.save();

  await createSession(user);
  return sanitizeUser(user);
}

export function createPasswordResetToken() {
  const rawToken = randomBytes(32).toString("hex");
  return {
    rawToken,
    tokenHash: hashOpaqueToken(rawToken),
    expiresAt: new Date(Date.now() + 1000 * 60 * 30)
  };
}

export function getCsrfCookieName() {
  return "csrf-token";
}
