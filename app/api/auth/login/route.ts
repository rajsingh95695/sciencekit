import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { comparePassword, createSession, sanitizeUser } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";
import { loginSchema } from "@/lib/validators";
import User from "@/models/User";

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const payload = loginSchema.parse(await parseJson(request));
    const user = await User.findOne({ email: payload.email });

    if (!user || !(await comparePassword(payload.password, user.password))) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    await createSession(user);

    return apiSuccess({
      user: sanitizeUser(user)
    });
  },
  {
    auth: "public",
    rateLimit: {
      bucket: "auth-login",
      limit: 15,
      windowMs: 60_000
    }
  }
);
