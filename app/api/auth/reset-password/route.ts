import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { hashOpaqueToken, hashPassword } from "@/lib/auth";
import { ValidationError } from "@/lib/errors";
import { resetPasswordSchema } from "@/lib/validators";
import User from "@/models/User";

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const payload = resetPasswordSchema.parse(await parseJson(request));
    const tokenHash = hashOpaqueToken(payload.token);
    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: {
        $gt: new Date()
      }
    });

    if (!user) {
      throw new ValidationError("Reset token is invalid or has expired.");
    }

    user.password = await hashPassword(payload.password);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = [];
    await user.save();

    return apiSuccess({
      message: "Password updated successfully."
    });
  },
  {
    auth: "public",
    rateLimit: {
      bucket: "auth-reset-password",
      limit: 10,
      windowMs: 60_000
    }
  }
);
