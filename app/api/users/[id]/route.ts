import { NextRequest } from "next/server";

import { apiSuccess, parseJson, withApiHandler } from "@/lib/api";
import { NotFoundError } from "@/lib/errors";
import { logAdminAction } from "@/lib/logger";
import { userRoleSchema } from "@/lib/validators";
import User from "@/models/User";

export const PATCH = withApiHandler(
  async (request: NextRequest, context) => {
    const { id } = await context.params;
    const payload = userRoleSchema.parse(await parseJson(request));
    const user = await User.findByIdAndUpdate(id, payload, {
      returnDocument: "after"
    }).select("-password -refreshTokens -passwordResetToken -passwordResetExpires");

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    await logAdminAction({
      adminId: context.currentUser!.id,
      action: "update_user_role",
      resource: "user",
      resourceId: id,
      payload
    });

    return apiSuccess(user);
  },
  {
    auth: "admin"
  }
);
