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

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Practice by topic</h1>
        <p className="text-sm text-ink-500 dark:text-slate-400">Weakest topics first — that&apos;s where the marks are.</p>
      </header>

      {BLOCK_ORDER.map((block) => {
        const topics = r.topics.filter((t) => t.topic.block === block);
        return (
          <section key={block} className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500 dark:text-slate-400">
              {BLOCK_META[block].name} · pass {BLOCK_META[block].pass}/{BLOCK_META[block].examCount}
            </h2>
            <div className="space-y-2">
              {topics
                .sort((a, b) => a.mastery - b.mastery)
                .map((t) => {
                  const pct = Math.round(t.mastery * 100);
                  return (
                    <Link key={t.topic.id} href={`/practice/session/?topic=${t.topic.id}`} className="card block">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{t.topic.name}</span>
                        <span className="text-sm text-ink-500 dark:text-slate-400">{pct}%</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-300/40 dark:bg-slate-800">
                        <div
                          className={`h-full ${pct >= 75 ? "bg-brand-500" : pct >= 40 ? "bg-amber-400" : "bg-red-400"}`}
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-ink-500 dark:text-slate-400">
                        {t.attempted}/{t.total} questions seen
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
