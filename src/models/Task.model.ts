import { Schema, Document, models, model } from "mongoose";

export interface ITask extends Document {
  userId: string;
  tiktokLink: string;
  followers: number;
  completedFollowers: number;
  rewardPerFollower: number;
  totalCost: number;
  status: "pending" | "active" | "completed" | "cancelled";
  createdByRole: "admin" | "user";
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: String, required: true },
    tiktokLink: { type: String, required: true },
    followers: { type: Number, required: true },
    completedFollowers: { type: Number, default: 0 }, // NEW FIELD
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
    priority: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const TaskModel = models.Task || model<ITask>("Task", TaskSchema);
export default TaskModel;
