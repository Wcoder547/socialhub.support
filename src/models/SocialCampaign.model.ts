import mongoose, { Schema, Document } from "mongoose";

export type SocialPlatform = "youtube" | "facebook" | "instagram";

export interface SocialCampaignDoc extends Document {
  ownerId: mongoose.Types.ObjectId; // who created campaign
  platform: SocialPlatform; // "youtube" | "facebook" | "instagram"
  profileLink: string; // channel/profile/page URL
  handle?: string; // optional @handle
  targetActions: number; // e.g. 100 followers / likes
  completedActions: number; // how many proofs approved
  rewardPerAction: number; // coins given to worker
  totalBudget: number; // targetActions * rewardPerAction
  spentBudget: number; // coins already paid out
  status: "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const SocialCampaignSchema = new Schema<SocialCampaignDoc>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    platform: {
      type: String,
      enum: ["youtube", "facebook", "instagram"],
      required: true,
    },
    profileLink: { type: String, required: true },
    handle: { type: String, trim: true },

    targetActions: { type: Number, required: true },
    completedActions: { type: Number, default: 0 },

    rewardPerAction: { type: Number, required: true },
    totalBudget: { type: Number, required: true },
    spentBudget: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

const SocialCampaignModel =
  mongoose.models.SocialCampaign ||
  mongoose.model<SocialCampaignDoc>("SocialCampaign", SocialCampaignSchema);

export default SocialCampaignModel;
