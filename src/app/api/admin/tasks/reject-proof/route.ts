// src/app/api/admin/tasks/reject-proof/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { dbConnect } from "@/src/lib/dbConnect";
import TaskModel from "@/src/models/Task.model";

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
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (!task.proofScreenshotUrl || task.proofStatus !== "pending") {
      return NextResponse.json(
        { error: "Task has no pending proof to reject" },
        { status: 400 }
      );
    }

    task.proofStatus = "rejected";
    await task.save();

    return NextResponse.json(
      { ok: true, message: "Proof rejected" },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/admin/tasks/reject-proof error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
