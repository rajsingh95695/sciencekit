import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ContactMessageSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ""
    },
    subject: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["new", "replied", "closed"],
      default: "new"
    }
  },
  {
    timestamps: true
  }
);

export type ContactMessageDocument = InferSchemaType<typeof ContactMessageSchema>;

const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);

export default ContactMessage;
