import { NextResponse } from "next/server";
import { dbConnect } from "@/src/lib/dbConnect";
import SocialCampaignModel from "@/src/models/SocialCampaign.model";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();

    const campaigns = await SocialCampaignModel.find({
      platform: "facebook",
      status: "active",
      $expr: { $lt: ["$completedActions", "$targetActions"] },
    }).lean();

    return NextResponse.json({ campaigns }, { status: 200 });
  } catch (err) {
    console.error("GET /api/youtube/campaign/list error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
