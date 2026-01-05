"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";

interface LmsArticle {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  type: "article" | "video";
  tags?: string[];
  category?: string;
  isPublished: boolean;
  readTimeMinutes?: number;
  createdAt: string;
}

export default function AdminLmsArticlesPage() {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [articles, setArticles] = useState<LmsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<"article" | "video">("article");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // success dialog
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/lms/articles");
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Failed to load LMS articles");
        setArticles([]);
        return;
      }
      setArticles(data.articles || []);
    } catch (err) {
      console.error("Fetch LMS articles error:", err);
      setError("Error loading LMS articles");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const isYouTubeUrl = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes("youtube.com/watch") || lower.includes("youtu.be/");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      alert("Title and body are required");
      return;
    }
    if (type === "video") {
      if (!youtubeUrl) {
        alert("Paste YouTube URL");
        return;
      }
      if (!isYouTubeUrl(youtubeUrl)) {
        alert("Please paste a valid YouTube URL");
        return;
      }
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/lms/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          body, // TinyMCE HTML
          type,
          youtubeUrl,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          category,
          isPublished,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Failed to create article");
        return;
      }

      // reset form
      setTitle("");
      setSubtitle("");
      setBody("");
      setType("article");
      setYoutubeUrl("");
      setTags("");
      setCategory("");
      setIsPublished(false);

      setSuccessTitle(title);
      setShowSuccess(true);

      await fetchArticles();
    } catch (err) {
      console.error("Create article error:", err);
      alert("Failed to create article");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#08030c] text-white flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-white/10 bg-[#120814]
          transform transition-transform duration-200
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0
        `}
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-pink-500 flex items-center justify-center text-xs font-bold shadow-[0_10px_30px_rgba(255,0,122,0.7)]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Follower Admin</h1>
              <p className="mt-1 text-[11px] text-white/60">
                Guides, rules & updates for SocialHub.
              </p>
            </div>
          </div>

          {/* close on mobile */}
          <button
            className="md:hidden text-white/60 text-xs px-2 py-1 rounded-full hover:bg-white/10"
            onClick={() => setIsSidebarOpen(false)}
          >
            Close
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 text-sm space-y-2">
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              router.push("/admin/dashboard");
            }}
            className="w-full rounded-xl bg-transparent px-3 py-2 text-left text-white/70 hover:bg-[#241027]"
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              setIsSidebarOpen(false);
              router.push("/admin/proofs");
            }}
            className="w-full rounded-xl bg-transparent px-3 py-2 text-left text-white/70 hover:bg-[#241027]"
          >
            Review Proofs
          </button>

          <button className="w-full rounded-xl bg-[#241027] px-3 py-2 text-left font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            LMS Articles
          </button>
        </nav>

        <div className="px-4 pb-4 text-[11px] text-white/40 space-y-1">
          <p>Use LMS to educate users about safe growth.</p>
          <p>Explain how coins, followers & rules work.</p>
        </div>
      </aside>

      {/* dark overlay on mobile when sidebar open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <section className="flex-1 md:ml-0 ml-0">
        {/* Top bar */}
        <header className="border-b border-white/10 bg-[#14071b]/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
            <div className="flex items-center gap-3">
              {/* mobile sidebar button */}
              <button
                className="md:hidden rounded-full bg-[#241027] p-2 text-white/80 hover:bg-[#311336]"
                onClick={() => setIsSidebarOpen(true)}
              >
                <span className="block h-0.5 w-4 bg-white mb-1" />
                <span className="block h-0.5 w-4 bg-white mb-1" />
                <span className="block h-0.5 w-4 bg-white" />
              </button>

              <div>
                <h2 className="text-lg font-semibold">LMS Articles</h2>
                <p className="text-xs text-white/60">
                  Publish SocialHub guides about coins, safe follow‑for‑follow,
                  and TikTok growth.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page body */}
        <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
          {/* Create article form */}
          <section className="rounded-2xl border border-white/10 bg-[#130818] p-5 space-y-4">
            <h2 className="text-lg font-semibold">Create new article</h2>
            <form onSubmit={handleCreate} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs text-white/60 mb-1">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm outline-none border border-white/10"
                  placeholder="How SocialHub coins work (step-by-step)"
                />
                <p className="mt-1 text-[11px] text-white/40">
                  Slug will be generated automatically from the title.
                </p>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1">
                  Subtitle (optional)
                </label>
                <input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm outline-none border border-white/10"
                  placeholder="Earn coins by following and spend them to get real followers."
                />
              </div>

              <div className="grid gap-3 md:grid-cols-3 items-end">
                <div>
                  <label className="block text-xs text-white/60 mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as "article" | "video")
                    }
                    className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm outline-none border border-white/10"
                  >
                    <option value="article">Article only</option>
                    <option value="video">Article + YouTube tutorial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">
                    Category (optional)
                  </label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm outline-none border border-white/10"
                    placeholder="getting-started / safety / coins / faq"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="published"
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label
                    htmlFor="published"
                    className="text-xs text-white/80 select-none"
                  >
                    Published (visible on Learn page)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1">
                  Tags (comma separated, optional)
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm outline-none border border-white/10"
                  placeholder="coins, follow-for-follow, safety, limits"
                />
              </div>

              {/* body text with TinyMCE */}
              <div>
                <label className="block text-xs text-white/60 mb-1">
                  Body (article content)
                </label>
                <div className="rounded-lg border border-white/10 overflow-hidden bg-black">
                  <Editor
                    apiKey="pw1l9vabfi2nn4nuvkyfcs1al0mri9rie0llsh6lxx7vdrss" //API_KEY
                    value={body}
                    onEditorChange={(content) => setBody(content)}
                    init={{
                      height: 400,
                      menubar: false,
                      plugins:
                        "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount",
                      toolbar:
                        "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | removeformat | code",
                      skin: "oxide-dark",
                      content_css: "dark",
                      branding: false,
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-white/40">
                  Use headings, lists and links. This rich text will be rendered
                  on the Learn page.
                </p>
              </div>

              {/* YouTube URL */}
              {type === "video" && (
                <div>
                  <label className="block text-xs text-white/60 mb-1">
                    YouTube URL (optional)
                  </label>
                  <input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm outline-none border border-white/10"
                    placeholder="https://www.youtube.com/watch?v=xxxxx – SocialHub walkthrough or safety tutorial"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={`mt-2 rounded-full px-5 py-2 text-xs font-semibold ${
                  submitting
                    ? "bg-green-500/40 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {submitting ? "Publishing..." : "Publish article"}
              </button>
            </form>
          </section>

          {/* Existing articles */}
          <section className="rounded-2xl border border-white/10 bg-[#130818] p-4">
            <h2 className="text-lg font-semibold mb-3">Existing articles</h2>
            {loading ? (
              <p className="text-xs text-white/60">Loading...</p>
            ) : error ? (
              <p className="text-xs text-red-400">{error}</p>
            ) : articles.length === 0 ? (
              <p className="text-xs text-white/60">
                No articles yet. Create your first SocialHub guide above.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {articles.map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                  >
                    <div>
                      <p className="font-semibold">{a.title}</p>
                      <p className="text-white/50">
                        /learn/{a.slug} · {a.type} ·{" "}
                        {a.isPublished ? "Published" : "Draft"} ·{" "}
                        {a.readTimeMinutes || 1} min read
                      </p>
                    </div>
                    <span className="text-[10px] text-white/40">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Success dialog */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-[#130818] px-5 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
              <h3 className="text-sm font-semibold">Article published</h3>
              <p className="mt-2 text-xs text-white/70">
                “{successTitle || "Your article"}” is now saved in the LMS. If
                it is marked as <span className="font-semibold">Published</span>
                , users will see it on the Learn page.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowSuccess(false)}
                  className="rounded-full bg-white/10 px-4 py-1.5 text-[11px] text-white/80 hover:bg-white/15"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    router.push("/learn");
                  }}
                  className="rounded-full bg-green-500 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-green-600"
                >
                  View Learn page
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
