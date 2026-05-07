import { NextRequest } from "next/server";

import { ForbiddenError } from "@/lib/errors";

export function verifyCsrf(request: NextRequest) {
  const cookieToken = request.cookies.get("csrf-token")?.value;
  const headerToken = request.headers.get("x-csrf-token");

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    throw new ForbiddenError("Invalid CSRF token.");
  }
}
