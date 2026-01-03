import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth-options";
import { dbConnect } from "../../../../lib/dbConnect";
import TaskModel from "../../../../models/Task.model";
import cloudinary from "@/src/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const taskId = formData.get("taskId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
    }

    await dbConnect();

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "earn-coins-proofs",
              public_id: `task-${taskId}-${Date.now()}`,
            },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve({ secure_url: result.secure_url });
            }
          )
          .end(buffer);
      }
    );

    // save screenshot URL on the task and mark as pending
    task.proofScreenshotUrl = uploadRes.secure_url;
    task.proofStatus = "pending";
    await task.save();

    return NextResponse.json(
      { url: uploadRes.secure_url, message: "Proof uploaded & saved" },
      { status: 200 }
    );
  } catch (e) {
    console.error("Upload proof error", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
