import { apiSuccess, withApiHandler } from "@/lib/api";
import { getProductBySlug } from "@/lib/data";
import { NotFoundError } from "@/lib/errors";

export const GET = withApiHandler(
  async (_request, { params }) => {
    const { slug } = await params;
    const data = await getProductBySlug(slug);

    if (!data) {
      throw new NotFoundError("Product not found.");
    }

    return apiSuccess(data);
  },
  {
    auth: "public",
    csrf: false
  }
);
