import { v2 as cloudinary } from "cloudinary";

import { getCloudinaryEnv } from "@/lib/env";

process.env.CLOUDINARY_URL = process.env.CLOUDINARY_URL || getCloudinaryEnv().CLOUDINARY_URL;
cloudinary.config({ secure: true });

export function createUploadSignature(folder = "sciencekit") {
  const timestamp = Math.floor(Date.now() / 1000);
  const config = cloudinary.config();

  return {
    timestamp,
    folder,
    cloudName: config.cloud_name,
    apiKey: config.api_key,
    signature: cloudinary.utils.api_sign_request(
      {
        folder,
        timestamp
      },
      config.api_secret || ""
    )
  };
}

export default cloudinary;
