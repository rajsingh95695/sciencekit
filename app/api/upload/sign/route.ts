import { apiSuccess, withApiHandler } from "@/lib/api";
import { createUploadSignature } from "@/lib/cloudinary";

export const POST = withApiHandler(
  async () => {
    return apiSuccess(createUploadSignature());
  },
  {
    auth: "admin"
  }
);
