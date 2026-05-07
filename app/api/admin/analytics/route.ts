import { apiSuccess, withApiHandler } from "@/lib/api";
import { getAdminDashboardData } from "@/lib/data";

export const GET = withApiHandler(
  async () => {
    return apiSuccess(await getAdminDashboardData());
  },
  {
    auth: "admin",
    csrf: false
  }
);
