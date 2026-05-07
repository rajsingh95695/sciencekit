import mongoose, { Schema, type InferSchemaType } from "mongoose";

const FAQSchema = new Schema(
  {
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: "General"
    },
    active: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export type FAQDocument = InferSchemaType<typeof FAQSchema>;

const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", FAQSchema);

export default FAQ;
