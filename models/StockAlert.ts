import mongoose, { Schema, type InferSchemaType } from "mongoose";

const StockAlertSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    notified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

StockAlertSchema.index({ email: 1, productId: 1 }, { unique: true });

export type StockAlertDocument = InferSchemaType<typeof StockAlertSchema>;

const StockAlert = mongoose.models.StockAlert || mongoose.model("StockAlert", StockAlertSchema);

export default StockAlert;
