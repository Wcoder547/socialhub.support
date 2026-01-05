import mongoose, { Schema, Document } from "mongoose";

export interface LmsArticleDoc extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  body: string;
  type: "article" | "video";
  youtubeUrl?: string;
  tags?: string[];
  category?: string;
  isPublished: boolean;
  createdBy: mongoose.Types.ObjectId;
  readTimeMinutes?: number;
}

const LmsArticleSchema = new Schema<LmsArticleDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subtitle: { type: String },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: ["article", "video"],
      default: "article",
    },
    youtubeUrl: { type: String },
    tags: [{ type: String }],
    category: { type: String },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    readTimeMinutes: { type: Number },
  },
  { timestamps: true }
);

// pre-save hook WITHOUT next()
LmsArticleSchema.pre("save", function () {
  const doc = this as LmsArticleDoc;
  const body = doc.body || "";
  const words = body.split(/\s+/).filter(Boolean).length;
  doc.readTimeMinutes = Math.max(1, Math.round(words / 200));
});

export default mongoose.models.LmsArticle ||
  mongoose.model<LmsArticleDoc>("LmsArticle", LmsArticleSchema);
