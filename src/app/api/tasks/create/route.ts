import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth-options";
import { dbConnect } from "../../../../lib/dbConnect";
import UserModel from "../../../../models/User.model";
import TaskModel from "../../../../models/Task.model";

export async function POST(req: Request) {
  try {
    console.log("[CREATE TASK] Incoming request");

    const session = await getServerSession(authOptions);
    console.log("[CREATE TASK] Session:", JSON.stringify(session, null, 2));

    if (!session?.user?.email) {
      console.log("[CREATE TASK] Not authenticated");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const rawBody = await req.text();
    console.log("[CREATE TASK] Raw body:", rawBody);

    let body: {
      tiktokLink: string;
      tiktokUsername: string;
      followers: number;
      reward: number;
    };

    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.error("[CREATE TASK] JSON parse error:", e);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { tiktokLink, tiktokUsername, followers, reward } = body;
    console.log("[CREATE TASK] Parsed body:", {
      tiktokLink,
      tiktokUsername,
      followers,
      reward,
    });

    if (!tiktokLink || !tiktokUsername || !followers || !reward) {
      console.log("[CREATE TASK] Missing fields");
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const cleanUsername = tiktokUsername.trim().replace(/^@/, "");
    console.log("[CREATE TASK] Clean username:", cleanUsername);

    const doubledReward = reward * 2;
    const totalCost = followers * reward;
    console.log("[CREATE TASK] Calculated values:", {
      doubledReward,
      totalCost,
    });

    console.log("[CREATE TASK] Connecting to DB...");
    await dbConnect();
    console.log("[CREATE TASK] DB connected");

    const user = await UserModel.findOne({ email: session.user.email });
    console.log("[CREATE TASK] Found user:", user?._id?.toString());

    if (!user) {
      console.log("[CREATE TASK] User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const runningCount = await TaskModel.countDocuments({
      userId: user._id.toString(),
      status: { $in: ["pending", "active"] },
    });
    console.log("[CREATE TASK] Running campaigns count:", runningCount);

    if (runningCount >= 3) {
      console.log("[CREATE TASK] Too many running campaigns");
      return NextResponse.json(
        {
          error:
            "You already have 3 running campaigns. Please wait until one is completed before creating a new one.",
        },
        { status: 400 }
      );
    }

    console.log("[CREATE TASK] User coins before:", user.coins);
    if (user.coins < totalCost) {
      console.log("[CREATE TASK] Insufficient coins", {
        have: user.coins,
        need: totalCost,
      });
      return NextResponse.json(
        { error: "Insufficient coins", shortBy: totalCost - user.coins },
        { status: 400 }
      );
    }

    user.coins -= totalCost;
    await user.save();
    console.log("[CREATE TASK] User coins after:", user.coins);

    console.log("[CREATE TASK] Creating task document...");
    const task = await TaskModel.create({
      userId: user._id.toString(),
      tiktokLink,
      tiktokUsername: cleanUsername,
      followers,
      completedFollowers: 0,
      rewardPerFollower: doubledReward,
      totalCost,
      status: "pending",
      createdByRole: "user",
      priority: 0,
    });
    console.log("[CREATE TASK] Task created with id:", task._id.toString());

    const responsePayload = {
      ok: true,
      task,
      newBalance: user.coins,
      tiktokUsername: cleanUsername,
    };
    console.log("[CREATE TASK] Response payload:", responsePayload);

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (err) {
    console.error("[CREATE TASK] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
