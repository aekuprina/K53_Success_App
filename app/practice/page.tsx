"use client";

import Link from "next/link";
import { useAppState } from "@/lib/store";
import { computeReadiness } from "@/lib/readiness";
import { BLOCK_META, TOPICS } from "@/data/topics";

const STEPS = ["Learn", "Practice", "Test"];

export default function Practice() {
  const state = useAppState();
  const r = computeReadiness(state);
  const byWeakness = [...r.topics].sort((a, b) => a.mastery - b.mastery);
  const weakest = byWeakness[0];
  const path = byWeakness.slice(0, 3);
  const remaining = TOPICS.length - path.length;
  const examShare = weakest
    ? Math.round((BLOCK_META[weakest.topic.block].examCount / 64) * 100)
    : 0;

  return (
    <div className="animate-screenIn px-6 pt-4">
      <h1 className="h-display text-[28px]">Practice</h1>
      <p className="mt-1 text-sm font-medium text-muted">One step at a time — we picked where to start.</p>

      {/* Start here — weakest topic hero card with Learn→Practice→Test stepper */}
      {weakest && (
        <div className="mt-5 rounded-[24px] bg-hero p-6 text-heroink">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-accent">Start here · Your weakest</div>
          <div className="h-display mt-3 text-[32px] leading-[1.02]">{weakest.topic.name}</div>
          <div className="mt-2.5 text-[12.5px] font-medium text-heromut">
            {weakest.total} questions · ~6 min · {examShare}% of the exam
          </div>

          <div className="mt-5 flex items-center">
            {STEPS.map((s, idx) => (
              <span key={s} className="contents">
                <span className="flex flex-none flex-col items-center gap-1.5">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full font-display text-[11px] font-bold ${
                      idx === 0 ? "bg-accent text-accentink" : "border-[1.5px] border-white/25 text-heromut"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className={`text-[8.5px] font-bold uppercase tracking-[0.08em] ${idx === 0 ? "" : "text-heromut"}`}>{s}</span>
                </span>
                {idx < STEPS.length - 1 && <span className="mx-1 mb-4 h-[1.5px] flex-1 bg-white/25" />}
              </span>
            ))}
          </div>

          <Link
            href={`/practice/session/?topic=${weakest.topic.id}`}
            className="btn-primary mt-4 w-full text-[16px]"
          >
            Start practising <span className="ml-2 font-display">→</span>
          </Link>
        </div>
      )}

      {/* Your path */}
      <div className="pt-7">
        <div className="caps-label">Your path · weakest first</div>
        {path.map((t, idx) => (
          <Link
            key={t.topic.id}
            href={`/practice/session/?topic=${t.topic.id}`}
            className="flex items-center gap-3.5 border-b border-line py-4"
          >
            <span
              className={`flex h-7 w-7 flex-none items-center justify-center rounded-full font-display text-[13px] font-bold ${
                idx === 0 ? "bg-accent text-accentink" : "border-[1.5px] border-line text-muted"
              }`}
            >
              {idx + 1}
            </span>
            <span>
              <span className="block text-[16px] font-semibold">{t.topic.name}</span>
              <span className="mt-0.5 block text-xs font-medium text-muted">
                {t.attempted}/{t.total} questions seen
              </span>
            </span>
            <span className="ml-auto text-[13px] font-medium text-muted">{Math.round(t.mastery * 100)}%</span>
          </Link>
        ))}
        <div className="flex items-center gap-3.5 py-4">
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed border-line font-display text-[13px] font-bold text-muted">
            +
          </span>
          <span className="text-sm font-medium text-muted">{remaining} more topics — unlock as you go</span>
        </div>
      </div>

      <Link href="/practice/topics/" className="block pb-4 pt-3 text-center text-[15px] font-bold text-accent">
        Prefer to choose? Browse all topics
      </Link>
    </div>
  );
}
