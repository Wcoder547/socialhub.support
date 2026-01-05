"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardNavbar from "@/src/components/DashboardNavbar";
import Footer from "@/src/components/Footer";

interface ArticleListItem {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  tags?: string[];
  category?: string;
  readTimeMinutes?: number;
  createdAt: string;
}

export default function LearnIndexPage() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/lms/articles");
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Failed to load articles");
        setArticles([]);
        return;
      }
      setArticles(data.articles || []);
    } catch (err) {
      console.error("Learn index fetch error:", err);
      setError("Error loading articles");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-[#08030c] text-white flex flex-col">
      <DashboardNavbar />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-10 space-y-6">
          {/* Header */}
          <header className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-pink-500">
              Learn
            </p>
            <h1 className="text-3xl font-semibold md:text-4xl">
              Learn SocialHub
            </h1>
            <p className="text-sm text-white/60 md:text-[13px]">
              Short, practical guides about coins, safe follow‑for‑follow, TikTok growth,
              and getting the most from SocialHub.
            </p>
          </header>

          {/* Content */}
          {loading ? (
            <p className="text-xs text-white/60">Loading articles...</p>
          ) : error ? (
            <p className="text-xs text-red-400">{error}</p>
          ) : articles.length === 0 ? (
            <p className="text-xs text-white/60">
              No guides are published yet. Please check back later.
            </p>
          ) : (
            <section className="grid gap-4 md:gap-6">
              {articles.map((article) => (
                <Link
                  key={article._id}
                  href={`/learn/${article.slug}`}
                  className="group rounded-2xl border border-white/8 bg-[#130818] px-4 py-4 md:px-5 md:py-5 transition hover:border-pink-500/60 hover:bg-[#1b0e24] hover:shadow-[0_18px_45px_rgba(0,0,0,0.7)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase text-white/45">
                      {article.category || "General"} ·{" "}
                      {article.readTimeMinutes || 1} min read ·{" "}
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                    <span className="hidden text-[11px] text-pink-400 md:inline group-hover:translate-x-0.5 transition-transform">
                      Read →
                    </span>
                  </div>

                  <h2 className="mt-1 text-lg font-semibold md:text-xl">
                    {article.title}
                  </h2>

                  {article.subtitle && (
                    <p className="mt-1 text-[13px] text-white/70 line-clamp-2">
                      {article.subtitle}
                    </p>
                  )}

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
                </Link>
              ))}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
