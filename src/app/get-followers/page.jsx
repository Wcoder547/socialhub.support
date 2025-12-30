"use client";

import DashboardNavbar from "../../components/DashboardNavbar";
import { CheckCircle2, Coins } from "lucide-react";
import Footer from "../../components/Footer";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreateTaskPage() {
  const router = useRouter();
  const [followers, setFollowers] = useState(50);
  const [reward, setReward] = useState(6);
  const [tiktokLink, setTiktokLink] = useState(
    "https://www.tiktok.com/@user123"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
const [errorMsg, setErrorMsg] = useState(null);

 const [showSuccess, setShowSuccess] = useState(false);
  const [lastTaskInfo, setLastTaskInfo] = useState(null);

  const min = 10;
  const max = 100;
  const percent = ((followers - min) / (max - min)) * 100;

  const { data: session, status } = useSession();
  const [localCoins, setLocalCoins] = useState(
    session?.user?.coins ?? 0
  );

  // keep localCoins in sync when session loads
  if (status === "authenticated" && localCoins !== session?.user?.coins) {
    setLocalCoins(session?.user?.coins ?? 0);
  }

  const coins = localCoins;
  const options = [4, 6, 8, 10];
  const recommended = 6;

  const totalCost = followers * reward;
  const remaining = coins - totalCost;
  const hasEnough = remaining >= 0;
  const shortBy = Math.abs(remaining);

  const handleCreateTask = async () => {
  if (!hasEnough || isSubmitting) return;
  setIsSubmitting(true);
  setErrorMsg(null);

  try {
    const res = await fetch("/api/tasks/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tiktokLink, followers, reward }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.error || "Failed to create task");
      return;
    }

    // Update coins locally
    setLocalCoins(data.newBalance);

    // Save task info for the dialog
    const info = {
      followers,
      reward,
      totalCost,
      remaining: data.newBalance,
      tiktokLink,
    };
    setLastTaskInfo(info);
    setShowSuccess(true);
  } catch (err) {
    console.error(err);
    setErrorMsg("Something went wrong.");
  } finally {
    setIsSubmitting(false);
  }
};


  // optionally block UI while session is loading
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#120814] text-white">
        <DashboardNavbar />
        <div className="p-8">Loading...</div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#120814] text-white">
        <DashboardNavbar />
{showSuccess && lastTaskInfo && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="w-full max-w-sm rounded-2xl bg-[#1b0d24] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Task Created!</h2>
          <p className="text-xs text-white/60">
            Your follower campaign has been created successfully.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-white/60">TikTok Link</span>
          <span className="max-w-[160px] truncate text-right">
            {lastTaskInfo.tiktokLink}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Followers</span>
          <span>{lastTaskInfo.followers}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Reward / follower</span>
          <span>{lastTaskInfo.reward} Coins</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Total Spent</span>
          <span className="font-semibold text-pink-400">
            {lastTaskInfo.totalCost} Coins
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">New Balance</span>
          <span className="font-semibold text-green-400">
            {lastTaskInfo.remaining} Coins
          </span>
        </div>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-full bg-pink-500 py-2.5 text-sm font-semibold text-white hover:bg-pink-600"
        onClick={() => {
          // Build query string to pass info to /earn-coins
          const params = new URLSearchParams({
            followers: String(lastTaskInfo.followers),
            reward: String(lastTaskInfo.reward),
            totalCost: String(lastTaskInfo.totalCost),
            remaining: String(lastTaskInfo.remaining),
          }).toString();

          router.push(`/earn-coins?${params}`);
        }}
      >
        View Details & Earn More
      </button>
    </div>
  </div>
)}

        <section className="bg-linear-to-b from-[#21061f] via-[#120814] to-[#120814]">
          <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
            {/* Top row */}
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              {/* ...same as before... */}

              {/* Balance card */}
              <button
                type="button"
                className="w-full max-w-xs rounded-3xl bg-[#1b0d24] px-6 py-4 text-left shadow-[0_18px_45px_rgba(0,0,0,0.6)] hover:bg-[#22102c]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500/20">
                    <Coins className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-white/60">
                      Current Balance
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {coins.toLocaleString()} Coins
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Middle layout */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
              {/* Left: form card */}
              <div className="rounded-[28px] bg-[#1b0d24] px-4 py-6 shadow-[0_26px_80px_rgba(0,0,0,0.7)] md:px-8 md:py-7">
                {/* TikTok link */}
                <div>
                  <div className="text-[11px] font-semibold text-white/60">
                    TikTok Link
                  </div>
                  <div className="mt-3 flex items-center rounded-full bg-[#200d28] px-4 py-3 text-xs text-white/60">
                    <input
                      type="text"
                      value={tiktokLink}
                      onChange={(e) => setTiktokLink(e.target.value)}
                      placeholder="Enter TikTok link here"
                      className="w-full bg-transparent text-sm text-white/80 outline-none placeholder:text-white/30"
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-white/40">
                    Paste your full TikTok profile link.
                  </p>
                </div>

                {/* Number of followers */}
                <div className="mt-8">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white/60">
                      Number of Followers
                    </span>
                    <span className="text-base font-semibold text-pink-400">
                      {followers}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#200d28] px-5 py-4">
                    <div className="relative h-2 rounded-full bg-[#2e1536]">
                      <div
                        className="absolute left-0 top-0 h-2 rounded-full bg-pink-500"
                        style={{ width: `${percent}%` }}
                      />
                      <input
                        type="range"
                        min={min}
                        max={max}
                        value={followers}
                        onChange={(e) => setFollowers(Number(e.target.value))}
                        className="absolute inset-0 h-2 w-full cursor-pointer opacity-0"
                      />
                      <div
                        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-pink-500 shadow-[0_0_0_6px_rgba(255,0,122,0.35)]"
                        style={{
                          left: `${percent}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    </div>

                    <div className="mt-3 flex justify-between text-[10px] text-white/40">
                      <span>10</span>
                      <span>250</span>
                      <span>500</span>
                      <span>1000</span>
                    </div>
                  </div>
                </div>

                {/* Reward per follower */}
                <div className="mt-8">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white/60">
                      Reward Per Follower
                    </span>
                    <span className="text-[11px] text-pink-400">
                      Higher = Faster
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-center text-[11px]">
                    {options.map((value) => {
                      const selected = value === reward;
                      const showRecommended = selected && value === recommended;

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setReward(value)}
                          className={
                            "relative flex h-16 w-16 flex-col items-center justify-center rounded-full border bg-[#200d28] transition " +
                            (selected
                              ? "border-pink-500 shadow-[0_0_0_5px_rgba(255,0,122,0.4)]"
                              : "border-white/10 hover:border-pink-500/60")
                          }>
                          {showRecommended && (
                            <span className="absolute -top-4 rounded-full bg-pink-500 px-2 py-0.5 text-[9px] font-semibold">
                              Recommended
                            </span>
                          )}
                          <span className="text-sm font-semibold">{value}</span>
                          <span className="text-[10px] text-white/50">
                            Coins
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right column: preview + summary */}
              <div className="space-y-6">
                {/* Task preview */}
                <button
                  type="button"
                  className="w-full rounded-3xl bg-[#1b0d24] px-6 py-5 text-left shadow-[0_24px_70px_rgba(0,0,0,0.7)] hover:bg-[#22102c]">
                  <div className="text-[11px] font-semibold text-white/60">
                    Task Preview
                  </div>
                  <div className="mt-4 flex items-center rounded-full bg-[#120814] px-3 py-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5d9a5] text-xs text-[#5b3b16]">
                      U
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-[10px] text-white/50">
                        TikTok Link
                      </div>
                      <div className="truncate text-xs font-semibold">
                        {tiktokLink || "https://www.tiktok.com/@yourprofile"}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-pink-500 px-3 py-1 text-[10px] font-semibold">
                      <span>+{reward}</span>
                      <span>🪙</span>
                    </div>
                  </div>
                </button>

                {/* Order summary */}
              {/* Order summary */}
<div className="flex flex-col rounded-3xl bg-[#1b0d24] px-6 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
  <div className="text-sm font-semibold">Order Summary</div>

  <div className="mt-4 space-y-3 text-xs">
    <div className="flex items-center justify-between">
      <span className="text-white/60">Target Followers</span>
      <span>{followers}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-white/60">Cost per Follower</span>
      <span>{reward} Coins</span>
    </div>
  </div>

  <div className="mt-5 border-t border-white/10 pt-4 text-xs">
    <div className="flex items-center justify-between">
      <span className="text-white/60">Total Cost</span>
      <span className="text-2xl font-semibold text-pink-400">
        {totalCost}
      </span>
    </div>

    {hasEnough ? (
      <div className="mt-2 text-right text-[11px] text-white/60">
        Remaining:{" "}
        <span className="font-semibold text-green-400">
          {remaining} Coins
        </span>
      </div>
    ) : (
      <div className="mt-2 text-right text-[11px] text-red-400">
        Insufficient balance. You need{" "}
        <span className="font-semibold">
          {shortBy} more Coins
        </span>
        .
      </div>
    )}
  </div>

  {errorMsg && (
    <p className="mt-2 text-xs text-red-400 text-right">
      {errorMsg}
    </p>
  )}

  <button
    type="button"
    disabled={!hasEnough || isSubmitting}
    className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold shadow-[0_18px_45px_rgba(255,0,122,0.7)] ${
      hasEnough && !isSubmitting
        ? "bg-pink-500 text-white hover:bg-pink-600"
        : "bg-pink-500/40 text-white/60 cursor-not-allowed"
    }`}
    onClick={handleCreateTask}
  >
    <span>🚀</span>
    <span>
      {isSubmitting
        ? "Creating..."
        : hasEnough
        ? "Create Task"
        : "Insufficient Coins"}
    </span>
  </button>
</div>

              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
