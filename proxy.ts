import { NextRequest, NextResponse } from "next/server";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("Origin-Agent-Cluster", "?1");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  return response;
}

export function proxy(request: NextRequest) {
  const response = applySecurityHeaders(NextResponse.next());

  if (!request.cookies.has("csrf-token") && SAFE_METHODS.has(request.method)) {
    response.cookies.set("csrf-token", crypto.randomUUID(), {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production"
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"]
};
