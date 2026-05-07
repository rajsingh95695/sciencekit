import { apiSuccess, withApiHandler } from "@/lib/api";
import AdminLog from "@/models/AdminLog";

export const GET = withApiHandler(
  async () => {
    const logs = await AdminLog.find({}).sort({ createdAt: -1 }).limit(100).lean();
    return apiSuccess(logs);
  },
  {
    auth: "admin",
    csrf: false
  }
);
