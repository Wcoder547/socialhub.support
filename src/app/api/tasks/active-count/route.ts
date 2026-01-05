// app/api/tasks/active-count/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/src/lib/dbConnect";
import TaskModel from "@/src/models/Task.model";

export async function GET() {
  try {
    await dbConnect();
    const totalActive = await TaskModel.countDocuments({ status: "active" });
    return NextResponse.json({ totalActive }, { status: 200 });
  } catch (err) {
    console.error("GET /api/tasks/active-count error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
