import { apiSuccess, withApiHandler } from "@/lib/api";
import { refreshSessionFromCookie } from "@/lib/auth";

export const POST = withApiHandler(
  async () => {
    const user = await refreshSessionFromCookie();
    return apiSuccess({ user });
  },
  {
    auth: "public",
    csrf: false,
    rateLimit: {
      bucket: "auth-refresh",
      limit: 30,
      windowMs: 60_000
    }
  }
);
