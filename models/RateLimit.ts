import mongoose, { Schema, type InferSchemaType } from "mongoose";

const RateLimitSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },
    bucket: {
      type: String,
      required: true
    },
    ip: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    },
    expiresAt: {
      type: Date,
      required: true,
      index: {
        expireAfterSeconds: 0
      }
    }
  },
  {
    timestamps: true
  }
);

export type RateLimitDocument = InferSchemaType<typeof RateLimitSchema>;

const RateLimit = mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);

export default RateLimit;
