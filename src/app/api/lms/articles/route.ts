import { NextResponse } from "next/server";
import { dbConnect } from "@/src/lib/dbConnect";
import LmsArticleModel from "@/src/models/LmsArticle.model";

export async function GET() {
  try {
    await dbConnect();

    const articles = await LmsArticleModel.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .select("title slug subtitle tags category readTimeMinutes createdAt")
      .lean();

    return NextResponse.json({ articles }, { status: 200 });
  } catch (err) {
    console.error("GET /api/lms/articles error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
