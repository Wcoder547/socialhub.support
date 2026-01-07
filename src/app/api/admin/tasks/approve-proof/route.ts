// src/app/api/admin/tasks/approve-proof/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { dbConnect } from "@/src/lib/dbConnect";
import TaskModel from "@/src/models/Task.model";
import UserModel from "@/src/models/User.model";

const ADMIN_COOKIE_NAME = "admin_token";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!adminToken) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  try {
    const { taskId } = await req.json();
    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
    }

    await dbConnect();

    const task = await TaskModel.findById(taskId);
    console.log("Approving proof for task:", taskId, task);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (!task.proofScreenshotUrl || task.proofStatus !== "pending") {
      return NextResponse.json(
        { error: "Task has no pending proof to approve" },
        { status: 400 }
      );
    }

    if (!task.proofSubmittedBy) {
      return NextResponse.json(
        { error: "No worker found for this proof" },
        { status: 400 }
      );
    }

    // CREDIT THE WORKER WHO SUBMITTED PROOF
    const worker = await UserModel.findById(task.proofSubmittedBy);
    if (!worker) {
      return NextResponse.json(
        { error: "Worker user not found" },
        { status: 404 }
      );
    }

    const reward = task.rewardPerFollower;

    // 1) credit coins to worker
    worker.coins = (worker.coins || 0) + reward;
    await worker.save();

    // 2) update task progress + proof status
    task.completedFollowers = (task.completedFollowers || 0) + 1;
    task.proofStatus = "approved";
    if (task.completedFollowers >= task.followers) {
      task.status = "completed";
    }

    try {
      await task.save();
    } catch (err: any) {
      if (err?.name === "ValidationError") {
        console.error("Approve proof validation error", err);
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Proof approved and coins credited",
        addedCoins: reward,
        newBalance: worker.coins,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/admin/tasks/approve-proof error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
