"use client";

import { useState } from "react";
import Footer from "@/src/components/Footer";
import { CheckCircle2, ExternalLink } from "lucide-react";
import Image from "next/image";
import DashboardNavbar from "@/src/components/DashboardNavbar";

const profiles = [
  {
    id: 1,
    handle: "@sarah_dances",
    category: "Dance & Lifestyle",
    coins: 50,
    avatar: "/avatars/sarah.jpg",
  },
];

export default function EarnCoinsPage() {
  const [highlighted, setHighlighted] = useState<number | null>(null);

  return (
    <>
      <main className="min-h-screen bg-[#120814] text-white">
        {/* Navbar */}
        <DashboardNavbar />

        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          {/* Heading */}
          <header className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_auto] md:items-center">
            {/* Left: title + description */}
            <div className="ml-0 md:ml-6">
              <h1 className="text-3xl font-semibold md:text-4xl">Earn Coins</h1>
              <p className="mt-3 max-w-xl text-sm text-white/70">
                Complete tasks below to stack up your balance. Follow creators
                and verify to earn instantly.
              </p>
            </div>

            {/* Right: filter pills */}
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

          {/* Cards grid */}
          <section className="mt-10 grid gap-6 md:grid-cols-4 lg:grid-cols-4">
            {profiles.map((p) => {
              const isHighlighted = highlighted === p.id;

              return (
                <div
                  key={p.id}
                  className="relative flex flex-col rounded-4xl bg-[#1b0d24] px-5 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.7)]"
                >
                  {/* coins badge */}
                  <div className="absolute right-4 top-4 rounded-full bg-pink-500 px-3 py-1 text-[10px] font-semibold">
                    {p.coins} Coins
                  </div>

                  {/* avatar */}
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-pink-500/60 bg-black shadow-[0_0_0_6px_rgba(255,255,255,0.07)]">
                    <Image
                      src={p.avatar}
                      height={68}
                      width={68}
                      alt={p.handle}
                      className="rounded-full object-cover"
                    />
                  </div>

                  {/* handle & category */}
                  <div className="text-center">
                    <div className="text-sm font-semibold">{p.handle}</div>
                    <div className="mt-1 text-[11px] text-white/60">
                      {p.category}
                    </div>
                  </div>

                  {/* actions */}
                  <div className="mt-6 space-y-3 text-[11px]">
                    <a
                      href="https://www.tiktok.com/@malikshb.1"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setHighlighted(p.id)}
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
