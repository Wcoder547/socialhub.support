import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ITask extends Document {
  userId: string;
  tiktokLink: string;
  followers: number;
  rewardPerFollower: number;
  totalCost: number;
  status: "pending" | "active" | "completed" | "cancelled";
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: String, required: true },
    tiktokLink: { type: String, required: true },
    followers: { type: Number, required: true },
    rewardPerFollower: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const TaskModel = models.Task || model<ITask>("Task", TaskSchema);
export default TaskModel;
