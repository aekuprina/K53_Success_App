"use client";

import Link from "next/link";
import { useAppState } from "@/lib/store";
import { computeReadiness } from "@/lib/readiness";
import { BLOCK_META } from "@/data/topics";
import { Block } from "@/data/types";

const BLOCK_ORDER: Block[] = ["rules", "signs", "controls"];

export default function Practice() {
  const state = useAppState();
  const r = computeReadiness(state);
  const weakest = [...r.topics].sort((a, b) => a.mastery - b.mastery)[0];

  return (
    <div className="animate-screenIn px-6 pt-4">
      <h1 className="h-display text-[28px]">Practice by topic</h1>
      <p className="mt-1 text-sm font-medium text-muted">Weakest topics first — that&apos;s where the marks are.</p>

      {/* Start here — weakest topic hero card */}
      {weakest && (
        <Link
          href={`/practice/session/?topic=${weakest.topic.id}`}
          className="mt-5 block rounded-[24px] bg-hero p-6 text-heroink"
        >
          <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-accent">Start here · Your weakest</div>
          <div className="h-display mt-3 text-[32px] leading-none">{weakest.topic.name}</div>
          <div className="mt-2.5 text-[12.5px] font-medium text-heromut">
            {weakest.total} questions · {Math.round(weakest.mastery * 100)}% mastered
          </div>
          <div className="mt-5 inline-flex items-center gap-2 rounded-tile bg-accent px-4 py-2.5 text-[15px] font-bold text-accentink">
            Start practising <span className="font-display">→</span>
          </div>
        </Link>
      )}

      {BLOCK_ORDER.map((block) => {
        const topics = r.topics.filter((t) => t.topic.block === block);
        return (
          <section key={block} className="pt-7">
            <div className="caps-label">
              {BLOCK_META[block].name} · pass {BLOCK_META[block].pass}/{BLOCK_META[block].examCount}
            </div>
            {topics
              .sort((a, b) => a.mastery - b.mastery)
              .map((t) => {
                const pct = Math.round(t.mastery * 100);
                return (
                  <Link
                    key={t.topic.id}
                    href={`/practice/session/?topic=${t.topic.id}`}
                    className="block border-b border-line py-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[17px] font-semibold">{t.topic.name}</span>
                      <span className="text-[13px] font-medium text-muted">{pct}%</span>
                    </div>
                    <div className="mt-2.5 flex h-[5px] rounded-[3px] bg-line">
                      <span
                        className={`min-w-[8px] rounded-[3px] ${pct >= 75 ? "bg-ok" : "bg-accent"}`}
                        style={{ width: `${Math.max(pct, 3)}%` }}
                      />
                    </div>
                    <div className="mt-1.5 text-xs font-medium text-muted">
                      {t.attempted}/{t.total} questions seen
                    </div>
                  </Link>
                );
              })}
          </section>
        );
      })}
    </div>
  );
}
