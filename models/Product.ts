import mongoose, { Schema, type InferSchemaType } from "mongoose";

const MediaSchema = new Schema(
  {
    url: {
      type: String,
      required: true
    },
    publicId: String,
    alt: String
  },
  {
    _id: false
  }
);

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    subcategory: {
      type: String,
      default: ""
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    discountPrice: {
      type: Number,
      min: 0,
      default: null
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    images: {
      type: [MediaSchema],
      default: []
    },
    videoUrl: {
      type: String,
      default: ""
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true
    },
    componentsIncluded: {
      type: [String],
      default: []
    },
    tags: {
      type: [String],
      default: []
    },
    brand: {
      type: String,
      default: ""
    },
    variants: {
      type: [Schema.Types.Mixed],
      default: []
    },
    specs: {
      type: Map,
      of: String,
      default: {}
    },
    ratings: {
      type: Number,
      default: 0
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    trendingScore: {
      type: Number,
      default: 0
    },
    originalUrl: {
      type: String,
      default: ""
    },
    isDraft: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

ProductSchema.index({
  name: "text",
  description: "text",
  category: "text",
  subcategory: "text",
  tags: "text"
});

export type ProductDocument = InferSchemaType<typeof ProductSchema>;

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
