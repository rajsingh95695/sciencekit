import { apiSuccess, withApiHandler } from "@/lib/api";
import User from "@/models/User";

export const GET = withApiHandler(
  async () => {
    const users = await User.find({})
      .select("-password -refreshTokens -passwordResetToken -passwordResetExpires")
      .sort({ createdAt: -1 })
      .lean();

    return apiSuccess(users);
  },
  {
    auth: "admin",
    csrf: false
  }
);
