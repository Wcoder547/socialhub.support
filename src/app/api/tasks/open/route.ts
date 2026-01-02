import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth-options";
import { dbConnect } from "../../../../lib/dbConnect";
import DailyUsage from "../../../../models/DailyUsage";

const MAX_OPENS_PER_DAY = 50;

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await dbConnect();

  const userId = (session.user as any).id || session.user.email;
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const usage = await DailyUsage.findOneAndUpdate(
    { userId, date: today },
    { $inc: { opens: 1 } },
    { new: true, upsert: true }
  );

  if (usage.opens > MAX_OPENS_PER_DAY) {
    return NextResponse.json(
      { error: "Daily TikTok limit reached. Try again tomorrow." },
      { status: 429 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
