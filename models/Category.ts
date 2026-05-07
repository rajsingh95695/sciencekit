import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CategorySchema = new Schema(
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
    image: {
      type: String,
      default: ""
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null
    }
  },
  {
    timestamps: true
  }
);

export type CategoryDocument = InferSchemaType<typeof CategorySchema>;

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;
