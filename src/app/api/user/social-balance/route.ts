import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth-options";
import { dbConnect } from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User.model";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    const user = await UserModel.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const globalCoins = user.coins ?? 0;

    const socialCoins = {
      youtube: user.socialCoins?.youtube ?? 0,
      facebook: user.socialCoins?.facebook ?? 0,
      instagram: user.socialCoins?.instagram ?? 0,
    };

    return NextResponse.json({ globalCoins, socialCoins }, { status: 200 });
  } catch (err) {
    console.error("GET /api/user/social-balance error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
