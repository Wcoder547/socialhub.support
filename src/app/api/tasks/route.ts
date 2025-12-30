import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth-options";
import { dbConnect } from "../../../lib/dbConnect";
import UserModel from "../../../models/User.model";
import TaskModel from "../../../models/Task.model";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const user = await UserModel.findOne({ email: session.user.email }).lean();

    if (!user) {
      return NextResponse.json({ tasks: [] }, { status: 200 });
    }

    const tasks = await TaskModel.find({ userId: user._id.toString() })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
