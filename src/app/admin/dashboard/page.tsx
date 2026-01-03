"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

type TaskStatus = "pending" | "active" | "paused" | "completed";

interface Task {
  _id: string;
  tiktokLink: string;
  followers: number;
  rewardPerFollower: number;
  totalCost: number;
  status: TaskStatus;
  createdByRole: "admin" | "user";
  priority: number;
  createdAt: string;
}

interface ProofTask extends Task {
  proofScreenshotUrl?: string;
  proofStatus?: "pending" | "approved" | "rejected";
  completedFollowers?: number;
  userId: string;
  user?: {
    _id: string;
    name?: string;
    email?: string;
    coins?: number;
    photo?: string;
  } | null;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // normal tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);

  // proofs
  const [proofTasks, setProofTasks] = useState<ProofTask[]>([]);
  const [loadingProofs, setLoadingProofs] = useState(true);
  const [proofError, setProofError] = useState<string | null>(null);
  const [processingProof, setProcessingProof] = useState<
    Record<string, boolean>
  >({});

  // create form
  const [tiktokLink, setTiktokLink] = useState("");
  const [followers, setFollowers] = useState("");
  const [rewardPerFollower, setRewardPerFollower] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [creating, setCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      setTasksError(null);

      const res = await fetch("/api/admin/tasks");
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        setTasksError("Failed to load tasks");
        setTasks([]);
        return;
      }

      if (!res.ok) {
        setTasksError(data?.error || "Failed to load tasks");
        setTasks([]);
        return;
      }

      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setTasksError("Error loading tasks");
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchProofTasks = async () => {
    try {
      setLoadingProofs(true);
      setProofError(null);

      const res = await fetch("/api/admin/tasks/pending-proofs");
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        setProofError("Failed to load pending proofs");
        setProofTasks([]);
        return;
      }

      if (!res.ok) {
        setProofError(data?.error || "Failed to load pending proofs");
        setProofTasks([]);
        return;
      }

      setProofTasks(data.tasks || []);
    } catch (err) {
      console.error("Fetch pending proofs error:", err);
      setProofError("Error loading pending proofs");
      setProofTasks([]);
    } finally {
      setLoadingProofs(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProofTasks();
  }, []);

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        alert("Failed to update task");
        return;
      }

      if (!res.ok) {
        alert(data?.error || "Failed to update task");
        return;
      }
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Error updating task");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateMessage(null);

    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tiktokLink,
          followers: Number(followers),
          rewardPerFollower: Number(rewardPerFollower),
          totalCost: Number(totalCost),
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        setCreateMessage("Failed to create task");
        return;
      }

      if (!res.ok) {
        setCreateMessage(data?.error || "Failed to create task");
        return;
      }

      setCreateMessage("High‑priority admin task created.");
      setTiktokLink("");
      setFollowers("");
      setRewardPerFollower("");
      setTotalCost("");
      fetchTasks();
    } catch (err) {
      console.error(err);
      setCreateMessage("Error creating task");
    } finally {
      setCreating(false);
    }
  };

  const handleProofAction = async (
    taskId: string,
    action: "approve-proof" | "reject-proof"
  ) => {
    setProcessingProof((prev) => ({ ...prev, [taskId]: true }));
    try {
      const res = await fetch(`/api/admin/tasks/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        alert(`Failed to ${action}`);
        return;
      }

      if (!res.ok) {
        alert(data?.error || `Failed to ${action}`);
        return;
      }

      setProofTasks((prev) => prev.filter((t) => t._id !== taskId));
      fetchTasks();
    } catch (err) {
      console.error(`${action} error`, err);
      alert(`Failed to ${action}`);
    } finally {
      setProcessingProof((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const activeTasks = tasks.filter((t) => t.status === "active");

  return (
    <main className="min-h-screen bg-[#08030c] text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#120814]">
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-2">
          <div className="h-8 w-8 rounded-2xl bg-pink-500 flex items-center justify-center text-xs font-bold shadow-[0_10px_30px_rgba(255,0,122,0.7)]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Follower Admin</h1>
            <p className="mt-1 text-[11px] text-white/60">
              Review proofs, control campaigns.
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 text-sm space-y-2">
          <button className="w-full rounded-xl bg-[#241027] px-3 py-2 text-left font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            Dashboard
          </button>

          {/* NEW BUTTON */}
          <button
            onClick={() => router.push("/admin/proofs")}
            className="w-full rounded-xl bg-transparent px-3 py-2 text-left text-white/70 hover:bg-[#241027]">
            Review Proofs
          </button>

          
        </nav>

        <div className="px-4 pb-4 text-[11px] text-white/40 space-y-1">
          <p>No coin limit for admin.</p>
          <p>Use dashboard freely.</p>
        </div>
      </aside>

      {/* Main content */}
      <section className="flex-1">
        {/* Top bar */}
        <header className="border-b border-white/10 bg-[#14071b]/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
            <div>
              <h2 className="text-lg font-semibold">Admin Dashboard</h2>
              <p className="text-xs text-white/60">
                Approve user proofs and manage high‑priority campaigns.
              </p>
            </div>
            <button
              onClick={() => router.push("/earn-coins")}
              className="rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(255,0,122,0.6)] hover:bg-pink-600">
              Open Earn Coins
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 space-y-8">
          {/* Stats row */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-linear-to-br from-pink-500 to-purple-600 px-5 py-4 shadow-[0_18px_50px_rgba(255,0,122,0.5)]">
              <p className="text-xs text-white/80">Pending proofs</p>
              <p className="mt-2 text-2xl font-semibold">{proofTasks.length}</p>
              <p className="mt-1 text-[11px] text-white/70">
                Screenshots waiting for your review.
              </p>
            </div>

            <div className="rounded-2xl bg-[#1b0d24] px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.6)]">
              <p className="text-xs text-white/70">Pending tasks</p>
              <p className="mt-2 text-2xl font-semibold">
                {pendingTasks.length}
              </p>
              <p className="mt-1 text-[11px] text-white/60">
                New campaigns waiting approval.
              </p>
            </div>

            <div className="rounded-2xl bg-[#1b0d24] px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.6)]">
              <p className="text-xs text-white/70">Active campaigns</p>
              <p className="mt-2 text-2xl font-semibold">
                {activeTasks.length}
              </p>
              <p className="mt-1 text-[11px] text-white/60">
                Live on Earn Coins page.
              </p>
            </div>
          </section>

        
          {/* Pending tasks list */}
          <section className="rounded-3xl bg-[#1b0d24] px-5 py-5 shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold">Pending tasks</h3>
                <p className="text-[11px] text-white/60">
                  Review campaigns and activate to show them to users.
                </p>
              </div>
            </div>

            {loadingTasks ? (
              <p className="mt-4 text-xs text-white/60">Loading tasks...</p>
            ) : tasksError ? (
              <p className="mt-4 text-xs text-red-400">{tasksError}</p>
            ) : pendingTasks.length === 0 ? (
              <p className="mt-4 text-xs text-white/60">
                No pending tasks right now.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#120814] px-4 py-3 text-xs md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#241027] px-2 py-[2px] text-[10px] uppercase tracking-wide text-white/70">
                          {task.createdByRole === "admin"
                            ? "Admin Task"
                            : "User Task"}
                        </span>
                        <span className="text-[10px] text-white/40">
                          {task.priority > 0 ? "High priority" : "Normal"}
                        </span>
                      </div>
                      <p className="text-white/85">
                        Followers target:{" "}
                        <span className="font-semibold">{task.followers}</span>
                      </p>
                      <p className="text-white/70">
                        Reward:{" "}
                        <span className="font-semibold">
                          {task.rewardPerFollower} coins / follower
                        </span>{" "}
                        • Total budget:{" "}
                        <span className="font-semibold">
                          {task.totalCost} coins
                        </span>
                      </p>
                      <a
                        href={task.tiktokLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-pink-400 hover:underline">
                        Open TikTok link
                      </a>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <button
                        onClick={() => handleStatusChange(task._id, "active")}
                        className="rounded-full bg-[#062d16] px-4 py-2 text-[11px] font-semibold text-[#45e86c] hover:bg-[#07401f]">
                        Approve (Active)
                      </button>
                      <button
                        onClick={() => handleStatusChange(task._id, "paused")}
                        className="rounded-full bg-[#241027] px-4 py-2 text-[11px] font-semibold text-white/70 hover:bg-[#311336]">
                        Pause
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Create admin high-priority task */}
          <section className="rounded-3xl bg-[#1f1027] px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-white/10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[12px] font-bold text-pink-600 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
                    ★
                  </span>
                  <span className="text-white">Admin High‑Priority Task</span>
                </h3>
                <p className="mt-1 text-[11px] text-white/70">
                  Create featured tasks that always appear first on Earn Coins.
                </p>
              </div>

              <div className="rounded-full bg-white/8 px-4 py-2 text-[11px] text-white/80 border border-white/15">
                High priority ={" "}
                <span className="font-semibold text-pink-300">
                  Top of Earn Coins
                </span>
              </div>
            </div>

            <form
              onSubmit={handleCreate}
              className="mt-6 grid gap-5 text-xs md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-white">
                  TikTok Profile Link
                </label>
                <p className="mt-1 text-[11px] text-white/60">
                  Example:{" "}
                  <span className="font-mono text-pink-200">
                    https://www.tiktok.com/@yourprofile
                  </span>
                </p>
                <input
                  type="url"
                  required
                  value={tiktokLink}
                  onChange={(e) => setTiktokLink(e.target.value)}
                  placeholder="https://www.tiktok.com/@username"
                  className="mt-2 w-full rounded-2xl bg-[#120814] px-4 py-3 text-xs text-white outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-pink-400/70"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-white">
                  Target Followers
                </label>
                <p className="mt-1 text-[11px] text-white/60">
                  How many new followers you want.
                </p>
                <input
                  type="number"
                  required
                  min={1}
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                  placeholder="e.g. 100"
                  className="mt-2 w-full rounded-2xl bg-[#120814] px-4 py-3 text-xs text-white outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-pink-400/70"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-white">
                  Reward per Follower (coins)
                </label>
                <p className="mt-1 text-[11px] text-white/60">
                  Higher reward attracts more users.
                </p>
                <input
                  type="number"
                  required
                  min={1}
                  value={rewardPerFollower}
                  onChange={(e) => setRewardPerFollower(e.target.value)}
                  placeholder="e.g. 5"
                  className="mt-2 w-full rounded-2xl bg-[#120814] px-4 py-3 text-xs text-white outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-pink-400/70"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-white">
                  Total Cost (coins)
                </label>
                <p className="mt-1 text-[11px] text-white/60">
                  Admin has no coin limit. Set any budget.
                </p>
                <input
                  type="number"
                  required
                  min={1}
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  placeholder="e.g. 500"
                  className="mt-2 w-full rounded-2xl bg-[#120814] px-4 py-3 text-xs text-white outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-pink-400/70"
                />
              </div>

              <div className="md:col-span-2 flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-between">
                <p className="text-[11px] text-white/65">
                  After you create this task, users will see it as a{" "}
                  <span className="font-semibold text-pink-300">
                    featured high‑reward
                  </span>{" "}
                  card on Earn Coins page.
                </p>

                <button
                  type="submit"
                  disabled={creating}
                  className="mt-2 w-full md:w-auto rounded-full bg-white px-7 py-2.5 text-xs font-semibold text-pink-600 shadow-[0_12px_35px_rgba(0,0,0,0.9)] hover:bg-pink-50 disabled:cursor-not-allowed disabled:bg-white/70">
                  {creating ? "Creating task..." : "Create High‑Priority Task"}
                </button>
              </div>
            </form>

            {createMessage && (
              <p className="mt-4 text-xs font-medium text-white/80">
                {createMessage}
              </p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
