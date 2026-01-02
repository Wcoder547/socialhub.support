"use client";

import { useEffect, useState } from "react";
import Footer from "@/src/components/Footer";
import { CheckCircle2, ExternalLink } from "lucide-react";
import Image from "next/image";
import DashboardNavbar from "@/src/components/DashboardNavbar";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  tiktokLink: string;
  followers: number;
  rewardPerFollower: number;
  totalCost: number;
  status: string;
  userPhoto?: string | null;
  userName?: string | null;
}

const fallbackProfiles = [
  {
    id: 1,
    handle: "@sarah_dances",
    category: "Dance & Lifestyle",
    coins: 50,
    avatar: "/avatars/sarah.jpg",
  },
];

export default function EarnCoinsPage() {
  const router = useRouter();

  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [canVerify, setCanVerify] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [verifying, setVerifying] = useState<Record<string, boolean>>({});

  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("completedTasks");
    if (!stored || stored.trim().length === 0) {
      localStorage.setItem("completedTasks", JSON.stringify({}));
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Record<string, boolean>;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        setCompleted(parsed);
      } else {
        localStorage.setItem("completedTasks", JSON.stringify({}));
      }
    } catch (err) {
      console.error("Failed to parse completedTasks from localStorage", err);
      localStorage.setItem("completedTasks", JSON.stringify({}));
    }
  }, []);

  
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("completedTasks", JSON.stringify(completed));
  }, [completed]);

  // load tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) {
          setTasks([]);
          return;
        }
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error("Fetch tasks error:", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const hasTasks = tasks.length > 0;

  
  const handleVerify = async (taskId: string) => {
    if (!canVerify[taskId] || verifying[taskId]) return;

    setVerifying((prev) => ({ ...prev, [taskId]: true }));
    try {
      const res = await fetch("/api/tasks/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });

      const text = await res.text();
      let data= null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        console.error("verify JSON parse error:", e, "raw:", text);
      }

      if (!res.ok) {
        console.error("Verify error:", data?.error || text);
        return;
      }

      setCompleted((prev) => ({ ...prev, [taskId]: true }));
      router.refresh();
    } catch (e) {
      console.error("Verify request failed:", e);
    } finally {
      setVerifying((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  
  const handleOpenProfile = async (task: Task) => {
    try {
      const res = await fetch("/api/tasks/open", { method: "POST" });

      if (!res.ok) {
  const data = await res.json().catch(() => null);
  setErrorMessage(
    data?.error ||
      "You've hit today's limit for opening TikTok profiles. Please try again tomorrow."
  );
  return;
}


      // allowed -> keep your old logic
      setHighlighted(task._id);
      setCanVerify((prev) => ({
        ...prev,
        [task._id]: false,
      }));
      setTimeout(() => {
        setCanVerify((prev) => ({
          ...prev,
          [task._id]: true,
        }));
      }, 15000);

      window.open(task.tiktokLink, "_blank", "noopener");
    } catch (e) {
      console.error("Open profile error:", e);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#120814] text-white">
      

        <DashboardNavbar />

        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
 {errorMessage && (
  <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
    <div className="flex max-w-sm items-center gap-2 rounded-full bg-[#1b0d24] px-4 py-2 text-xs text-pink-50 shadow-[0_18px_45px_rgba(0,0,0,0.7)] border border-pink-500/40">
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold">
        !
      </span>
      <span className="flex-1">{errorMessage}</span>
      <button
        onClick={() => setErrorMessage(null)}
        className="text-[10px] text-pink-200 hover:text-pink-100"
      >
        Close
      </button>
    </div>
  </div>
)}


          <header className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_auto] md:items-center">
            <div className="ml-0 md:ml-6">
              <h1 className="text-3xl font-semibold md:text-4xl">
                Earn Coins
              </h1>
              <p className="mt-3 max-w-xl text-sm text-white/70">
                Complete tasks below to stack up your balance. Follow creators
                and verify to earn instantly.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-start gap-2 text-xs md:justify-end">
              <button className="rounded-full bg-pink-500 px-4 py-2 font-semibold text-white shadow-[0_10px_30px_rgba(255,0,122,0.5)]">
                High Reward
              </button>
              <button className="rounded-full bg-[#261027] px-4 py-2 text-white/70 hover:bg-[#311336]">
                Newest
              </button>
              <button className="rounded-full bg-[#261027] px-4 py-2 text-white/70 hover:bg-[#311336]">
                Trending
              </button>
            </div>
          </header>

          <section className="mt-10 grid gap-6 md:grid-cols-4 lg:grid-cols-4">
            {/* Loading */}
            {loading && (
              <div className="col-span-4 text-center text-sm text-white/60">
                Loading tasks...
              </div>
            )}

            {/* Real tasks */}
            {hasTasks &&
              tasks.map((task) => {
                const isHighlighted = highlighted === task._id;
                const canV = !!canVerify[task._id];
                const isVerifying = !!verifying[task._id];
                const isCompleted = !!completed[task._id];

                return (
                  <div
                    key={task._id}
                    className={`relative flex flex-col rounded-4xl px-5 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.7)] ${
                      isCompleted ? "bg-[#140b1a] opacity-60" : "bg-[#1b0d24]"
                    }`}
                  >
                    {/* coins badge */}
                    <div className="absolute right-4 top-4 rounded-full bg-pink-500 px-3 py-1 text-[10px] font-semibold">
                      +{task.rewardPerFollower} Coins / follow
                    </div>

                    {/* completed badge */}
                    {isCompleted && (
                      <div className="absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1 text-[10px] font-semibold">
                        Completed
                      </div>
                    )}

                    {/* avatar */}
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-pink-500/60 bg-black shadow-[0_0_0_6px_rgba(255,255,255,0.07)]">
                      {task.userPhoto ? (
                        <Image
                          src={task.userPhoto}
                          alt={task.userName || "User"}
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg">🎵</span>
                      )}
                    </div>

                    {/* handle & target */}
                    <div className="text-center">
                      <div className="text-sm font-semibold">
                        TikTok Campaign
                      </div>
                      <div className="mt-1 text-[11px] text-white/60">
                        Target: {task.followers} followers
                      </div>
                    </div>

                    {/* actions */}
                    <div className="mt-6 space-y-3 text-[11px]">
                      <button
                        type="button"
                        disabled={isCompleted}
                        onClick={() => {
                          if (isCompleted) return;
                          handleOpenProfile(task);
                        }}
                        className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                          isCompleted
                            ? "bg-[#241027]/40 text-white/40 cursor-not-allowed"
                            : "bg-[#241027] text-white/80 hover:bg-[#2d1231]"
                        }`}
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>
                          {isCompleted
                            ? "Already Verified"
                            : "Open TikTok Profile"}
                        </span>
                      </button>

                      {isCompleted ? (
                        <>
                          <button
                            disabled
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#062d16]/40 px-4 py-2 text-xs font-semibold text-[#45e86c]/60 cursor-not-allowed"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Coins Added</span>
                          </button>
                          <button
                            disabled
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-pink-500/30 px-4 py-2 text-xs font-semibold text-white/60 cursor-not-allowed"
                          >
                            <span>Verified</span>
                          </button>
                        </>
                      ) : isHighlighted ? (
                        <>
                          <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#062d16] px-4 py-2 text-xs font-semibold text-[#45e86c]">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Link Opened</span>
                          </button>

                          <button
                            type="button"
                            disabled={!canV || isVerifying}
                            onClick={() => handleVerify(task._id)}
                            className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-[0_10px_30px_rgba(255,0,122,0.6)] ${
                              canV && !isVerifying
                                ? "bg-pink-500 text-white hover:bg-pink-600"
                                : "bg-pink-500/40 text-white/60 cursor-not-allowed"
                            }`}
                          >
                            <span>
                              {isVerifying
                                ? "Verifying..."
                                : canV
                                ? "Verify Now"
                                : "Wait 15s to verify"}
                            </span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#241027] px-4 py-2 text-xs font-semibold text-white/80 hover:bg-[#2d1231]">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Verify Follow</span>
                          </button>
                          <p className="text-center text-[10px] text-white/35">
                            Click follow, then return to verify.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Fallback static card */}
            {!loading &&
              !hasTasks &&
              fallbackProfiles.map((p) => {
                const isHighlighted = highlighted === String(p.id);

                return (
                  <div
                    key={p.id}
                    className="relative flex flex-col rounded-4xl bg-[#1b0d24] px-5 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.7)]"
                  >
                    <div className="absolute right-4 top-4 rounded-full bg-pink-500 px-3 py-1 text-[10px] font-semibold">
                      {p.coins} Coins
                    </div>

                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-pink-500/60 bg-black shadow-[0_0_0_6px_rgba(255,255,255,0.07)]">
                      <Image
                        src={p.avatar}
                        height={68}
                        width={68}
                        alt={p.handle}
                        className="rounded-full object-cover"
                      />
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-semibold">{p.handle}</div>
                      <div className="mt-1 text-[11px] text-white/60">
                        {p.category}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3 text-[11px]">
                      <a
                        href="https://www.tiktok.com/@malikshb.1"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setHighlighted(String(p.id))}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#241027] px-4 py-2 text-xs font-semibold text-white/80 hover:bg-[#2d1231]"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Follow on TikTok</span>
                      </a>

                      {isHighlighted ? (
                        <>
                          <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#062d16] px-4 py-2 text-xs font-semibold text-[#45e86c]">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Link Opened</span>
                          </button>
                          <button className="flex w-full items-center justify-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(255,0,122,0.6)] hover:bg-pink-600">
                            <span>Verify Now</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#241027] px-4 py-2 text-xs font-semibold text-white/80 hover:bg-[#2d1231]">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Verify Follow</span>
                          </button>
                          <p className="text-center text-[10px] text-white/35">
                            Click follow, then return to verify.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
