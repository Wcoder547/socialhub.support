"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const DashboardNavbar = () => {
  const router = useRouter();
const { data: session, status } = useSession();
const photo = session?.user?.photo;
const name = session?.user?.name || "User";
const coins = session?.user?.coins ?? 0;
console.log("User coins:", coins);
console.log("User photo:", session?.user?.photo);
  return (
    <header className="border-b border-[#2a0f26] bg-[#170818]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo + name */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-white">
            <span className="text-sm">⚡</span>
          </div>
          <span
            onClick={() => router.push("/dashboard")}
            className="text-sm font-semibold tracking-tight"
          >
            socialhub.support
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Coins pill */}
          <div className="flex items-center rounded-full bg-[#2b0f2b] px-1 py-1">
            <div className="flex items-center gap-1 rounded-full bg-[#3b1136] px-3 py-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-yellow-300 text-[11px] text-yellow-300">
                $
              </span>
              <span className="text-xs font-semibold text-white">
                {coins}
              </span>
            </div>
            <button
              onClick={() => router.push("/earn-coins")}
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-pink-500 text-sm font-bold text-white hover:bg-pink-600"
            >
              +
            </button>
          </div>

         {/* User avatar */}
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
          {/* Logout icon */}
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-transparent text-pink-300 hover:text-pink-400"
            onClick={() =>
              signOut({
                callbackUrl: "/",
              })
            }
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
