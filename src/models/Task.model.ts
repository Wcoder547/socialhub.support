// src/models/Task.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface TaskDoc extends Document {
  userId: string;
  tiktokLink: string;
  tiktokUsername?: string;
  followers: number;
  completedFollowers: number;
  rewardPerFollower: number;
  totalCost: number;
  status: "pending" | "active" | "completed" | "cancelled";
  createdByRole: "admin" | "user";

  proofStatus?: "pending" | "approved" | "rejected" | null;
  proofSubmittedBy?: mongoose.Types.ObjectId | null;
  submittedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<TaskDoc>(
  {
    userId: { type: String, required: true },
    tiktokLink: { type: String, required: true },
    tiktokUsername: { type: String, trim: true, required: false },
    followers: { type: Number, required: true },
    completedFollowers: { type: Number, default: 0 },
    rewardPerFollower: { type: Number, required: true },
    totalCost: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled"],
      default: "pending",
    },

    createdByRole: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    proofStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: null,
    },
    proofSubmittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const TaskModel =
  mongoose.models.Task || mongoose.model<TaskDoc>("Task", TaskSchema);

export default TaskModel;
