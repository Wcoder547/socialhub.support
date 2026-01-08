// src/app/api/youtube/campaign/verify/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth-options";
import { dbConnect } from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User.model";
import SocialCampaignModel from "@/src/models/SocialCampaign.model";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const campaignId = formData.get("campaignId") as string | null;

    if (!campaignId) {
      return NextResponse.json(
        { error: "Missing campaignId" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "No screenshot provided" },
        { status: 400 }
      );
    }

    // simple sanity check, no upload
    await file.arrayBuffer();

    await dbConnect();

    const worker = await UserModel.findOne({ email: session.user.email });
    if (!worker) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const campaign = await SocialCampaignModel.findById(campaignId);
    if (!campaign || campaign.platform !== "youtube") {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    if (campaign.status !== "active") {
      return NextResponse.json(
        { error: "Campaign is not active" },
        { status: 400 }
      );
    }

    if (campaign.completedActions >= campaign.targetActions) {
      return NextResponse.json(
        { error: "Campaign is already full" },
        { status: 400 }
      );
    }

    const reward = campaign.rewardPerAction;

    // pay worker into YOUTUBE socialCoins
    const oldBalance = worker.socialCoins?.youtube || 0;
    worker.socialCoins.youtube = oldBalance + reward;
    await worker.save();

    // update campaign progress
    campaign.completedActions += 1;
    campaign.spentBudget += reward;

    if (campaign.completedActions >= campaign.targetActions) {
      campaign.status = "completed";
    }

    await campaign.save();

    return NextResponse.json(
      {
        ok: true,
        message: "Proof accepted, YouTube coins credited",
        addedCoins: reward,
        newYoutubeBalance: worker.socialCoins.youtube,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/youtube/campaign/verify error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
