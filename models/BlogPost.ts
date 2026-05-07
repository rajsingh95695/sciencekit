import mongoose, { Schema, type InferSchemaType } from "mongoose";

const BlogPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    excerpt: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    coverImage: {
      type: String,
      default: ""
    },
    tags: {
      type: [String],
      default: []
    },
    featured: {
      type: Boolean,
      default: false
    },
    published: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

BlogPostSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
  tags: "text"
});

export type BlogPostDocument = InferSchemaType<typeof BlogPostSchema>;

const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);

export default BlogPost;
