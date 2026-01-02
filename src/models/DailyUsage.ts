// models/DailyUsage.ts
import mongoose, { Schema, Document } from "mongoose";

interface DailyUsage extends Document {
  userId: string;
  date: string;
  opens: number;
}

const DailyUsageSchema = new Schema<DailyUsage>({
  userId: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },
  opens: { type: Number, default: 0 },
});

DailyUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

export default (mongoose.models.DailyUsage as mongoose.Model<DailyUsage>) ||
  mongoose.model<DailyUsage>("DailyUsage", DailyUsageSchema);
