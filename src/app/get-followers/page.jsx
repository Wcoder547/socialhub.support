"use client";

import DashboardNavbar from "../../components/DashboardNavbar";
import { Coins } from "lucide-react";
import Footer from "../../components/Footer";
import { useState } from "react";

export default function CreateTaskPage() {
  const [followers, setFollowers] = useState(50);
  const min = 10;
  const max = 100;
  const percent = ((followers - min) / (max - min)) * 100;

  const [reward, setReward] = useState(6);
  const [balance, setBalance] = useState(1250);
  const [tiktokLink, setTiktokLink] = useState(
    "https://www.tiktok.com/@user123"
  );

  const options = [4, 6, 8, 10];
  const recommended = 6;

  const totalCost = followers * reward;
  const remaining = balance - totalCost;
  const hasEnough = remaining >= 0;
  const shortBy = Math.abs(remaining);

  return (
    <>
      <main className="min-h-screen bg-[#120814] text-white">
        <DashboardNavbar />

        <section className="bg-linear-to-b from-[#21061f] via-[#120814] to-[#120814]">
          <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
            {/* Top row */}
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <div>
                <h1 className="text-2xl font-semibold md:text-4xl">
                  Create New Task
                </h1>
                <p className="mt-3 max-w-xl text-sm text-white/70">
                  Spend your coins to gain real TikTok followers quickly. Setup
                  your campaign below.
                </p>
              </div>

              {/* Balance card */}
              <button
                type="button"
                className="w-full max-w-xs rounded-3xl bg-[#1b0d24] px-6 py-4 text-left shadow-[0_18px_45px_rgba(0,0,0,0.6)] hover:bg-[#22102c]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500/20">
                    <Coins className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-white/60">
                      Current Balance
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {balance.toLocaleString()} Coins
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

                  <button
                    type="button"
                    disabled={!hasEnough}
                    className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold shadow-[0_18px_45px_rgba(255,0,122,0.7)] ${
                      hasEnough
                        ? "bg-pink-500 text-white hover:bg-pink-600"
                        : "bg-pink-500/40 text-white/60 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (!hasEnough) return;
                      alert(
                        `Creating task for ${followers} followers at ${reward} coins each\nCost: ${totalCost}\nRemaining: ${remaining}`
                      );
                    }}>
                    <span>🚀</span>
                    <span>
                      {hasEnough ? "Create Task" : "Insufficient Coins"}
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
