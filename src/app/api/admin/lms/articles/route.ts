import { NextResponse } from "next/server";
import { dbConnect } from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User.model";
import LmsArticleModel from "@/src/models/LmsArticle.model";
import { requireAdmin } from "@/src/lib/admin-auth";

function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// GET /api/admin/lms/articles -> list all articles (admin)
export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    await dbConnect();

    const articles = await LmsArticleModel.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ articles }, { status: 200 });
  } catch (err) {
    console.error("GET /api/admin/lms/articles error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/lms/articles -> create article (admin)
export async function POST(req: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const {
      title,
      subtitle,
      body,
      type,
      youtubeUrl,
      tags,
      category,
      isPublished,
      slug,
    } = await req.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // pick any admin user as author (or extend later)
    const adminUser = await UserModel.findOne({ role: "admin" }).lean();
    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 500 }
      );
    }

    const baseSlug =
      slug && slug.trim().length > 0 ? slugifyTitle(slug) : slugifyTitle(title);

    const existing = await LmsArticleModel.findOne({ slug: baseSlug });
    if (existing) {
      return NextResponse.json(
        {
          error:
            "Slug already in use. Change title or provide a different slug.",
        },
        { status: 400 }
      );
    }

    const article = await LmsArticleModel.create({
      title,
      slug: baseSlug,
      subtitle,
      body,
      type: type ?? "article",
      youtubeUrl,
      tags,
      category,
      isPublished: !!isPublished,
      createdBy: adminUser._id,
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/lms/articles error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/lms/articles?id=ARTICLE_ID -> delete article (admin)
export async function DELETE(req: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Article id is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const deleted = await LmsArticleModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/admin/lms/articles error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
