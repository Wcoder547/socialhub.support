// src/app/api/tasks/route.ts
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

    const currentUser = await UserModel.findOne({
      email: session.user.email,
    })
      .select("_id")
      .lean();

    if (!currentUser) {
      return NextResponse.json({ tasks: [] }, { status: 200 });
    }

    // fetch ALL active tasks (no limit)
    const tasks = await TaskModel.find(
      { status: "active" },
      "userId tiktokLink tiktokUsername followers rewardPerFollower totalCost status createdByRole createdAt priority"
    )
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    if (!tasks.length) {
      return NextResponse.json({ tasks: [] }, { status: 200 });
    }

    // collect non-admin creator ids for avatar/name
    const creatorIds = Array.from(
      new Set(
        tasks
          .filter((t: any) => t.createdByRole !== "admin" && !!t.userId)
          .map((t: any) => t.userId.toString())
      )
    );

    const creators = await UserModel.find(
      { _id: { $in: creatorIds } },
      "photo name"
    )
      .lean()
      .exec();

    const creatorMap = new Map(creators.map((u: any) => [u._id.toString(), u]));

    const tasksWithUser = tasks.map((task: any) => {
      if (task.createdByRole === "admin") {
        return {
          ...task,
          userPhoto: null,
          userName: "Featured Campaign",
        };
      }

      const creator = creatorMap.get(task.userId.toString());
      return {
        ...task,
        userPhoto: creator?.photo || null,
        userName: creator?.name || null,
      };
    });

    return NextResponse.json({ tasks: tasksWithUser }, { status: 200 });
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
