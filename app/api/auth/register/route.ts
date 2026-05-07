import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { createSession, hashPassword, sanitizeUser } from "@/lib/auth";
import { ValidationError } from "@/lib/errors";
import { registerSchema } from "@/lib/validators";
import User from "@/models/User";

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const payload = registerSchema.parse(await parseJson(request));
    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
      throw new ValidationError("An account with this email already exists.");
    }

    const user = await User.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: await hashPassword(payload.password)
    });

    await createSession(user);

    return apiSuccess({
      user: sanitizeUser(user)
    });
  },
  {
    auth: "public",
    rateLimit: {
      bucket: "auth-register",
      limit: 10,
      windowMs: 60_000
    }
  }
);
