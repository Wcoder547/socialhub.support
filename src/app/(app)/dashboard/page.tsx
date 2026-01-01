"use client";

import DashboardNavbar from "@/src/components/DashboardNavbar";
import {
    Rocket,
  TrendingUp,
  DollarSign,
  Megaphone,
  Users,
  Target,
} from "lucide-react";
import { useSession } from "next-auth/react";



export default function DashboardPage() {
  const { data: session } = useSession();
  const name = session?.user?.name || "User";
  return (
    <main className="min-h-screen bg-[#120814] text-white">
     
      
<DashboardNavbar />

      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        
        <section className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        
          <div className="text-center">
            <h1 className="text-3xl font-semibold md:text-4xl">
              Welcome back, {name}!
            </h1>
            <p className="mt-3 text-sm text-white/70">
              Ready to grow? Choose your path below to boost your presence.
            </p>
          </div>


          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {/* Earn Coins */}
            <div className="relative overflow-hidden rounded-[40px] bg-[#1b0d24] px-10 py-10 shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
              {/* top icon */}
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a4113c]">
                <Users className="h-5 w-5 text-pink-200" />
              </div>

              {/* faint background icon */}
              <div className="pointer-events-none absolute right-10 top-16 text-[120px] text-pink-700/10">
                <Users className="h-30 w-30" />
              </div>

              <h2 className="text-xl font-semibold">Earn Coins</h2>
              <p className="mt-3 max-w-md text-sm text-white/70">
                Follow other creators to earn coins for free. Build your balance
                and discover new content.
              </p>

              <div className="mt-8 h-px w-full bg-white/10" />

              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="text-white/60">Current Rate</span>
                <span className="rounded-full bg-[#0f3d1a] px-4 py-1 text-[11px] font-semibold text-[#45e86c]">
                  +5 COINS / FOLLOW
                </span>
              </div>

              <a href="/earn-coins" className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#2b102f] py-3 text-sm font-semibold text-white hover:bg-[#35143a]">
                <span>Start Earning</span>
                <TrendingUp className="h-4 w-4" />
              </a>
            </div>

            {/* Get Followers */}
            <div className="relative overflow-hidden rounded-[40px] bg-[#1b0d24] px-10 py-10 shadow-[0_25px_80px_rgba(0,0,0,0.7)]">
              {/* top icon */}
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500">
                <Rocket className="h-5 w-5 text-white" />
              </div>

              {/* faint background icon */}
              <div className="pointer-events-none absolute right-10 top-16 text-[120px] text-pink-700/10">
                <Rocket className="h-30 w-30" />
              </div>

              <h2 className="text-xl font-semibold">Get Followers</h2>
              <p className="mt-3 max-w-md text-sm text-white/70">
                Launch a campaign to boost your visibility. Use your coins to
                get real followers instantly.
              </p>

              <div className="mt-8 h-px w-full bg-white/10" />

              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="text-white/60">Est. Reach</span>
                <span className="flex items-center gap-1 text-pink-400">
                  <span className="h-2 w-2 rounded-full bg-pink-500" />
                  <span>High</span>
                </span>
              </div>

              <a href="/get-followers" className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-pink-500 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(255,0,122,0.7)] hover:bg-pink-600">
                <span>Launch Campaign</span>
                <Rocket className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
        {/* Stats row */}
        <section className="mx-auto mt-8 max-w-5xl px-4 md:px-6">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Today's earnings */}
            <div className="flex flex-col items-center justify-center rounded-[40px] bg-[#1b0d24] px-6 py-4 text-center">
              <div className="text-[11px] font-semibold tracking-wide text-white/60">
                TODAY&apos;S EARNINGS
              </div>
              <div className="mt-2 flex items-center gap-1 text-lg font-semibold">
                <DollarSign className="h-4 w-4 text-yellow-300" />
                <span>50</span>
              </div>
            </div>

            {/* Active campaigns */}
            <div className="flex flex-col items-center justify-center rounded-[40px] bg-[#1b0d24] px-6 py-4 text-center">
              <div className="text-[11px] font-semibold tracking-wide text-white/60">
                ACTIVE CAMPAIGNS
              </div>
              <div className="mt-2 flex items-center gap-1 text-lg font-semibold">
                <Megaphone className="h-4 w-4 text-pink-400" />
                <span>2</span>
              </div>
            </div>

            {/* New followers */}
            <div className="flex flex-col items-center justify-center rounded-[40px] bg-[#1b0d24] px-6 py-4 text-center">
              <div className="text-[11px] font-semibold tracking-wide text-white/60">
                NEW FOLLOWERS
              </div>
              <div className="mt-2 flex items-center gap-1 text-lg font-semibold">
                <Users className="h-4 w-4 text-[#45e86c]" />
                <span className="text-[#45e86c]">+12</span>
              </div>
            </div>

            {/* Total reach */}
            <div className="flex flex-col items-center justify-center rounded-[40px] bg-[#1b0d24] px-6 py-4 text-center">
              <div className="text-[11px] font-semibold tracking-wide text-white/60">
                TOTAL REACH
              </div>
              <div className="mt-2 flex items-center gap-1 text-lg font-semibold">
                <Target className="h-4 w-4 text-[#8f9bff]" />
                <span className="text-[#8f9bff]">1.4k</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
