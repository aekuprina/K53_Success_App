"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppState, setEntitlement } from "@/lib/store";
import { PRICES, FREE_DAILY_QUESTIONS, detectPlatform, voucherEntitlement, isEntitled } from "@/lib/premium";

const REASONS: Record<string, string> = {
  daily: `You've used your ${FREE_DAILY_QUESTIONS} free questions for today. They reset at midnight — or unlock everything now.`,
  mock: "Your free mock exam is used. Unlock unlimited mocks to train the real format until it feels easy.",
};

function UpgradeInner() {
  const state = useAppState();
  const params = useSearchParams();
  const reason = params.get("reason");
  const [platform, setPlatform] = useState<"android" | "ios">("android");
  const [notice, setNotice] = useState(false);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [code, setCode] = useState("");
  const [voucherError, setVoucherError] = useState(false);

  useEffect(() => setPlatform(detectPlatform()), []);

  if (isEntitled(state)) {
    return (
      <div className="flex min-h-[80vh] animate-screenIn flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="h-display mt-4 text-[28px]">{state.entitlement === "pass" ? "Pass Pack active" : "Unlocked"}</h1>
        <p className="mt-2 max-w-[290px] text-sm font-medium text-muted">
          Everything is open: full question bank, unlimited mock exams, no daily limits.
          {state.entitlement === "pass" && " Pass Promise applies when your Readiness reaches 90."}
        </p>
        <Link href="/" className="btn-primary mt-8 w-full max-w-xs text-[17px]">Keep practising</Link>
      </div>
    );
  }

  function redeem() {
    const ent = voucherEntitlement(code);
    if (ent) {
      setEntitlement(ent, code.trim().toUpperCase());
      setVoucherError(false);
    } else {
      setVoucherError(true);
    }
  }

  const p = PRICES;

  return (
    <div className="animate-screenIn">
      <div className="rounded-b-hero bg-hero px-6 pb-7 pt-4 text-heroink">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-[15px] font-bold text-accent">← Home</Link>
          <span className="rounded-full bg-white/[0.13] px-3 py-1.5 text-[11px] font-bold tracking-[0.08em]">PAY ONCE · NO SUBSCRIPTION</span>
        </div>
        <h1 className="h-display mt-5 text-[34px] leading-[0.98]">
          Pass your K53<br /><span className="text-accent">first time</span>
        </h1>
        <p className="mt-3 max-w-[300px] text-sm font-medium leading-relaxed text-heromut">
          {reason && REASONS[reason] ? REASONS[reason] : "One payment. Everything open until you pass. Nothing renews, nothing expires."}
        </p>
      </div>

      <div className="space-y-3.5 px-6 pt-6">
        {/* Pass Pack — the hero SKU */}
        <div className="relative rounded-[24px] bg-hero p-6 text-heroink">
          <span className="absolute -top-2.5 left-6 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-accentink">
            Best for results
          </span>
          <div className="flex items-start justify-between">
            <div>
              <div className="h-display text-[26px]">Pass Pack</div>
              <div className="mt-1 text-[12.5px] font-medium text-heromut">Built to get you through first time</div>
            </div>
            <div className="text-right">
              <div className="font-display text-[34px] font-bold leading-none">{p.pass[platform]}</div>
              <div className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-heromut">once</div>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm font-medium">
            <li>✓ Everything in Unlock</li>
            <li>✓ Personal plan to your exam date</li>
            <li>✓ Full "why you'd fail today" diagnostics</li>
            <li>✓ Exam-day checklist &amp; booking guide</li>
            <li>✓ <b>Pass Promise:</b> fail with Readiness ≥ 90 → we extend for free</li>
          </ul>
          <button className="btn-primary mt-5 w-full text-[16px]" onClick={() => setNotice(true)}>
            Get Pass Pack · {p.pass[platform]}
          </button>
        </div>

        {/* Unlock */}
        <div className="card !rounded-[24px]">
          <div className="flex items-start justify-between">
            <div>
              <div className="h-display text-[22px]">Unlock</div>
              <div className="mt-1 text-[12.5px] font-medium text-muted">All content, no limits</div>
            </div>
            <div className="text-right">
              <div className="font-display text-[30px] font-bold leading-none">{p.unlock[platform]}</div>
              <div className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted">once</div>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm font-medium">
            <li>✓ Full question bank, every topic</li>
            <li>✓ Unlimited mock exams</li>
            <li>✓ Unlimited daily practice &amp; mistake drills</li>
          </ul>
          <button className="btn-ghost mt-5 w-full text-[16px]" onClick={() => setNotice(true)}>
            Get Unlock · {p.unlock[platform]}
          </button>
        </div>

        {/* Free reminder */}
        <div className="tile">
          <div className="text-sm font-bold">Free forever</div>
          <p className="mt-1 text-[13px] font-medium leading-relaxed text-muted">
            {FREE_DAILY_QUESTIONS} practice questions a day · 1 full mock exam · complete signs library with drills · Readiness Score. No account needed.
          </p>
        </div>

        <div className="pb-4 pt-1 text-center">
          <button className="text-[13px] font-bold text-accent" onClick={() => setVoucherOpen(!voucherOpen)}>
            Have a voucher code?
          </button>
          {voucherOpen && (
            <div className="mt-3 flex gap-2">
              <input
                value={code}
                onChange={(e) => { setCode(e.target.value); setVoucherError(false); }}
                placeholder="Enter code"
                className={`w-full rounded-tile border-[1.5px] bg-card px-4 py-3 font-medium uppercase outline-none ${voucherError ? "border-bad" : "border-line"}`}
              />
              <button className="btn-primary" onClick={redeem}>Redeem</button>
            </div>
          )}
          {voucherError && <p className="mt-2 text-xs font-medium text-bad">That code didn&apos;t work — check the spelling.</p>}
          <p className="mt-4 text-xs font-medium leading-relaxed text-muted">
            One-time purchase. No subscription, nothing auto-renews. Pass Promise terms apply.
          </p>
        </div>
      </div>

      {notice && (
        <div className="fixed inset-0 z-40 flex items-end justify-center backdrop-blur-[2px]" style={{ background: "rgba(2,0,53,0.55)" }} onClick={() => setNotice(false)}>
          <div className="mx-auto w-full max-w-lg animate-sheetUp rounded-t-[24px] bg-card px-6 pb-8 pt-6" onClick={(e) => e.stopPropagation()}>
            <p className="font-display text-xl font-bold uppercase">Almost there</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-muted">
              Purchases open with the App Store / Google Play release — we&apos;re in final testing. Until then the free plan is yours, and voucher codes work.
            </p>
            <button className="btn-primary mt-5 w-full" onClick={() => setNotice(false)}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Upgrade() {
  return (
    <Suspense fallback={null}>
      <UpgradeInner />
    </Suspense>
  );
}
