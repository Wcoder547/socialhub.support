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

interface ProofTask {
  _id: string;
  tiktokLink: string;
  followers: number;
  rewardPerFollower: number;
  totalCost: number;
  status: TaskStatus;
  createdByRole: "admin" | "user";
  priority: number;
  createdAt: string;
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

const PAGE_SIZE = 8;

export default function AdminProofsPage() {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [proofTasks, setProofTasks] = useState<ProofTask[]>([]);
  const [loadingProofs, setLoadingProofs] = useState(true);
  const [proofError, setProofError] = useState<string | null>(null);
  const [processingProof, setProcessingProof] = useState<
    Record<string, boolean>
  >({});

  const [page, setPage] = useState(1);

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
      setPage(1);
    } catch (err) {
      console.error("Fetch pending proofs error:", err);
      setProofError("Error loading pending proofs");
      setProofTasks([]);
    } finally {
      setLoadingProofs(false);
    }
  };

  useEffect(() => {
    fetchProofTasks();
  }, []);

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
    } catch (err) {
      console.error(`${action} error`, err);
      alert(`Failed to ${action}`);
    } finally {
      setProcessingProof((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const totalPages = Math.max(1, Math.ceil(proofTasks.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProofs = proofTasks.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <main className="min-h-screen bg-[#08030c] text-white flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-white/10 bg-[#120814]
          transform transition-transform duration-200
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0
        `}
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
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

          <button
            className="md:hidden text-white/60 text-xs px-2 py-1 rounded-full hover:bg-white/10"
            onClick={() => setIsSidebarOpen(false)}
          >
            Close
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 text-sm space-y-2">
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              router.push("/admin/dashboard");
            }}
            className="w-full rounded-xl bg-transparent px-3 py-2 text-left text-white/70 hover:bg-[#241027]"
          >
            Dashboard
          </button>
          <button className="w-full rounded-xl bg-[#241027] px-3 py-2 text-left font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            Review Proofs
          </button>

        </nav>

        <div className="px-4 pb-4 text-[11px] text-white/40 space-y-1">
          <p>No coin limit for admin.</p>
          <p>Use dashboard freely.</p>
        </div>
      </aside>

      {/* Overlay on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <section className="flex-1">
        {/* Top bar */}
        <header className="border-b border-white/10 bg-[#14071b]/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
            <div className="flex items-center gap-3">
              {/* mobile sidebar button */}
              <button
                className="md:hidden rounded-full bg-[#241027] p-2 text-white/80 hover:bg-[#311336]"
                onClick={() => setIsSidebarOpen(true)}
              >
                <span className="block h-0.5 w-4 bg-white mb-1" />
                <span className="block h-0.5 w-4 bg-white mb-1" />
                <span className="block h-0.5 w-4 bg-white" />
              </button>

              <div>
                <h2 className="text-lg font-semibold">Review Proofs</h2>
                <p className="text-xs text-white/60">
                  See all pending screenshots and approve or reject them.
                </p>
              </div>
            </div>

            <button
              onClick={fetchProofTasks}
              className="rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(255,0,122,0.6)] hover:bg-pink-600 flex items-center gap-2"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 space-y-6">
          <section className="rounded-3xl bg-[#1b0d24] px-5 py-5 shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
            {loadingProofs ? (
              <p className="mt-2 text-xs text-white/60">
                Loading pending proofs...
              </p>
            ) : proofError ? (
              <p className="mt-2 text-xs text-red-400">{proofError}</p>
            ) : proofTasks.length === 0 ? (
              <p className="mt-2 text-xs text-white/60">
                No pending proofs right now.
              </p>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 mt-2">
                  {paginatedProofs.map((task) => {
                    const isProcessing = !!processingProof[task._id];
                    const user = task.user;

                    return (
                      <div
                        key={task._id}
                        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#120814] p-4 text-xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[11px] text-white/60">
                              {user?.name || "Unknown user"}
                            </p>
                            <p className="text-[11px] text-white/40">
                              {user?.email}
                            </p>
                            <p className="mt-1 text-[11px] text-white/50">
                              Reward per proof:{" "}
                              <span className="font-semibold text-pink-400">
                                +{task.rewardPerFollower} coins
                              </span>
                            </p>
                            <p className="text-[11px] text-white/40">
                              Progress: {task.completedFollowers || 0} /{" "}
                              {task.followers} followers
                            </p>
                            {user && (
                              <p className="mt-1 text-[11px] text-white/40">
                                Current balance:{" "}
                                <span className="font-semibold text-green-400">
                                  {user.coins ?? 0} coins
                                </span>
                              </p>
                            )}
                          </div>
                          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-semibold text-amber-300">
                            Awaiting review
                          </span>
                        </div>

                        {task.proofScreenshotUrl && (
                          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                            <Image
                              src={task.proofScreenshotUrl}
                              alt="User proof screenshot"
                              width={900}
                              height={700}
                              className="h-48 w-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          <a
                            href={task.tiktokLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/80 hover:bg-white/10"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View TikTok profile
                          </a>
                          <p className="text-white/40">
                            Task ID:{" "}
                            <span className="font-mono text-[10px] text-white/60">
                              {task._id.slice(-8)}
                            </span>
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            disabled={isProcessing}
                            onClick={() =>
                              handleProofAction(task._id, "approve-proof")
                            }
                            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                              isProcessing
                                ? "bg-green-500/30 text-green-100/70 cursor-not-allowed"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            {isProcessing
                              ? "Processing..."
                              : "Approve & credit"}
                          </button>
                          <button
                            disabled={isProcessing}
                            onClick={() =>
                              handleProofAction(task._id, "reject-proof")
                            }
                            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                              isProcessing
                                ? "bg-red-500/30 text-red-100/70 cursor-not-allowed"
                                : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                          >
                            <XCircle className="h-3 w-3" />
                            {isProcessing ? "Processing..." : "Reject proof"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white/70">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() =>
                        setPage((p) => Math.max(1, p - 1))
                      }
                      className={`rounded-full px-4 py-2 ${
                        currentPage <= 1
                          ? "bg-[#1b0d24] text-white/30 cursor-not-allowed"
                          : "bg-[#241027] hover:bg-[#2d1231]"
                      }`}
                    >
                      Previous
                    </button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={`rounded-full px-4 py-2 ${
                        currentPage >= totalPages
                          ? "bg-[#1b0d24] text-white/30 cursor-not-allowed"
                          : "bg-[#241027] hover:bg-[#2d1231]"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
