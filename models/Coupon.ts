import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    expiryDate: {
      type: Date,
      required: true
    },
    usageLimit: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    usedCount: {
      type: Number,
      min: 0,
      default: 0
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

export type CouponDocument = InferSchemaType<typeof CouponSchema>;

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);

export default Coupon;
