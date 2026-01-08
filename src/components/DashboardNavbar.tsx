"use client";

import { LogOut, Menu, Sparkles, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

const DashboardNavbar = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // cast to any so we can safely read custom fields (photo, coins)
  const user = session?.user as any | undefined;

  const photo: string | undefined = user?.photo ?? user?.image ?? undefined;
  const name: string = user?.name || "User";
  const coins: number = user?.coins ?? 0;

  const [open, setOpen] = useState(false);

  const handleNav = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <header className="border-b border-[#2a0f26] bg-[#170818]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-3 py-2.5 md:px-4">
        {/* Logo + name */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleNav("/dashboard")}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 text-white">
            <span className="text-sm">⚡</span>
          </div>
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">
            socialhub.support
          </span>
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Social platforms */}
          <button
            type="button"
            onClick={() => handleNav("/earn-coins/social")}
            className="flex items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-[0_0_12px_rgba(59,130,246,0.6)] hover:brightness-110 active:scale-[0.97] transition"
          >
            <Users className="h-4 w-4" />
            <span className="ml-1 leading-none">Social platforms</span>
          </button>

          {/* Coins pill */}
          <div className="flex items-center rounded-full bg-[#2b0f2b] px-1.5 py-1">
            <div className="flex items-center gap-1 rounded-full bg-[#3b1136] px-2.5 py-0.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-yellow-300 text-[11px] text-yellow-300">
                $
              </span>
              <span className="text-xs font-semibold text-white min-w-[44px] text-center">
                {coins}
              </span>
            </div>
            <button
              onClick={() => handleNav("/earn-coins")}
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-pink-500 text-sm font-bold text-white hover:bg-pink-600 active:scale-[0.96]"
            >
              +
            </button>
          </div>

          {/* Updates / Learn */}
          <button
            type="button"
            onClick={() => handleNav("/learn")}
            className="flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-[0_8px_22px_rgba(255,0,122,0.55)] hover:brightness-110 active:scale-[0.97] transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="leading-none">Updates</span>
          </button>

          {/* Avatar */}
          <div className="flex">
            {photo ? (
              <Image
                src={photo}
                alt={name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover border border-pink-400"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5d9a5] text-xs text-[#5b3b16]">
                👤
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-pink-300 hover:text-pink-400 active:scale-[0.96]"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1.5 sm:hidden">
          <button
            type="button"
            onClick={() => handleNav("/earn-coins/social")}
            className="flex items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 px-3 py-1.5 text-[10px] font-semibold text-white shadow-[0_0_10px_rgba(59,130,246,0.6)] hover:brightness-110 active:scale-[0.97] transition"
          >
            <Users className="h-3.5 w-3.5" />
            <span className="ml-1 leading-none">Social platforms</span>
          </button>

          {/* Coins pill */}
          <div className="flex items-center rounded-full bg-[#2b0f2b] px-1.5 py-1">
            <div className="flex items-center gap-1 rounded-full bg-[#3b1136] px-2 py-0.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-yellow-300 text-[10px] text-yellow-300">
                $
              </span>
              <span className="text-[11px] font-semibold text-white min-w-[38px] text-center">
                {coins}
              </span>
            </div>
            <button
              onClick={() => handleNav("/earn-coins")}
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white hover:bg-pink-600 active:scale-[0.96]"
            >
              +
            </button>
          </div>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2b0f2b] text-pink-100 hover:bg-[#351136] active:scale-[0.96] transition"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden">
          <div className="mx-auto max-w-5xl px-3 pb-3">
            <div className="mt-1 w-full rounded-2xl border border-[#2a0f26] bg-[#1b0b20]/95 px-3 py-2 shadow-[0_18px_40px_rgba(0,0,0,0.85)] backdrop-blur-md">
              <button
                onClick={() => handleNav("/learn")}
                className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-white hover:bg-white/5 active:scale-[0.99] transition"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-pink-300" />
                  <span>Updates · Learn</span>
                </span>
                <span className="text-[10px] text-white/60">What&apos;s new</span>
              </button>

              <div className="my-1 h-px bg-white/10" />

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex w-full items-center justify-start gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-medium text-pink-200 hover:bg:white/5 active:scale-[0.99] transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardNavbar;
