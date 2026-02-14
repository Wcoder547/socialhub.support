// src/app/api/tasks/verify/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth-options";
import { dbConnect } from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User.model";
import TaskModel from "@/src/models/Task.model";

export const runtime = "nodejs";

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

    // Check if user already submitted this task
    if (
      task.proofSubmittedBy &&
      task.proofSubmittedBy.toString() === user._id.toString()
    ) {
      return NextResponse.json(
        { error: "You have already completed this task" },
        { status: 400 },
      );
    }

    // Auto-approve: Add coins immediately
    const coinsToAdd = task.rewardPerFollower;
    user.coins = (user.coins || 0) + coinsToAdd;
    await user.save();

    // Mark task as completed by this user
    task.proofStatus = "approved"; // Auto-approved
    task.proofSubmittedBy = user._id;
    task.submittedAt = new Date();
    task.completedFollowers = (task.completedFollowers || 0) + 1;

    // If all followers completed, mark task as completed
    if (task.completedFollowers >= task.followers) {
      task.status = "completed";
    }

    await task.save();

    return NextResponse.json(
      {
        ok: true,
        message: "Task completed successfully!",
        coinsAdded: coinsToAdd,
        newBalance: user.coins,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("POST /api/tasks/verify error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
