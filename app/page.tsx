"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState, getState } from "@/lib/store";
import { computeReadiness, readinessLabel } from "@/lib/readiness";
import { EXAM_TOTAL } from "@/data/topics";

export default function Home() {
  const state = useAppState();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Read the store directly: the hydration snapshot may still hold the
    // server default (onboarded=false) when this effect first runs.
    if (!getState().onboarded) {
      router.replace("/welcome/");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  const r = computeReadiness(state);
  const { label, advice } = readinessLabel(r.score);
  const daysLeft = state.examDate
    ? Math.ceil((new Date(state.examDate).getTime() - Date.now()) / 86400000)
    : null;
  const lastMock = state.mocks.length ? state.mocks[state.mocks.length - 1] : null;

  return (
    <div className="animate-screenIn">
      {/* Hero */}
      <div className="rounded-b-hero bg-hero pb-8 text-heroink">
        <div className="flex items-center justify-between px-6 pt-4">
          <span className="text-[13px] font-extrabold tracking-[0.18em]">K53 SUCCESS</span>
          <span className="flex items-center gap-2">
            {daysLeft !== null && daysLeft >= 0 && (
              <span className="rounded-full bg-white/[0.13] px-3 py-1.5 text-[11px] font-bold tracking-[0.08em]">
                {daysLeft} DAYS TO EXAM
              </span>
            )}
            <Link href="/settings/" aria-label="Settings" className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/[0.13] font-display text-sm font-bold">
              {state.code}
            </Link>
          </span>
        </div>
        <div className="px-6 pt-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-heromut">Readiness</div>
          <div className="mt-2 flex items-start gap-1.5">
            <span className="font-display text-[112px] font-bold leading-[0.8]">{r.score}</span>
            <span className="mt-2 font-display text-[19px] font-semibold text-accent">/100</span>
          </div>
          <div className="mt-3.5 text-[26px] font-bold">{label}</div>
        </div>
        <div className="mx-6 mt-4 flex h-1.5 rounded-[3px] bg-white/15">
          <span className="rounded-[3px] bg-accent" style={{ width: `${Math.max(r.score, 2)}%` }} />
        </div>
        <p className="mx-6 mt-3.5 max-w-[290px] text-sm font-medium leading-relaxed text-heromut">{advice}</p>
      </div>

      {/* Fix these first */}
      {r.danger.length > 0 && (
        <div className="px-6 pt-7">
          <div className="caps-label mb-0.5">Fix these first</div>
          {r.danger.map((d, i) => (
            <Link
              key={d.topic.id}
              href={`/practice/session/?topic=${d.topic.id}`}
              className="flex items-center gap-3 border-b border-line py-4"
            >
              <span className={`h-[7px] w-[7px] flex-none rounded-full ${i === 0 ? "bg-accent" : "bg-line"}`} />
              <span className="text-[17px] font-semibold">{d.topic.name}</span>
              <span className="ml-auto text-[13px] font-medium text-muted">{Math.round(d.mastery * 100)}%</span>
            </Link>
          ))}
        </div>
      )}

      {/* Mock exam CTA */}
      <div className="px-6 pt-6">
        <Link href="/exam/" className="flex items-center gap-4 rounded-tile bg-accent px-5 py-5 text-accentink">
          <span className="font-display text-[46px] font-bold leading-[0.8]">{EXAM_TOTAL}</span>
          <span>
            <span className="block text-xl font-bold">Mock exam</span>
            <span className="mt-0.5 block text-[12.5px] font-medium opacity-80">Real CLLT format</span>
          </span>
          <span className="ml-auto font-display text-[22px] font-bold">→</span>
        </Link>
      </div>

      {/* Tiles */}
      <div className="grid grid-cols-2 gap-3 px-6 pt-3">
        <Link href="/practice/" className="tile">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.5" /></svg>
          <div className="mt-3 font-semibold">Practice topics</div>
          <div className="mt-0.5 text-xs font-medium text-muted">Train weak spots</div>
        </Link>
        <Link href="/mistakes/" className="tile relative">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 11a8 8 0 1 0-.8 3.5" /><path d="M20 5v6h-6" /></svg>
          <div className="mt-3 font-semibold">Fix mistakes</div>
          <div className="mt-0.5 text-xs font-medium text-muted">
            {state.mistakes.length ? `${state.mistakes.length} waiting` : "Nothing waiting"}
          </div>
          {state.mistakes.length > 0 && (
            <span className="absolute right-3.5 top-3.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-accentink">
              {state.mistakes.length}
            </span>
          )}
        </Link>
        <Link href="/signs/" className="tile col-span-2 flex items-center gap-3.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="12" y="2" width="14" height="14" rx="3" transform="rotate(45 12 2)" /></svg>
          <span>
            <span className="block font-semibold">Road signs</span>
            <span className="mt-0.5 block text-xs font-medium text-muted">Learn every sign</span>
          </span>
          <span className="ml-auto text-muted">→</span>
        </Link>
      </div>

      {/* Recent mock footer */}
      {lastMock && (
        <div className="flex items-center justify-between px-6 pb-2 pt-6 text-[12.5px] font-medium text-muted">
          <span>
            Recent mock ·{" "}
            <span className={`font-bold ${lastMock.passed ? "text-ok" : "text-accent"}`}>
              {lastMock.passed ? "Passed" : "Not passed"} {lastMock.percent}%
            </span>
          </span>
          <span>{new Date(lastMock.date).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}
