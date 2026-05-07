import { apiSuccess, withApiHandler } from "@/lib/api";
import { getCategoryTree } from "@/lib/data";

export const GET = withApiHandler(
  async () => {
    const tree = await getCategoryTree();
    return apiSuccess(tree);
  },
  {
    auth: "public",
    csrf: false
  }
);
