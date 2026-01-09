"use client";

import DashboardNavbar from "@/src/components/DashboardNavbar";
import Footer from "@/src/components/Footer";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  UploadCloud,
  Users,
  ShieldCheck,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

type SocialPlatform = "youtube" | "facebook" | "instagram";

interface Campaign {
  _id: string;
  profileLink: string;
  handle?: string;
  targetActions: number;
  completedActions: number;
  rewardPerAction: number;
  status?: string;
}

const PLATFORMS: SocialPlatform[] = ["youtube", "facebook", "instagram"];


const keyFor = (_platform: SocialPlatform, id: string) => id;

export default function SocialEarnCoinsPage() {
  const { status, data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

 
  const urlPlatform = (searchParams.get("platform") || "").toLowerCase();

  const normalizePlatform = (p: string | null): SocialPlatform => {
    if (!p) return "youtube";
    if (p === "fb" || p === "facebook") return "facebook";
    if (p === "insta" || p === "instagram") return "instagram";
    return "youtube";
  };

  const [platform, setPlatform] = useState<SocialPlatform>(
    normalizePlatform(urlPlatform)
  );

  
  useEffect(() => {
    setPlatform(normalizePlatform(urlPlatform));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPlatform]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  const [highlighted, setHighlighted] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});


  const [platformCoins, setPlatformCoins] = useState<{
    youtube: number;
    facebook: number;
    instagram: number;
  }>({
    youtube: 0,
    facebook: 0,
    instagram: 0,
  });

  const handlePlatformChange = (p: SocialPlatform) => {
    setPlatform(p);
    const param =
      p === "facebook" ? "fb" : p === "instagram" ? "insta" : "youtube";
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("platform", param);
    router.replace(`/earn-coins/social?${sp.toString()}`);
  };

 
  useEffect(() => {
    const sc = (session?.user as any)?.socialCoins;
    if (sc) {
      setPlatformCoins({
        youtube: sc.youtube ?? 0,
        facebook: sc.facebook ?? 0,
        instagram: sc.instagram ?? 0,
      });
    }
  }, [session]);

 
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("socialCompletedCampaigns");
    if (!stored || stored.trim().length === 0) {
      localStorage.setItem("socialCompletedCampaigns", JSON.stringify({}));
      return;
    }
    try {
      const parsed = JSON.parse(stored) as Record<string, boolean>;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        setCompleted(parsed);
      } else {
        localStorage.setItem("socialCompletedCampaigns", JSON.stringify({}));
      }
    } catch {
      localStorage.setItem("socialCompletedCampaigns", JSON.stringify({}));
    }
  }, []);

 
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      "socialCompletedCampaigns",
      JSON.stringify(completed)
    );
  }, [completed]);

  const loadCampaigns = async (p: SocialPlatform) => {
    setLoading(true);
    setGlobalError(null);
    setGlobalSuccess(null);
    try {
      const res = await fetch(`/api/${p}/campaign/list`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load campaigns.");
      }
      const list: Campaign[] = data.campaigns || [];
      setCampaigns(list);

     
      setCompleted((prev) => {
        const next = { ...prev };
        list.forEach((c) => {
          const remaining =
            (c.targetActions || 0) - (c.completedActions || 0);
          const k = keyFor(p, c._id);
          if (remaining <= 0 || c.status === "completed") {
            next[k] = true;
          }
        });
        return next;
      });
    } catch (err: any) {
      setGlobalError(err.message || "Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns(platform);
   
  }, [platform]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#120814] text-white">
        <DashboardNavbar />
        <div className="p-8">Loading...</div>
      </main>
    );
  }

  const handleOpenProfile = (c: Campaign) => {
    const idKey = keyFor(platform, c._id);
    if (completed[idKey]) return;
    setHighlighted((prev) => ({ ...prev, [idKey]: true }));
    window.open(c.profileLink, "_blank", "noopener");
  };

  const handleSubmitProof = async (
    campaign: Campaign,
    file: File | null,
    clearLocalFile: () => void
  ) => {
    const idKey = keyFor(platform, campaign._id);
    if (!file || completed[idKey]) return;

    setGlobalError(null);
    setGlobalSuccess(null);
    setSubmitting((prev) => ({ ...prev, [idKey]: true }));

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("campaignId", campaign._id);

      const res = await fetch(`/api/${platform}/campaign/verify`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.error || "Verification failed.";
        setGlobalError(msg);
        return;
      }

      
      setCompleted((prev) => ({ ...prev, [idKey]: true }));
      clearLocalFile();
      setGlobalSuccess(
        data?.message || "Proof accepted, coins credited."
      );

     
      if (data?.newBalance != null) {
        setPlatformCoins((prev) => ({
          ...prev,
          [platform]: data.newBalance,
        }));
      }
    } catch (e) {
      console.error("submit proof error", e);
      setGlobalError("Something went wrong while verifying.");
    } finally {
      setSubmitting((prev) => ({ ...prev, [idKey]: false }));
    }
  };

  const currentPlatformCoins = platformCoins[platform];

  return (
    <>
      <main className="min-h-screen bg-[#120814] text-white">
        <DashboardNavbar />

        <section className="bg-linear-to-b from-[#14091e] via-[#120814] to-[#120814]">
          <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
            {/* header */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl md:text-3xl font-semibold">
                Social Earn Coins
              </h1>
              <p className="mt-2 text-sm text-white/70">
                Follow YouTube, Facebook and Instagram profiles, upload a
                screenshot, then submit for review to get coins.
              </p>
            </div>

           
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-[#1c0825] px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
                <p className="text-[11px] text-white/60">
                  Current {platform.toUpperCase()} Balance
                </p>
                <p className="mt-2 text-xl font-semibold text-pink-400">
                  {currentPlatformCoins} Coins
                </p>
              </div>
            </div>

           
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex flex-wrap gap-2 rounded-full bg-[#1b0d24] px-2 py-1">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePlatformChange(p)}
                    className={`px-3 py-1 rounded-full text-xs md:text-sm transition ${
                      platform === p
                        ? "bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-[0_0_18px_rgba(168,85,247,0.6)]"
                        : "text-white/70 hover:bg-[#281234]"
                    }`}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            
            {globalError && (
              <p className="mt-4 text-center text-xs text-red-400">
                {globalError}
              </p>
            )}
            {globalSuccess && (
              <p className="mt-4 text-center text-xs text-green-400">
                {globalSuccess}
              </p>
            )}

            {/* campaigns grid */}
            <div className="mt-8 grid gap-6 md:grid-cols-4 lg:grid-cols-4">
              {loading && (
                <div className="col-span-4 flex items-center justify-center py-10 text-sm text-white/60">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading campaigns...
                </div>
              )}

              {!loading &&
                campaigns.map((c) => {
                  const idKey = keyFor(platform, c._id);
                  const isHighlighted = !!highlighted[idKey];
                  const isCompleted = !!completed[idKey];
                  const isBusy = !!submitting[idKey];

                  const remaining =
                    (c.targetActions || 0) - (c.completedActions || 0);

                  const label = c.handle
                    ? `@${c.handle.replace(/^@/, "")}`
                    : `${platform.toUpperCase()} Campaign`;

                  return (
                    <Card
                      key={idKey}
                      platform={platform}
                      campaign={c}
                      remaining={remaining}
                      label={label}
                      isHighlighted={isHighlighted}
                      isCompleted={isCompleted}
                      isBusy={isBusy}
                      onOpen={() => handleOpenProfile(c)}
                      onSubmitProof={handleSubmitProof}
                    />
                  );
                })}

              {!loading && campaigns.length === 0 && (
                <div className="col-span-4 rounded-4xl bg-[#1b0d24] px-6 py-8 text-center text-sm text-white/60 shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
                  No active campaigns for {platform.toUpperCase()} right now.
                  Check back soon.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


interface CardProps {
  platform: SocialPlatform;
  campaign: Campaign;
  remaining: number;
  label: string;
  isHighlighted: boolean;
  isCompleted: boolean;
  isBusy: boolean;
  onOpen: () => void;
  onSubmitProof: (
    campaign: Campaign,
    file: File | null,
    clearLocalFile: () => void
  ) => Promise<void>;
}

function Card({
  platform,
  campaign,
  remaining,
  label,
  isHighlighted,
  isCompleted,
  isBusy,
  onOpen,
  onSubmitProof,
}: CardProps) {
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const openText =
    platform === "youtube"
      ? "Open channel"
      : platform === "facebook"
      ? "Open page"
      : "Open profile";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompleted || isBusy) return;
    const f = e.target.files?.[0] || null;
    setLocalFile(f);
    setLocalError(null);
  };

  const clearLocalFile = () => {
    setLocalFile(null);
  };

  const handleSubmit = async () => {
    if (!localFile) {
      setLocalError("Choose a screenshot first.");
      return;
    }
    await onSubmitProof(campaign, localFile, clearLocalFile);
  };

  return (
    <div
      className={`relative flex flex-col rounded-4xl px-5 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.7)] ${
        isCompleted ? "bg-[#140b1a] opacity-60" : "bg-[#1b0d24]"
      }`}
    >
      <div className="absolute right-4 top-4 rounded-full bg-pink-500 px-3 py-1 text-[10px] font-semibold">
        +{campaign.rewardPerAction} Coins / follow
      </div>

      {isCompleted && (
        <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-[10px] font-semibold">
          <ShieldCheck className="h-3 w-3" />
          <span>Completed</span>
        </div>
      )}

      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-pink-500/60 bg-black shadow-[0_0_0_6px_rgba(255,255,255,0.07)]">
        <Users className="h-9 w-9 text-pink-300" />
      </div>

      <div className="text-center">
        <div className="text-sm font-semibold">{label}</div>
        <div className="mt-1 text-[11px] text-white/60 truncate">
          {campaign.profileLink}
        </div>
        <div className="mt-1 text-[11px] text-white/50">
          Target: {campaign.targetActions} actions
        </div>
        <div className="mt-1 text-[11px] text-white/50">
          Remaining: {remaining > 0 ? remaining : 0}
        </div>
      </div>

      <div className="mt-6 space-y-3 text-[11px]">
        <button
          type="button"
          disabled={isCompleted}
          onClick={onOpen}
          className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
            isCompleted
              ? "bg-[#241027]/40 text-white/40 cursor-not-allowed"
              : "bg-[#241027] text-white/80 hover:bg-[#2d1231]"
          }`}
        >
          <ExternalLink className="h-3 w-3" />
          <span>
            {isCompleted ? "Already Verified" : `Open ${openText}`}
          </span>
        </button>

        {isCompleted ? (
          <>
            <button
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#062d16]/40 px-4 py-2 text-xs font-semibold text-[#45e86c]/60 cursor-not-allowed"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Coins Added</span>
            </button>
            <button
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-full bg-pink-500/30 px-4 py-2 text-xs font-semibold text:white/60 cursor-not-allowed"
            >
              <span>Verified</span>
            </button>
          </>
        ) : isHighlighted ? (
          <>
            <div className="rounded-3xl border border-white/10 bg-[#170b1f] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-pink-500/15 text-pink-400">
                  <UploadCloud className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold">
                    Upload follow screenshot
                  </p>
                  <p className="mt-1 text-[10px] text-white/50">
                    Take a clear screenshot after following this profile and
                    upload it once.
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-dashed border-white/15 bg-black/30 px-3 py-3 text-center">
                <input
                  id={`file-${campaign._id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isBusy}
                  onChange={handleFileChange}
                />
                <label
                  htmlFor={`file-${campaign._id}`}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold ${
                    isBusy
                      ? "bg-white/5 text-white/40 cursor-not-allowed"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <UploadCloud className="h-3 w-3" />
                  <span>
                    {localFile ? localFile.name : "Choose screenshot"}
                  </span>
                </label>

                <p className="text-[10px] text-white/40">
                  JPG, PNG up to 5MB.
                </p>
              </div>

              <button
                type="button"
                disabled={!localFile || isBusy}
                onClick={handleSubmit}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-[0_10px_30px_rgba(255,0,122,0.6)] ${
                  localFile && !isBusy
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-pink-500/40 text-white/60 cursor-not-allowed"
                }`}
              >
                {isBusy ? "Submitting..." : "Submit for Review"}
              </button>

              {localError && (
                <p className="mt-1 text-center text-[10px] text-red-400">
                  {localError}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#241027] px-4 py-2 text-xs font-semibold text-white/80"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Verify Follow</span>
            </button>
            <p className="text-center text-[10px] text-white/35">
              Open the profile, follow, then come back to upload a screenshot.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
