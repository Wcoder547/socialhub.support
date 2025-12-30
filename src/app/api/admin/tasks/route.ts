import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/dbConnect";
import TaskModel from "../../../../models/Task.model";
import UserModel from "../../../../models/User.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "dev-admin-secret";
type AdminJwtPayload = {
  sub: string;
  role: "admin";
  iat?: number;
  exp?: number;
};
async function getAdminFromCookie() {
  const store = await cookies();
  const token = store.get("admin_token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as AdminJwtPayload;
    if (decoded.role !== "admin") return null;
    return decoded;
  } catch {
    return null;
  }
}

// GET /api/admin/tasks -> list all tasks
export async function GET() {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    await dbConnect();

    const tasks = await TaskModel.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (err) {
    console.error("GET /api/admin/tasks error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/tasks -> create HIGH PRIORITY admin task
export async function POST(req: Request) {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { tiktokLink, followers, rewardPerFollower, totalCost } =
      await req.json();

    if (!tiktokLink || !followers || !rewardPerFollower || !totalCost) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    const adminUser = await UserModel.findById(admin.sub);

    if (!adminUser) {
      // runtime guard + satisfies TS
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    const task = await TaskModel.create({
      tiktokLink,
      followers,
      rewardPerFollower,
      totalCost,
      status: "active", // admin tasks go live immediately
      userId: adminUser!._id.toString(), // safe now
      createdByRole: "admin",
      priority: 100,
    });

    return NextResponse.json({ ok: true, task }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/tasks error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/tasks -> update status (approve pending)
export async function PUT(req: Request) {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { taskId, status } = await req.json();

    if (!taskId || !status) {
      return NextResponse.json(
        { error: "taskId and status required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const task = await TaskModel.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, task }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/admin/tasks error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
