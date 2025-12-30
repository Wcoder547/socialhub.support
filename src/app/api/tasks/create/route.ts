import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth-options";
import { dbConnect } from "../../../../lib/dbConnect";
import UserModel from "../../../../models/User.model";
import TaskModel from "../../../../models/Task.model";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { tiktokLink, followers, reward } = body;

    if (!tiktokLink || !followers || !reward) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const totalCost = followers * reward;

    await dbConnect();
    const user = await UserModel.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.coins < totalCost) {
      return NextResponse.json(
        { error: "Insufficient coins", shortBy: totalCost - user.coins },
        { status: 400 }
      );
    }

    // Deduct coins and create task in a single flow
    user.coins -= totalCost;
    await user.save();

    const task = await TaskModel.create({
      userId: user._id.toString(),
      tiktokLink,
      followers,
      rewardPerFollower: reward,
      totalCost,
      status: "pending",
    });

    return NextResponse.json(
      { ok: true, task, newBalance: user.coins },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create task error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
