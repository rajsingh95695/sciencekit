import mongoose, { Schema, type InferSchemaType } from "mongoose";

const BannerSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: "/products"
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export type BannerDocument = InferSchemaType<typeof BannerSchema>;

const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);

export default Banner;
