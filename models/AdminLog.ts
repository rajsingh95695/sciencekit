import mongoose, { Schema, type InferSchemaType } from "mongoose";

const AdminLogSchema = new Schema(
  {
    adminId: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    resource: {
      type: String,
      required: true
    },
    resourceId: String,
    payload: Schema.Types.Mixed
  },
  {
    timestamps: true
  }
);

export type AdminLogDocument = InferSchemaType<typeof AdminLogSchema>;

const AdminLog = mongoose.models.AdminLog || mongoose.model("AdminLog", AdminLogSchema);

export default AdminLog;
