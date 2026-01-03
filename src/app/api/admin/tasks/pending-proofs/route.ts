// src/app/api/admin/tasks/pending-proofs/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { dbConnect } from "@/src/lib/dbConnect";
import TaskModel from "@/src/models/Task.model";
import UserModel from "@/src/models/User.model";

const ADMIN_COOKIE_NAME = "admin_token";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!adminToken) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  try {
    await dbConnect();

    const tasks = await TaskModel.find({
      proofScreenshotUrl: { $ne: null },
      proofStatus: "pending",
    })
      .sort({ createdAt: -1 })
      .lean();

    const userIds = Array.from(new Set(tasks.map((t: any) => t.userId)));
    const users = await UserModel.find({ _id: { $in: userIds } })
      .select("_id name email coins photo")
      .lean();

    const userMap = new Map(users.map((u: any) => [String(u._id), u]));

    const result = tasks.map((t: any) => ({
      ...t,
      user: userMap.get(String(t.userId)) || null,
    }));

    return NextResponse.json({ tasks: result }, { status: 200 });
  } catch (err) {
    console.error("GET /api/admin/tasks/pending-proofs error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
