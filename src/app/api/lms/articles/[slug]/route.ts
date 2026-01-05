// src/app/api/lms/articles/[slug]/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/src/lib/dbConnect";
import LmsArticleModel from "@/src/models/LmsArticle.model";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> } // note: Promise
) {
  try {
    await dbConnect();

    const { slug } = await ctx.params; // unwrap params

    const article = await LmsArticleModel.findOne({
      slug,
      isPublished: true,
    })
      .populate("createdBy", "name photo")
      .lean();

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article }, { status: 200 });
  } catch (err) {
    console.error("GET /api/lms/articles/[slug] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
