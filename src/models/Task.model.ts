// models/Task.model.ts
import mongoose, { Schema, Document } from "mongoose";

interface TaskDoc extends Document {
  userId: string; // owner who created campaign
  tiktokLink: string;
  followers: number;
  completedFollowers: number;
  rewardPerFollower: number;
  totalCost: number;
  status: string;
  createdByRole: "admin" | "user";
  proofScreenshotUrl?: string | null;
  proofStatus?: "pending" | "approved" | "rejected" | null;
  proofSubmittedBy?: mongoose.Types.ObjectId | null; // <- add this
}

const TaskSchema = new Schema<TaskDoc>(
  {
    userId: { type: String, required: true },
    tiktokLink: { type: String, required: true },
    followers: { type: Number, required: true },
    completedFollowers: { type: Number, default: 0 },
    rewardPerFollower: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    status: { type: String, default: "active" },
    createdByRole: { type: String, enum: ["admin", "user"], default: "user" },

    proofScreenshotUrl: { type: String, default: null },
    proofStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", null],
      default: null,
    },
    proofSubmittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Task ||
  mongoose.model<TaskDoc>("Task", TaskSchema);
