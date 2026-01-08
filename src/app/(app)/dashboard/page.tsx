"use client";

import DashboardNavbar from "@/src/components/DashboardNavbar";
import { Rocket, TrendingUp, Instagram, Youtube } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

function TikTokLogo() {
  return (
    <div className="relative flex h-5 w-5 items-center justify-center">
      <span className="absolute translate-x-[1px] translate-y-[1px] text-[18px] text-[#25f4ee] leading-none">
        ♬
      </span>
      <span className="absolute -translate-x-[1px] text-[18px] text-[#fe2c55] leading-none">
        ♬
      </span>
      <span className="relative text-[18px] text-white leading-none">♬</span>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const name = session?.user?.name || "User";

  return (
    <main className="min-h-screen bg-[#120814] text-white">
      <DashboardNavbar />

      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        {/* welcome */}
        <section className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-pink-400/80">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
              Welcome back, {name}!
            </h1>
            <p className="mt-3 text-sm text-white/70">
              Everything you need to grow your TikTok and other social accounts in one place.
            </p>
          </div>
        </section>

        {/* TikTok section label */}
        <section className="mx-auto mt-10 max-w-5xl px-4 md:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-pink-400/80">
                TikTok tools
              </p>
              <p className="mt-1 text-xs text-white/60">
                These cards are focused on TikTok: earn coins and convert them into followers.
              </p>
            </div>
          </div>

          {/* TikTok cards */}
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {/* Earn Coins (TikTok) */}
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#21102a] via-[#1b0d24] to-[#120814] px-8 py-9 shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-pink-500/20 blur-2xl" />
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-3 py-1 text-[11px] text-pink-200">
                <TikTokLogo />
                <span>TikTok · Earn coins</span>
              </div>

              <h2 className="text-xl font-semibold">Earn Coins from TikTok</h2>
              <p className="mt-3 max-w-md text-sm text-white/70">
                Follow TikTok creators, upload your proof, and stack coins effortlessly while
                discovering new content.
              </p>

              <div className="mt-6 flex items-center justify-between text-xs">
                <span className="text-white/60">Current Rate</span>
                <span className="rounded-full bg-[#0f3d1a] px-4 py-1 text-[11px] font-semibold text-[#45e86c]">
                  +5 COINS / FOLLOW
                </span>
              </div>

              <Link
                href="/earn-coins"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#2b102f] py-3 text-sm font-semibold text-white hover:bg-[#35143a]"
              >
                <span>Open TikTok tasks</span>
                <TrendingUp className="h-4 w-4" />
              </Link>
            </div>

            {/* Get Followers (TikTok) */}
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#281126] via-[#1b0d24] to-[#120814] px-8 py-9 shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-pink-500/25 blur-2xl" />
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-3 py-1 text-[11px] text-pink-200">
                <TikTokLogo />
                <span>TikTok · Get followers</span>
              </div>

              <h2 className="text-xl font-semibold">Turn Coins into Followers</h2>
              <p className="mt-3 max-w-md text-sm text-white/70">
                Launch a TikTok follower campaign, target your ideal audience, and give every
                video a stronger push.
              </p>

              <div className="mt-6 flex items-center justify-between text-xs">
                <span className="text-white/60">Est. Reach</span>
                <span className="flex items-center gap-1 text-pink-400">
                  <span className="h-2 w-2 rounded-full bg-pink-500" />
                  <span>High</span>
                </span>
              </div>

              <Link
                href="/get-followers"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-pink-500 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(255,0,122,0.7)] hover:bg-pink-600"
              >
                <span>Launch TikTok campaign</span>
                <Rocket className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Other social platforms – cards navigate with ?platform=... */}
        <section className="mx-auto mt-10 max-w-5xl px-4 md:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-300/80">
                Other social platforms
              </p>
              <p className="mt-1 text-xs text-white/60">
                Run separate campaigns for Facebook, Instagram, and YouTube with a single tap.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {/* Facebook followers */}
            <Link
              href="/get-followers/social?platform=facebook"
              className="group relative overflow-hidden rounded-[32px] bg-[#151224] px-5 py-6 shadow-[0_22px_70px_rgba(0,0,0,0.8)] ring-1 ring-white/5 transition-transform duration-200 hover:-translate-y-1 hover:ring-blue-400/60"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/30 blur-2xl" />
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1877f2] text-white shadow-[0_0_18px_rgba(24,119,242,0.7)]">
                <span className="text-lg font-black leading-none">f</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold">Facebook Followers</h3>
              <p className="mt-2 text-[11px] text-white/70">
                Grow your pages and profiles with balanced, page‑safe follower campaigns.
              </p>
              <div className="mt-4 flex items-center justify-between text-[11px] text-white/60">
                <span>Best for pages & creators</span>
                <span className="text-xs font-semibold text-blue-300 group-hover:text-blue-200">
                  Open →
                </span>
              </div>
            </Link>

            {/* Instagram followers */}
            <Link
              href="/get-followers/social?platform=instagram"
              className="group relative overflow-hidden rounded-[32px] bg-[#181024] px-5 py-6 shadow-[0_22px_70px_rgba(0,0,0,0.8)] ring-1 ring-white/5 transition-transform duration-200 hover:-translate-y-1 hover:ring-pink-400/60"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-pink-500/40 blur-2xl" />
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow-[0_0_18px_rgba(244,114,182,0.7)]">
                <Instagram className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">Instagram Followers</h3>
              <p className="mt-2 text-[11px] text-white/70">
                Perfect for reels and aesthetic feeds that need clean, consistent growth.
              </p>
              <div className="mt-4 flex items-center justify-between text-[11px] text-white/60">
                <span>Visual‑first campaigns</span>
                <span className="text-xs font-semibold text-pink-300 group-hover:text-pink-200">
                  Open →
                </span>
              </div>
            </Link>

            {/* YouTube subscribers */}
            <Link
              href="/get-followers/social?platform=youtube"
              className="group relative overflow-hidden rounded-[32px] bg-[#1c1018] px-5 py-6 shadow-[0_22px_70px_rgba(0,0,0,0.8)] ring-1 ring-white/5 transition-transform duration-200 hover:-translate-y-1 hover:ring-red-400/60"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-red-500/40 blur-2xl" />
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ff0000] text-white shadow-[0_0_18px_rgba(239,68,68,0.7)]">
                <Youtube className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">YouTube Subscribers</h3>
              <p className="mt-2 text-[11px] text-white/70">
                Drive subs to your channel and give new uploads a stronger first wave.
              </p>
              <div className="mt-4 flex items-center justify-between text-[11px] text-white/60">
                <span>Great for long‑form & shorts</span>
                <span className="text-xs font-semibold text-red-300 group-hover:text-red-200">
                  Open →
                </span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
