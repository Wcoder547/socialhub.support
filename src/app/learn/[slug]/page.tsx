"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import DashboardNavbar from "@/src/components/DashboardNavbar";
import Footer from "@/src/components/Footer";

interface Article {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  body: string; // TinyMCE HTML from DB
  type: "article" | "video";
  youtubeUrl?: string;
  tags?: string[];
  category?: string;
  isPublished: boolean;
  readTimeMinutes?: number;
  createdAt: string;
  createdBy?: {
    _id: string;
    name?: string;
    photo?: string;
  };
}

export default function LearnArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/lms/articles/${slug}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Failed to load article");
        setArticle(null);
        return;
      }
      setArticle(data.article);
    } catch (err) {
      console.error("Learn article fetch error:", err);
      setError("Error loading article");
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08030c] text-white flex flex-col">
        <DashboardNavbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xs text-white/60">Loading article...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#08030c] text-white flex flex-col">
        <DashboardNavbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xs text-red-400">{error || "Article not found"}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString();

  // transform common YouTube watch URLs into embed
  const embedUrl =
    article.type === "video" && article.youtubeUrl
      ? article.youtubeUrl
          .replace("watch?v=", "embed/")
          .replace("youtu.be/", "www.youtube.com/embed/")
      : null;

  return (
    <div className="min-h-screen bg-[#08030c] text-white flex flex-col">
      <DashboardNavbar />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-10 space-y-8">
          {/* Header */}
          <header className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-pink-500">
              {article.category || "General"}
            </p>
            <h1 className="text-3xl font-semibold md:text-4xl">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-sm text-white/70 md:text-[13px]">
                {article.subtitle}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/60">
              {article.createdBy?.photo && (
                <Image
                  src={article.createdBy.photo}
                  alt={article.createdBy.name || "Author"}
                  className="h-7 w-7 rounded-full object-cover border border-pink-400"
                  width={28}
                  height={28}
                />
              )}
              {article.createdBy?.name && (
                <span className="font-medium text-white">
                  {article.createdBy.name}
                </span>
              )}
              <span>· {formattedDate}</span>
              <span>· {article.readTimeMinutes || 2} min read</span>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/5 px-2 py-[3px] text-[10px] text-white/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* YouTube embed */}
          {embedUrl && (
            <section>
              <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black aspect-video shadow-[0_18px_45px_rgba(0,0,0,0.8)]">
                <iframe
                  src={embedUrl}
                  title={article.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          )}

          {/* Article body (render TinyMCE HTML) */}
          <section className="rounded-2xl border border-white/10 bg-[#130818] px-4 py-5 md:px-6 md:py-6">
            <div className="prose prose-invert max-w-none prose-p:mb-3 prose-p:text-[15px] prose-p:leading-relaxed prose-a:text-pink-400 prose-a:underline-offset-2 prose-strong:text-white">
              <div dangerouslySetInnerHTML={{ __html: article.body }} />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
