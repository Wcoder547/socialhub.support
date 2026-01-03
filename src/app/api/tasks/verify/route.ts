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

    const { taskId, screenshotUrl } = await req.json();
    if (!taskId || !screenshotUrl) {
      return NextResponse.json(
        { error: "Missing taskId or screenshotUrl" },
        { status: 400 }
      );
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

    // store proof + WHO submitted it (the worker)
    task.proofScreenshotUrl = screenshotUrl;
    task.proofStatus = "pending";

    // make sure your Task schema has: proofSubmittedBy: { type: Schema.Types.ObjectId, ref: "User", default: null }
    task.proofSubmittedBy = user._id;

    await task.save();

    return NextResponse.json(
      {
        ok: true,
        message: "Proof submitted. Waiting for admin approval.",
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
