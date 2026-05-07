import { apiSuccess, withApiHandler } from "@/lib/api";
import { getSessionUser, sanitizeUser } from "@/lib/auth";
import User from "@/models/User";

export const GET = withApiHandler(
  async () => {
    const session = await getSessionUser();

    if (!session) {
      return apiSuccess({ user: null });
    }

    const user = await User.findById(session.id);

    return apiSuccess({
      user: user ? sanitizeUser(user) : null
    });
  },
  {
    auth: "public",
    csrf: false
  }
);
