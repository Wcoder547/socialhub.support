"use client";

import DashboardNavbar from "@/src/components/DashboardNavbar";
import Footer from "@/src/components/Footer";
import { CheckCircle2, Coins, Megaphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

type SocialPlatform = "youtube" | "facebook" | "instagram";

const PLATFORMS: SocialPlatform[] = ["youtube", "facebook", "instagram"];

const MIN_ACTIONS = 10;
const MAX_ACTIONS = 1000;
const REWARD_OPTIONS = [3, 5, 7, 10];

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

interface SocialBalanceResponse {
  globalCoins: number;
  socialCoins: {
    youtube: number;
    facebook: number;
    instagram: number;
  };
}

export default function SocialGetFollowersPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  const initialFromQuery = ((): SocialPlatform => {
    const q = searchParams.get("platform")?.toLowerCase();
    if (q === "facebook" || q === "instagram" || q === "youtube") {
      return q;
    }
    return "youtube";
  })();

  const [globalCoins, setGlobalCoins] = useState(0);

  const [socialCoins, setSocialCoins] = useState<{
    youtube: number;
    facebook: number;
    instagram: number;
  }>({ youtube: 0, facebook: 0, instagram: 0 });

  const [platform, setPlatform] = useState<SocialPlatform>(initialFromQuery);
  const [profileLink, setProfileLink] = useState("");
  const [targetActions, setTargetActions] = useState(50);
  const [rewardPerAction, setRewardPerAction] = useState(5);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [profileError, setProfileError] = useState<string | null>(null);
  const [actionsError, setActionsError] = useState<string | null>(null);
  const [rewardError, setRewardError] = useState<string | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [lastCampaignInfo, setLastCampaignInfo] = useState<{
    platform: string;
    profileLink: string;
    actions: number;
    reward: number;
    totalCost: number;
    newBalance: number;
  } | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.coins != null) {
      setGlobalCoins(session.user.coins);
    }
  }, [status, session]);

  const refreshBalances = async () => {
    try {
      const res = await fetch("/api/user/social-balance");
      if (!res.ok) return;
      const data: SocialBalanceResponse = await res.json();
      if (typeof data.globalCoins === "number") {
        setGlobalCoins(data.globalCoins);
      }
      if (data.socialCoins) {
        setSocialCoins({
          youtube: data.socialCoins.youtube ?? 0,
          facebook: data.socialCoins.facebook ?? 0,
          instagram: data.socialCoins.instagram ?? 0,
        });
      }
    } catch (err) {
      console.error("Failed to load social balances", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      refreshBalances();
    }
  }, [status]);

  const platformWallet =
    platform === "youtube"
      ? socialCoins.youtube
      : platform === "facebook"
      ? socialCoins.facebook
      : socialCoins.instagram;

  const headerLabel =
    platform === "youtube"
      ? "YouTube Coins"
      : platform === "facebook"
      ? "Facebook Coins"
      : "Instagram Coins";

  const safeActions = Math.min(
    MAX_ACTIONS,
    Math.max(MIN_ACTIONS, targetActions || MIN_ACTIONS)
  );
  const totalCost = safeActions * rewardPerAction;

  const remaining = platformWallet - totalCost;
  const hasEnough = remaining >= 0;
  const shortBy = Math.abs(remaining);

  const percent =
    ((safeActions - MIN_ACTIONS) / (MAX_ACTIONS - MIN_ACTIONS)) * 100;

  const platformLabel =
    platform === "youtube"
      ? "YouTube Channel URL"
      : platform === "facebook"
      ? "Facebook Page / Profile URL"
      : "Instagram Profile URL";

  const platformName = platform.toUpperCase();

  const validateAll = () => {
    let ok = true;

    const trimmed = profileLink.trim();
    if (!trimmed) {
      setProfileError("Profile URL is required.");
      ok = false;
    } else if (!isValidUrl(trimmed)) {
      setProfileError("Enter a valid URL starting with http or https.");
      ok = false;
    } else {
      setProfileError(null);
    }

    if (safeActions < MIN_ACTIONS || safeActions > MAX_ACTIONS) {
      setActionsError(
        `Actions must be between ${MIN_ACTIONS} and ${MAX_ACTIONS}.`
      );
      ok = false;
    } else {
      setActionsError(null);
    }

    if (!REWARD_OPTIONS.includes(rewardPerAction)) {
      setRewardError("Choose a valid reward option.");
      ok = false;
    } else {
      setRewardError(null);
    }

    if (platformWallet <= 0) {
      ok = false;
      setErrorMsg(
        `You have 0 ${platformName} coins. Earn some on the Social Earn Coins page before creating this campaign.`
      );
    }

    if (!hasEnough) {
      ok = false;
    }

    return ok;
  };

  const handleCreate = async () => {
    if (isSubmitting) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    const valid = validateAll();
    if (!valid) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/${platform}/campaign/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileLink: profileLink.trim(),
          targetActions: safeActions,
          rewardPerAction,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorMsg(data?.error || "Failed to create campaign.");
        return;
      }

      let newPlatformBalance = remaining;
      if (typeof data?.newYoutubeBalance === "number" && platform === "youtube") {
        newPlatformBalance = data.newYoutubeBalance;
        setSocialCoins((prev) => ({ ...prev, youtube: data.newYoutubeBalance }));
      }
      if (
        typeof data?.newFacebookBalance === "number" &&
        platform === "facebook"
      ) {
        newPlatformBalance = data.newFacebookBalance;
        setSocialCoins((prev) => ({
          ...prev,
          facebook: data.newFacebookBalance,
        }));
      }
      if (
        typeof data?.newInstagramBalance === "number" &&
        platform === "instagram"
      ) {
        newPlatformBalance = data.newInstagramBalance;
        setSocialCoins((prev) => ({
          ...prev,
          instagram: data.newInstagramBalance,
        }));
      }

      const info = {
        platform: platformName,
        profileLink: profileLink.trim(),
        actions: safeActions,
        reward: rewardPerAction,
        totalCost,
        newBalance: newPlatformBalance,
      };

      setLastCampaignInfo(info);
      setShowSuccess(true);
      setSuccessMsg(`${platformName} campaign created successfully.`);
      setProfileLink("");
    } catch (err) {
      console.error("SocialGetFollowers error:", err);
      setErrorMsg("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#120814] text-white">
        <DashboardNavbar />
        <div className="p-8">Loading...</div>
      </main>
    );
  }

  const disableButton =
    isSubmitting ||
    platformWallet <= 0 ||
    !!profileError ||
    !!actionsError ||
    !!rewardError ||
    !profileLink.trim() ||
    !hasEnough;

  return (
    <>
      <main className="min-h-screen bg-[#120814] text-white overflow-x-hidden">
        <DashboardNavbar />

        {showSuccess && lastCampaignInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#1b0d24] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">Campaign Created!</h2>
                  <p className="text-xs text-white/60">
                    Your {lastCampaignInfo.platform} campaign is live. Followers
                    can start using their coins to join it.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between gap-2">
                  <span className="text-white/60">
                    {lastCampaignInfo.platform} Link
                  </span>
                  <span className="max-w-[180px] truncate text-right">
                    {lastCampaignInfo.profileLink}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Target Actions</span>
                  <span>{lastCampaignInfo.actions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Reward / action</span>
                  <span>{lastCampaignInfo.reward} Coins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Total Cost</span>
                  <span className="font-semibold text-pink-400">
                    {lastCampaignInfo.totalCost} Coins
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">
                    New {lastCampaignInfo.platform} Balance
                  </span>
                  <span className="font-semibold text-green-400">
                    {lastCampaignInfo.newBalance} Coins
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-full bg-pink-500 py-2.5 text-sm font-semibold text-white hover:bg-pink-600"
                onClick={() => setShowSuccess(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <section className="bg-gradient-to-b from-[#1b0828] via-[#120814] to-[#120814]">
          <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
            <div className="mb-6 text-center">
              <h1 className="text-2xl md:text-3xl font-semibold">
                Social Get Followers
              </h1>
              <p className="mt-2 text-sm text-white/70">
                Launch a campaign for YouTube, Facebook or Instagram using your
                platform coins.
              </p>
            </div>

            {/* platform pills + PLATFORM balance */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="inline-flex flex-wrap gap-2 rounded-full bg-[#1b0d24] px-2 py-1">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPlatform(p);
                      setSuccessMsg(null);
                      setErrorMsg(null);
                    }}
                    className={`px-3 py-1 rounded-full text-xs md:text-sm transition ${
                      platform === p
                        ? "bg-gradient-to-r from-indigo-500 via-pink-500 to-rose-500 text-white shadow-[0_0_18px_rgba(168,85,247,0.6)]"
                        : "text-white/70 hover:bg-[#281234]"
                    }`}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 rounded-full bg-[#1b0d24] px-4 py-2 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/20">
                  <Coins className="h-4 w-4 text-pink-400" />
                </div>
                <div className="text-xs">
                  <div className="text-[10px] font-semibold text-white/60">
                    {headerLabel}
                  </div>
                  <div className="text-sm font-semibold">
                    {platformWallet.toLocaleString()} Coins
                  </div>
                </div>
              </div>
            </div>

            {/* main card */}
            <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)]">
              {/* left: inputs */}
              <div className="relative overflow-hidden rounded-[28px] bg-[#1b0d24] px-5 py-6 md:px-7 md:py-7 shadow-[0_26px_80px_rgba(0,0,0,0.7)]">
                <div className="pointer-events-none absolute -right-5 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/20 via-pink-500/10 to-transparent" />

                {/* profile link */}
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white/60">
                      {platformLabel}
                    </span>
                    <span className="text-[10px] text-white/40">Required</span>
                  </div>
                  <div className="mt-3 flex items-center rounded-2xl bg-[#200d28] px-4 py-3 text-xs text-white/60">
                    <input
                      type="text"
                      value={profileLink}
                      onChange={(e) => {
                        setProfileLink(e.target.value);
                        setProfileError(null);
                      }}
                      placeholder="https://your-social-link"
                      className="w-full bg-transparent text-sm text-white/80 outline-none placeholder:text-white/30"
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-white/40">
                    Paste the full profile or channel URL. Make sure it&apos;s
                    public.
                  </p>
                  {profileError && (
                    <p className="mt-1 text-[11px] text-red-400">
                      {profileError}
                    </p>
                  )}
                </div>

                {/* target actions */}
                <div className="mt-8">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white/60">
                      Number of Followers / Actions
                    </span>
                    <span className="text-base font-semibold text-pink-400">
                      {safeActions}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#200d28] px-5 py-4">
                    <div className="relative h-2 rounded-full bg-[#2e1536]">
                      <div
                        className="absolute left-0 top-0 h-2 rounded-full bg-gradient-to-r from-indigo-500 via-pink-500 to-rose-500"
                        style={{ width: `${percent}%` }}
                      />
                      <input
                        type="range"
                        min={MIN_ACTIONS}
                        max={MAX_ACTIONS}
                        value={safeActions}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setTargetActions(value);
                          setActionsError(null);
                        }}
                        className="absolute inset-0 h-2 w-full cursor-pointer opacity-0"
                      />
                      <div
                        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-pink-500 shadow-[0_0_0_6px_rgba(236,72,153,0.45)]"
                        style={{
                          left: `${percent}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    </div>
                    <div className="mt-3 flex justify-between text-[10px] text-white/40">
                      <span>{MIN_ACTIONS}</span>
                      <span>
                        {Math.round((MIN_ACTIONS + MAX_ACTIONS) / 2)}
                      </span>
                      <span>{MAX_ACTIONS}</span>
                    </div>
                  </div>
                  {actionsError && (
                    <p className="mt-1 text-[11px] text-red-400">
                      {actionsError}
                    </p>
                  )}
                </div>

                {/* reward per action */}
                <div className="mt-8">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white/60">
                      Reward Per Action
                    </span>
                    <span className="text-[11px] text-pink-400">
                      Higher = Faster
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-center text-[11px]">
                    {REWARD_OPTIONS.map((value) => {
                      const selected = value === rewardPerAction;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setRewardPerAction(value);
                            setRewardError(null);
                          }}
                          className={
                            "relative flex h-16 w-16 flex-col items-center justify-center rounded-2xl border bg-[#200d28] transition " +
                            (selected
                              ? "border-pink-500 shadow-[0_0_0_5px_rgba(236,72,153,0.4)]"
                              : "border-white/10 hover:border-pink-500/60")
                          }
                        >
                          <span className="text-sm font-semibold">
                            {value}
                          </span>
                          <span className="text-[10px] text-white/50">
                            Coins
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {rewardError && (
                    <p className="mt-1 text-[11px] text-red-400">
                      {rewardError}
                    </p>
                  )}
                </div>
              </div>

              {/* right: preview + summary */}
              <div className="space-y-5">
                <div className="w-full rounded-3xl bg-[#1b0d24] px-6 py-5 text-left shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
                  <div className="text-[11px] font-semibold text-white/60">
                    Campaign Preview
                  </div>
                  <div className="mt-4 flex items-center rounded-2xl bg-[#120814] px-3 py-2 border border-white/5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5d9a5] text-xs text-[#5b3b16]">
                      <Megaphone className="h-4 w-4" />
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="text-[10px] text-white/50">
                        {platformName} Link
                      </div>
                      <div className="truncate text-xs font-semibold">
                        {profileLink.trim() || "https://your-social-link"}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1 text-[10px] font-semibold">
                      <span>+{rewardPerAction}</span>
                      <span>🪙</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col rounded-3xl bg-[#1b0d24] px-6 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
                  <div className="text-sm font-semibold">Order Summary</div>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Platform</span>
                      <span>{platformName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Target Actions</span>
                      <span>{safeActions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Cost per Action</span>
                      <span>{rewardPerAction} Coins</span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Total Cost</span>
                      <span className="text-2xl font-semibold text-pink-400">
                        {totalCost}
                      </span>
                    </div>

                    <div className="mt-2 text-right text-[11px] text-white/60">
                      Current {platformName} coins:{" "}
                      <span className="font-semibold">
                        {platformWallet}
                      </span>
                    </div>

                    {hasEnough ? (
                      <div className="mt-1 text-right text-[11px] text-white/60">
                        Remaining {platformName} coins after this campaign:{" "}
                        <span className="font-semibold text-green-400">
                          {remaining}
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1 text-right text-[11px] text-red-400">
                        Insufficient {platformName} coins. You need{" "}
                        <span className="font-semibold">
                          {shortBy} more Coins
                        </span>
                        .
                      </div>
                    )}
                  </div>

                  {errorMsg && (
                    <p className="mt-2 text-right text-xs text-red-400">
                      {errorMsg}
                    </p>
                  )}
                  {successMsg && (
                    <p className="mt-2 text-right text-xs text-green-400">
                      {successMsg}
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={disableButton}
                    className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold shadow-[0_18px_45px_rgba(88,28,135,0.7)] ${
                      !disableButton
                        ? "bg-gradient-to-r from-indigo-500 via-pink-500 to-rose-500 text-white hover:brightness-110"
                        : "bg-indigo-500/40 text-white/60 cursor-not-allowed"
                    }`}
                    onClick={handleCreate}
                  >
                    <span>🚀</span>
                    <span>
                      {isSubmitting
                        ? "Creating..."
                        : !profileLink.trim()
                        ? "Add profile URL"
                        : platformWallet <= 0
                        ? `No ${platformName} Coins`
                        : !hasEnough
                        ? "Insufficient Coins"
                        : `Create ${platformName} Campaign`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
