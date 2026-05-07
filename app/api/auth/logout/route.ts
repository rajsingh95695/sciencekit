import { NextRequest } from "next/server";

import { apiSuccess, withApiHandler } from "@/lib/api";
import {
  clearAuthCookies,
  hashOpaqueToken,
  REFRESH_COOKIE,
  verifyRefreshToken
} from "@/lib/auth";
import User from "@/models/User";

export const POST = withApiHandler(
  async (request: NextRequest) => {
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        await User.findByIdAndUpdate(payload.sub, {
          $pull: {
            refreshTokens: {
              tokenHash: hashOpaqueToken(refreshToken)
            }
          }
        });
      } catch {
        // Ignore invalid refresh token on logout.
      }
    }

    await clearAuthCookies();
    return apiSuccess({ loggedOut: true });
  },
  {
    auth: "public"
  }
);
