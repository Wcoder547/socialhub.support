// src/app/api/youtube/campaign/create/route.ts
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

    const body = await req.json();
    const {
      profileLink,
      handle,
      targetActions,
      rewardPerAction,
    }: {
      profileLink: string;
      handle?: string;
      targetActions: number;
      rewardPerAction: number;
    } = body;

    if (!profileLink || !targetActions || !rewardPerAction) {
      return NextResponse.json(
        { error: "profileLink, targetActions, rewardPerAction are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalBudget = targetActions * rewardPerAction;

    // IMPORTANT: use YouTube social coins, not global coins
    const ytBalance = user.socialCoins?.youtube || 0;
    if (ytBalance < totalBudget) {
      return NextResponse.json(
        { error: "Not enough YouTube coins" },
        { status: 400 }
      );
    }

    // deduct immediately from youtube wallet
    user.socialCoins.youtube = ytBalance - totalBudget;
    await user.save();

    const campaign = await SocialCampaignModel.create({
      ownerId: user._id,
      platform: "youtube",
      profileLink,
      handle,
      targetActions,
      completedActions: 0,
      rewardPerAction,
      totalBudget,
      spentBudget: 0,
      status: "active",
    });

    return NextResponse.json(
      {
        campaign,
        newYoutubeBalance: user.socialCoins.youtube,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/youtube/campaign/create error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
