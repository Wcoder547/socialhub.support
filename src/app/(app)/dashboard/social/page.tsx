"use client";

import DashboardNavbar from "@/src/components/DashboardNavbar";
import Footer from "@/src/components/Footer";
import { Megaphone, Users, TrendingUp, Rocket } from "lucide-react";

export default function SocialHubPage() {
  return (
    <>
      <main className="min-h-screen bg-[#120814] text-white">
        <DashboardNavbar />

        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
          <section className="mx-auto max-w-5xl">
            <div className="text-center">
              <h1 className="text-3xl font-semibold md:text-4xl">
                Social Hub
              </h1>
              <p className="mt-3 text-sm text-white/70">
                Choose how you want to use YouTube, Facebook and Instagram:
                earn coins or launch campaigns.
              </p>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {/* Social Earn Coins */}
              <div className="relative overflow-hidden rounded-[40px] bg-[#1b0d24] px-10 py-10 shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
                {/* top icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f3d1a]">
                  <Users className="h-5 w-5 text-[#45e86c]" />
                </div>
                {/* faint background icon */}
                <div className="pointer-events-none absolute right-10 top-16 text-[120px] text-green-500/10">
                  <Users className="h-30 w-30" />
                </div>

                <h2 className="text-xl font-semibold">Social Earn Coins</h2>
                <p className="mt-3 max-w-md text-sm text-white/70">
                  Follow YouTube, Facebook and Instagram profiles, upload a screenshot
                  and earn coins instantly.
                </p>

                <div className="mt-8 h-px w-full bg-white/10" />

                <div className="mt-5 flex items-center justify-between text-xs">
                  <span className="text-white/60">Platforms</span>
                  <span className="rounded-full bg-[#082c1a] px-4 py-1 text-[11px] font-semibold text-[#45e86c]">
                    YOUTUBE · FACEBOOK · INSTAGRAM
                  </span>
                </div>

                <a
                  href="/earn-coins/social"
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#123123] py-3 text-sm font-semibold text-white hover:bg-[#17452b]"
                >
                  <span>Earn from Social</span>
                  <TrendingUp className="h-4 w-4" />
                </a>
              </div>

              {/* Social Get Followers */}
              <div className="relative overflow-hidden rounded-[40px] bg-[#1b0d24] px-10 py-10 shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
                {/* top icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500">
                  <Megaphone className="h-5 w-5 text-white" />
                </div>
                {/* faint background icon */}
                <div className="pointer-events-none absolute right-10 top-16 text-[120px] text-indigo-500/10">
                  <Megaphone className="h-30 w-30" />
                </div>

                <h2 className="text-xl font-semibold">Social Get Followers</h2>
                <p className="mt-3 max-w-md text-sm text-white/70">
                  Create campaigns for YouTube, Facebook and Instagram to grow
                  your social audience with coins.
                </p>

                <div className="mt-8 h-px w-full bg-white/10" />

                <div className="mt-5 flex items-center justify-between text-xs">
                  <span className="text-white/60">Est. Reach</span>
                  <span className="flex items-center gap-1 text-indigo-300">
                    <span className="h-2 w-2 rounded-full bg-indigo-400" />
                    <span>Multi‑platform</span>
                  </span>
                </div>

                <a
                  href="/get-followers/social"
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-indigo-500 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(88,28,135,0.7)] hover:bg-indigo-600"
                >
                  <span>Launch Social Campaign</span>
                  <Rocket className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
