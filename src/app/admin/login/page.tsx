"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#120814] text-white">
      <div className="w-full max-w-sm rounded-3xl bg-[#1b0d24] px-6 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
        <h1 className="text-xl font-semibold text-center">Admin Login</h1>
        <p className="mt-2 text-center text-xs text-white/60">
          Enter the admin email and password provided to you.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-white/70">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg bg-[#120814] px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg bg-[#120814] px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-pink-500"
            />
          </div>

          {error && <p className="text-xs text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(255,0,122,0.5)] hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-pink-500/60"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </main>
  );
}
