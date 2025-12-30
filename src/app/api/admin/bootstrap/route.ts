import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/dbConnect";
import UserModel from "../../../../models/User.model";

import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.findOneAndUpdate(
      { email },
      {
        $set: {
          name: name || "Admin",
          role: "admin",
          passwordHash,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { ok: true, userId: user._id.toString() },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/admin/bootstrap error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
