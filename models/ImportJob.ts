import mongoose, { Schema, Document } from 'mongoose';

export interface ImportJobDocument extends Document {
  url: string;
  targetCategory: string;
  targetSubcategory: string;
  totalProducts: number;
  importedCount: number;
  skippedCount: number;
  failedCount: number;
  status: 'running' | 'completed' | 'paused' | 'cancelled' | 'failed';
  logs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ImportJobSchema = new Schema<ImportJobDocument>({
  url: { type: String, required: true },
  targetCategory: { type: String, required: true },
  targetSubcategory: { type: String, required: false },
  totalProducts: { type: Number, default: 0 },
  importedCount: { type: Number, default: 0 },
  skippedCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  status: { type: String, enum: ['running', 'completed', 'paused', 'cancelled', 'failed'], default: 'running' },
  logs: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.models.ImportJob || mongoose.model<ImportJobDocument>('ImportJob', ImportJobSchema);
