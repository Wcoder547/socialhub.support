"use client";

import Image from "next/image";
import {
  UserPlusIcon,
  ShieldCheckIcon,
  LinkIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  MusicalNoteIcon,
  CameraIcon,
  PlayCircleIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/solid";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#120814] text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#180819]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500">
              <span className="text-xs font-bold">▲</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">
              socialhub.support
            </span>
          </div>

          {/* Auth + Learn */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {/* New / Learn button – visible on mobile + desktop */}
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-3 py-2 text-[11px] font-semibold text-white shadow-[0_8px_24px_rgba(255,0,122,0.6)] hover:brightness-110 transition"
            >
              <span className="text-[13px]">✨</span>
              <span>New · Learn</span>
            </Link>

            <Link
              className="hidden rounded-full bg-[#30112f] px-5 py-2 font-semibold text-white hover:bg-[#3a1839] md:inline-block"
              href="/sign-in"
            >
              Login
            </Link>

            <Link
              className="rounded-full bg-pink-500 px-5 py-2 font-semibold text-white shadow-[0_0_20px_rgba(255,0,122,0.6)] hover:bg-pink-600"
              href="/sign-up"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6 md:pt-16">
        {/* HERO */}
        <section className="flex flex-col items-center gap-12 md:flex-row md:items-start">
          {/* Left */}
          <div className="max-w-xl space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Grow Your <br />
              TikTok <br />
              <span className="text-pink-500">Followers</span> Fast <br />& Free
            </h1>

            <p className="text-sm text-white/70 md:text-[13px]">
              Join the #1 community for creators. Earn coins by following others
              and spend coins to get real followers.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button className="rounded-full bg-pink-500 px-7 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_12px_35px_rgba(255,0,122,0.7)] hover:bg-pink-600">
                Get 50 Free Coins
              </button>
              <button className="rounded-full border border-white/15 bg-white/5 px-7 py-3 text-xs font-semibold uppercase tracking-wide text-white hover:bg-white/10">
                How it works
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-1 text-[11px] text-white/60">
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-green-500 text-[10px] text-green-400">
                  ✓
                </span>
                <span>No password required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-green-500 text-[10px] text-green-400">
                  ✓
                </span>
                <span>Real users only</span>
              </div>
            </div>
          </div>

          {/* Right phones */}
          <div className="relative flex w-full justify-center md:w-auto">
            {/* Labels */}
            <span className="absolute -top-3 left-4 text-2xl font-extrabold text-white md:-top-8 md:left-2 md:text-[32px]">
              Before
            </span>
            <span className="absolute -top-3 right-2 text-2xl font-extrabold text-pink-500 md:-top-8 md:right-0 md:text-[32px]">
              After
            </span>

            {/* Images */}
            <div className="mt-8 flex w-full max-w-80 items-center justify-center gap-3 sm:max-w-96 md:max-w-[420px]">
              {/* Before phone */}
              <div className="-rotate-6 overflow-hidden rounded-4xl border border-black/10 bg-black shadow-2xl">
                <Image
                  src="/before.png"
                  alt="TikTok profile before growth"
                  width={420}
                  height={420}
                  className="h-full w-full max-h-96 object-cover"
                />
              </div>

              {/* After phone */}
              <div className="rotate-6 overflow-hidden rounded-4xl border border-pink-200/80 bg-black shadow-[0_20px_45px_rgba(255,0,122,0.55)]">
                <Image
                  src="/after.png"
                  alt="TikTok profile after growth"
                  width={420}
                  height={420}
                  className="h-full w-full max-h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-14 grid gap-6 md:grid-cols-3">
          {/* Followers Delivered */}
          <div className="flex flex-col items-center justify-center rounded-[30px] bg-[#1a0d24] px-8 py-8 text-center sm:px-10 sm:py-10">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15">
              <UserPlusIcon className="h-5 w-5 text-pink-500" />
            </div>
            <div className="text-2xl font-extrabold text-pink-500">1M+</div>
            <div className="mt-2 text-sm font-semibold text-white">
              Followers Delivered
            </div>
          </div>

          {/* Active Users */}
          <div className="flex flex-col items-center justify-center rounded-[30px] bg-[#1a0d24] px-8 py-8 text-center sm:px-10 sm:py-10">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15">
              <ShieldCheckIcon className="h-5 w-5 text-pink-500" />
            </div>
            <div className="text-2xl font-extrabold text-pink-500">50k+</div>
            <div className="mt-2 text-sm font-semibold text-white">
              Active Users
            </div>
          </div>

          {/* Coins Earned */}
          <div className="flex flex-col items-center justify-center rounded-[30px] bg-[#1a0d24] px-8 py-8 text-center sm:px-10 sm:py-10">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15">
              <BanknotesIcon className="h-5 w-5 text-pink-500" />
            </div>
            <div className="text-2xl font-extrabold text-pink-500">10M+</div>
            <div className="mt-2 text-sm font-semibold text-white">
              Coins Earned
            </div>
          </div>
        </section>

        {/* OUR OFFERINGS + CHOOSE YOUR PLATFORM */}
        <section className="mt-20">
          <div className="text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-pink-500">
            Our Offerings
          </div>
          <h2 className="mt-2 text-center text-2xl font-semibold">
            Choose Your Platform
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {/* TikTok */}
            <div className="rounded-[30px] bg-[#1a0d24] px-6 py-8 text-left">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15">
                <MusicalNoteIcon className="h-5 w-5 text-pink-500" />
              </div>
              <h3 className="text-sm font-semibold leading-snug">
                Instant free TikTok <br />
                followers
              </h3>
              <p className="mt-3 text-[11px] leading-relaxed text-white/60">
                Boost your TikTok visibility with real, active followers
                instantly.
              </p>
            </div>

            {/* Instagram */}
            <div className="rounded-[30px] bg-[#1a0d24] px-6 py-8 text-left">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15">
                <CameraIcon className="h-5 w-5 text-pink-500" />
              </div>
              <h3 className="text-sm font-semibold leading-snug">
                Instant free Instagram <br />
                followers
              </h3>
              <p className="mt-3 text-[11px] leading-relaxed text-white/60">
                Grow your Instagram audience and engagement organically.
              </p>
            </div>

            {/* YouTube */}
            <div className="rounded-[30px] bg-[#1a0d24] px-6 py-8 text-left">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15">
                <PlayCircleIcon className="h-5 w-5 text-pink-500" />
              </div>
              <h3 className="text-sm font-semibold leading-snug">
                Instant free YouTube <br />
                subscribers
              </h3>
              <p className="mt-3 text-[11px] leading-relaxed text-white/60">
                Gain more subscribers and watch time for your YouTube channel.
              </p>
            </div>

            {/* Facebook */}
            <div className="rounded-[30px] bg-[#1a0d24] px-6 py-8 text-left">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15">
                <HandThumbUpIcon className="h-5 w-5 text-pink-500" />
              </div>
              <h3 className="text-sm font-semibold leading-snug">
                Instant free Facebook <br />
                followers
              </h3>
              <p className="mt-3 text-[11px] leading-relaxed text-white/60">
                Build a strong community on Facebook with genuine followers.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-20">
          {/* Heading */}
          <div className="text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-pink-500">
            Get Started In Minutes
          </div>
          <h2 className="mt-2 text-center text-2xl font-semibold">
            How It Works
          </h2>
          <p className="mt-3 text-center text-[11px] text-white/60 md:text-xs">
            Our coin economy ensures a fair exchange of engagement between real
            users. It&apos;s safe, simple, and effective.
          </p>

          {/* Steps */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative overflow-hidden rounded-[30px] bg-[#1a0d24] px-6 py-8 text-left">
              <div className="pointer-events-none absolute right-6 top-6 text-5xl font-extrabold text-white/5">
                1
              </div>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15">
                <LinkIcon className="h-5 w-5 text-pink-500" />
              </div>
              <h3 className="text-sm font-semibold">Link Account</h3>
              <p className="mt-3 text-[11px] leading-relaxed text-white/60">
                Connect your public TikTok username. We never ask for your
                password, keeping your account 100% secure.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative overflow-hidden rounded-[30px] bg-[#1a0d24] px-6 py-8 text-left">
              <div className="pointer-events-none absolute right-6 top-6 text-5xl font-extrabold text-white/5">
                2
              </div>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15">
                <UserGroupIcon className="h-5 w-5 text-pink-500" />
              </div>
              <h3 className="text-sm font-semibold">Follow Others</h3>
              <p className="mt-3 text-[11px] leading-relaxed text-white/60">
                Earn coins instantly by following other real creators in the
                community. The more you follow, the more you earn.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative overflow-hidden rounded-[30px] bg-[#1a0d24] px-6 py-8 text-left">
              <div className="pointer-events-none absolute right-6 top-6 text-5xl font-extrabold text-white/5">
                3
              </div>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15">
                <ArrowTrendingUpIcon className="h-5 w-5 text-pink-500" />
              </div>
              <h3 className="text-sm font-semibold">Get Followers</h3>
              <p className="mt-3 text-[11px] leading-relaxed text-white/60">
                Spend your hard-earned coins to get real followers delivered to
                your profile and boost your engagement.
              </p>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE SECTION */}
        <section className="mt-20">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-10 px-0 md:flex-row md:items-center">
            {/* Left chart card */}
            <div className="w-full rounded-4xl bg-[#1a0d24] px-6 py-8 sm:px-8 sm:py-10 md:w-[55%]">
              <div className="h-5 w-24 sm:w-28 rounded-full bg-white/5" />

              <div className="mt-10 flex items-end gap-3 sm:gap-5">
                <div className="h-16 flex-1 rounded-t-[20px] bg-[#3b0f2a]" />
                <div className="h-24 flex-1 rounded-t-[20px] bg-[#64143e]" />
                <div className="h-32 flex-1 rounded-t-[20px] bg-[#951852]" />
                <div className="h-40 flex-1 rounded-t-[20px] bg-[#ff2a80]" />
              </div>
            </div>

            {/* Right text block */}
            <div className="w-full md:w-[45%]">
              <h2 className="text-2xl font-semibold">
                Why Choose socialhub.support?
              </h2>

              <ul className="mt-6 space-y-4 text-[13px]">
                {/* Instant Delivery */}
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/15 text-pink-500">
                    ⚡
                  </span>
                  <div>
                    <div className="font-semibold text-white">
                      Instant Delivery
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/60">
                      See results immediately after spending your coins.
                    </p>
                  </div>
                </li>

                {/* Safe & Secure */}
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/15 text-pink-500">
                    🔒
                  </span>
                  <div>
                    <div className="font-semibold text-white">
                      Safe &amp; Secure
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/60">
                      We use 256‑bit encryption and never store sensitive data.
                    </p>
                  </div>
                </li>

                {/* 24/7 Support */}
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/15 text-pink-500">
                    📞
                  </span>
                  <div>
                    <div className="font-semibold text-white">
                      24/7 Support
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/60">
                      Our dedicated team is always here to help you grow.
                    </p>
                  </div>
                </li>
              </ul>

              <button className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[#371234] px-8 text-xs font-semibold text-white hover:bg-[#41163f]">
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
