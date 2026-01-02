"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { FaArrowLeft, FaUsers } from "react-icons/fa";
import { FaCoins } from "react-icons/fa6";

export default function SignupPage() {
  const handleGoogleSignup = () => {
  
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#120814] text-white">
      {/* background gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-pink-900/40 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-pink-800/40 blur-3xl" />
      </div>

      {/* content wrapper */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-stretch px-4">
        {/* Back button */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
              <FaArrowLeft className="h-3 w-3" />
            </span>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-[40px] bg-[#190c20]/95 px-10 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
          {/* Logo */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500">
            <span className="text-2xl">📈</span>
          </div>

          <div className="mt-5 text-center text-sm font-semibold">
           socialhub.support
          </div>

          <h1 className="mt-5 text-center text-2xl font-semibold">
            Create Your Account
          </h1>

          <p className="mt-4 text-center text-[12px] leading-relaxed text-white/65">
            Join the community where you earn coins by
            following and spend them to get real
            followers.
          </p>

          {/* Google signup */}
          <button
            onClick={handleGoogleSignup}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-white py-3 text-sm font-medium text-[#202124] shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:bg-neutral-100"
          >
            <span className="flex h-6 w-6 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </span>
            <span>Sign up with Google</span>
          </button>

          {/* Community stats */}
          <div className="mt-7 border-t border-white/10" />
          <div className="mt-4 text-center text-[10px] font-semibold tracking-[0.2em] text-white/40">
            COMMUNITY STATS
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex w-32 flex-col items-center rounded-full bg-[#251029] px-4 py-3 text-[11px]">
              <div className="mb-1 flex items-center gap-1 text-pink-400">
                <FaUsers className="h-4 w-4" />
              </div>
              <div className="font-semibold text-white">10k+ Users</div>
            </div>
            <div className="flex w-32 flex-col items-center rounded-full bg-[#251029] px-4 py-3 text-[11px]">
              <div className="mb-1 flex items-center gap-1 text-pink-400">
                <FaCoins className="h-4 w-4" />
              </div>
              <div className="font-semibold text-white">5M+ Coins</div>
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] leading-relaxed text-white/40">
            By signing up, you agree to our{" "}
            <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </main>
  );
}
