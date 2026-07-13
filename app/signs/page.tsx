"use client";

import Link from "next/link";
import { useAppState } from "@/lib/store";
import { computeReadiness } from "@/lib/readiness";
import { SIGNS, SIGN_CATEGORIES } from "@/data/signs";

// Sign-related practice topics, weakest drives the daily drill
const SIGN_TOPICS = ["reg", "warn", "guide", "mark", "tsig"];

const CAT_ICONS: Record<string, React.ReactNode> = {
  regulatory: <circle cx="12" cy="12" r="8.5" />,
  warning: <path d="M12 4 21 20H3z" strokeLinejoin="round" />,
  guidance: <path d="M4 12h13M13 6l6 6-6 6" />,
  information: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 10.5V16M12 8v.5" /></>,
  temporary: <><path d="M6 20 12 5l6 15" strokeLinejoin="round" /><path d="M8.5 14h7" /></>,
};

export default function SignsLanding() {
  const state = useAppState();
  const r = computeReadiness(state);
  const signTopics = r.topics.filter((t) => SIGN_TOPICS.includes(t.topic.id));
  const weakest = [...signTopics].sort((a, b) => a.mastery - b.mastery)[0];
  const missRate = weakest ? 100 - Math.round(weakest.mastery * 100) : 100;

  return (
    <div className="animate-screenIn px-6 pt-4">
      <h1 className="h-display text-[28px]">Road signs</h1>
      <p className="mt-1 text-sm font-medium text-muted">{SIGNS.length} signs · offline · growing every release</p>

      {/* Daily drill — weakest sign topic */}
      {weakest && (
        <div className="mt-5 rounded-[24px] bg-hero p-6 text-heroink">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-accent">Daily drill · What you miss most</div>
          <div className="h-display mt-3 text-[32px] leading-[1.02]">{weakest.topic.name}</div>
          <div className="mt-2.5 text-[12.5px] font-medium text-heromut">
            Your weakest set · miss rate {missRate}%
          </div>
          <Link href={`/practice/session/?topic=${weakest.topic.id}`} className="btn-primary mt-5 w-full text-[16px]">
            Start recognition drill <span className="ml-2 font-display">→</span>
          </Link>
        </div>
      )}

      {/* Browse by type */}
      <div className="pt-7">
        <div className="caps-label">Browse by type</div>
        {SIGN_CATEGORIES.map((c) => {
          const count = SIGNS.filter((s) => s.category === c.id).length;
          return (
            <Link
              key={c.id}
              href={`/signs/browse/?cat=${c.id}`}
              className="flex items-center gap-3.5 border-b border-line py-4"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border-[1.5px] border-line">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                  {CAT_ICONS[c.id]}
                </svg>
              </span>
              <span className="text-[16px] font-semibold">{c.name.replace(" signs", "")}</span>
              <span className="ml-auto flex items-center gap-2 text-[13px] font-medium text-muted">
                {count}
                <span className="font-display text-accent">→</span>
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
