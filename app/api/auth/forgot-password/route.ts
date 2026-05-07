import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { createPasswordResetToken } from "@/lib/auth";
import { getClientEnv } from "@/lib/env";
import { sendPasswordResetEmail } from "@/lib/mail";
import { forgotPasswordSchema } from "@/lib/validators";
import User from "@/models/User";

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const payload = forgotPasswordSchema.parse(await parseJson(request));
    const user = await User.findOne({ email: payload.email });

    if (user) {
      const resetToken = createPasswordResetToken();
      user.passwordResetToken = resetToken.tokenHash;
      user.passwordResetExpires = resetToken.expiresAt;
      await user.save();

      const baseUrl = getClientEnv().NEXT_PUBLIC_BASE_URL;
      const resetUrl = `${baseUrl}/reset-password?token=${resetToken.rawToken}`;
      await sendPasswordResetEmail(user.email, resetUrl);
    }

    return apiSuccess({
      message: "If that email exists, a reset link has been sent."
    });
  },
  {
    auth: "public",
    rateLimit: {
      bucket: "auth-forgot-password",
      limit: 10,
      windowMs: 60_000
    }
  }
);
