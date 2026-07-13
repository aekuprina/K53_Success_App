"use client";

import Link from "next/link";
import { useAppState } from "@/lib/store";
import { SIGNS, SIGN_CATEGORIES, signById } from "@/data/signs";
import { SignSvg } from "@/components/SignSvg";
import { categoryProgress, overallProgress, isLearned } from "@/lib/drill";

// Representative sign shown as the category thumbnail
const CAT_REP: Record<string, string> = {
  regulatory: "speed-60",
  warning: "w-general",
  guidance: "g-freeway-dir",
  information: "i-parking",
  temporary: "t-roadworks",
};

export default function SignsLanding() {
  const state = useAppState();
  const overall = overallProgress(state);
  const overallPct = overall.total ? Math.round((overall.learned / overall.total) * 100) : 0;

  const progress = SIGN_CATEGORIES.map((c) => ({
    meta: c,
    ...categoryProgress(state, c.id),
    share: categoryProgress(state, c.id).total
      ? categoryProgress(state, c.id).learned / categoryProgress(state, c.id).total
      : 0,
  }));
  const weakest = [...progress].sort((a, b) => a.share - b.share)[0];
  const missRate = weakest ? 100 - Math.round(weakest.share * 100) : 100;
  const heroSign =
    SIGNS.find((s) => s.category === weakest?.meta.id && !isLearned(state, s.id)) ??
    signById(CAT_REP[weakest?.meta.id ?? "warning"]);

  return (
    <div className="animate-screenIn px-6 pt-4">
      <h1 className="h-display text-[28px]">Road signs</h1>

      {/* Learning progress */}
      <div className="mt-3 flex items-center justify-between">
        <span className="caps-label !mb-0">{overall.learned} of {overall.total} learned</span>
        <span className="text-[13px] font-medium text-muted">{overallPct}% recognised</span>
      </div>
      <div className="mt-2 flex h-1.5 rounded-[3px] bg-line">
        <span className="rounded-[3px] bg-accent" style={{ width: `${Math.max(overallPct, 2)}%` }} />
      </div>

      {/* Daily drill — weakest category, with the sign itself */}
      {weakest && (
        <div className="mt-5 rounded-[24px] bg-hero p-6 text-heroink">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-accent">Daily drill · What you miss most</div>
          <div className="mt-3 flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="h-display text-[30px] leading-[1.02]">{weakest.meta.name}</div>
              <div className="mt-2 text-[12.5px] font-medium text-heromut">Your weakest set · miss rate {missRate}%</div>
            </div>
            {heroSign && <SignSvg spec={heroSign} size={86} />}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-[6px] flex-1 rounded-[3px] bg-white/15">
              <span className="rounded-[3px] bg-accent" style={{ width: `${Math.max(weakest.share * 100, 3)}%` }} />
            </div>
            <span className="font-display text-[13px] font-bold">{weakest.learned} / {weakest.total}</span>
          </div>
          <Link href={`/signs/drill/?cat=${weakest.meta.id}`} className="btn-primary mt-4 w-full text-[16px]">
            Start recognition drill <span className="ml-2 font-display">→</span>
          </Link>
        </div>
      )}

      {/* Browse by type — real signs, learning progress per category */}
      <div className="pt-7">
        <div className="caps-label">Browse by type</div>
        {progress.map((p) => {
          const rep = signById(CAT_REP[p.meta.id]);
          const isWeakest = p.meta.id === weakest?.meta.id;
          return (
            <Link
              key={p.meta.id}
              href={`/signs/cat/${p.meta.id}/`}
              className="flex items-center gap-3.5 border-b border-line py-3.5"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center">
                {rep && <SignSvg spec={rep} size={40} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-[16px] font-semibold">{p.meta.name.replace(" signs", "")}</span>
                  {isWeakest && (
                    <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-accent" style={{ background: "rgba(237,75,0,0.12)" }}>
                      Weakest
                    </span>
                  )}
                </span>
                <span className="mt-1.5 flex h-[4px] max-w-[180px] rounded-[3px] bg-line">
                  <span className="min-w-[4px] rounded-[3px] bg-accent" style={{ width: `${Math.max(p.share * 100, 2)}%` }} />
                </span>
              </span>
              <span className="ml-2 flex flex-none items-center gap-1.5 text-[14px]">
                <span className="font-display font-bold">{p.learned}</span>
                <span className="font-medium text-muted">/{p.total}</span>
                <span className="text-muted">›</span>
              </span>
            </Link>
          );
        })}
      </div>

      <Link
        href="/signs/browse/"
        className="mt-5 flex items-center gap-2.5 rounded-tile border-[1.5px] border-line bg-card px-4 py-3.5 font-medium text-muted"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
        Search all {SIGNS.length} signs
      </Link>
    </div>
  );
}
