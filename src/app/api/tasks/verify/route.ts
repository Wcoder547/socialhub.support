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

    const { taskId } = await req.json();
    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
    }

    await dbConnect();

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // 1) give coins
    const reward = task.rewardPerFollower;
    user.coins = (user.coins || 0) + reward;
    await user.save();

    const currentCompleted = task.completedFollowers || 0;
    const newCompleted = currentCompleted + 1;
    task.completedFollowers = newCompleted;

    if (newCompleted >= task.followers) {
      await task.deleteOne();
    } else {
      await task.save();
    }

    return NextResponse.json(
      {
        ok: true,
        addedCoins: reward,
        newBalance: user.coins,
        completedFollowers: newCompleted,
        targetFollowers: task.followers,
        deleted: newCompleted >= task.followers,
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
