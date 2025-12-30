import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth-options";
import { dbConnect } from "../../../lib/dbConnect";
import UserModel from "../../../models/User.model";
import TaskModel from "../../../models/Task.model";
const session = await getServerSession(authOptions);

export async function GET() {
  try {
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    // still resolve current user in case you need it later,
    // but not using it for filtering tasks now
    const currentUser = await UserModel.findOne({
      email: session.user.email,
    }).lean();

    if (!currentUser) {
      return NextResponse.json({ tasks: [] }, { status: 200 });
    }

    // 🔴 show ALL active tasks, regardless of owner
    const tasks = await TaskModel.find({
      status: "active",
    })
      .sort({ priority: -1, createdAt: -1 }) // high priority first
      .lean();

    const tasksWithUser = await Promise.all(
      tasks.map(async (task) => {
        if (task.createdByRole === "admin") {
          return {
            ...task,
            userPhoto: null,
            userName: "Featured Campaign",
          };
        }

        const creator = await UserModel.findById(task.userId).lean();

        return {
          ...task,
          userPhoto: creator?.photo || null,
          userName: creator?.name || null,
        };
      })
    );

    return NextResponse.json({ tasks: tasksWithUser }, { status: 200 });
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
