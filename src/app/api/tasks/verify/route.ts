// app/api/tasks/verify/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth-options"; // adjust path if needed
import { dbConnect } from "../../../..//lib/dbConnect";
import UserModel from "../../../../models/User.model";
import TaskModel from "../../../../models/Task.model";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // get taskId from body
    const { taskId } = await req.json();
    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
    }

    await dbConnect();

    // current user (who is earning coins)
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // task that user completed
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // add coins equal to rewardPerFollower (per task)
    const reward = task.rewardPerFollower;
    user.coins = (user.coins || 0) + reward;
    await user.save();

    // DO NOT change task.status here so only admin controls status

    return NextResponse.json(
      {
        ok: true,
        addedCoins: reward,
        newBalance: user.coins,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/tasks/verify error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
