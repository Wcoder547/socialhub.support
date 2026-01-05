"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <main className="min-h-screen bg-[#08030c] text-white">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold">Learn SocialHub</h1>
          <p className="text-sm text-white/60">
            Medium‑style guides about coins, safe follow‑for‑follow, and TikTok growth.
          </p>
        </header>

        {loading ? (
          <p className="text-xs text-white/60">Loading articles...</p>
        ) : error ? (
          <p className="text-xs text-red-400">{error}</p>
        ) : articles.length === 0 ? (
          <p className="text-xs text-white/60">
            No guides are published yet. Please check back later.
          </p>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <Link
                key={article._id}
                href={`/learn/${article.slug}`}
                className="block border-b border-white/10 pb-5 hover:bg-white/5 rounded-xl -mx-3 px-3 transition"
              >
                <p className="text-[11px] uppercase text-white/50 mb-1">
                  {article.category || "General"} ·{" "}
                  {article.readTimeMinutes || 1} min read ·{" "}
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
                <h2 className="text-xl font-semibold">{article.title}</h2>
                {article.subtitle && (
                  <p className="mt-1 text-sm text-white/70 line-clamp-2">
                    {article.subtitle}
                  </p>
                )}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/15 px-2 py-[2px] text-[10px] text-white/70"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
