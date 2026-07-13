"use client";

import Link from "next/link";
import { useAppState } from "@/lib/store";
import { computeReadiness } from "@/lib/readiness";
import { BLOCK_META } from "@/data/topics";
import { Block } from "@/data/types";

const BLOCK_ORDER: Block[] = ["rules", "signs", "controls"];

export default function TopicsList() {
  const state = useAppState();
  const r = computeReadiness(state);

  return (
    <div className="animate-screenIn px-6 pt-4">
      <Link href="/practice/" className="text-[15px] font-bold text-accent">← Practice</Link>
      <h1 className="h-display mt-2 text-[28px]">Practice by topic</h1>
      <p className="mt-1 text-sm font-medium text-muted">Weakest topics first — that&apos;s where the marks are.</p>

      {BLOCK_ORDER.map((block) => {
        const topics = r.topics.filter((t) => t.topic.block === block);
        return (
          <section key={block} className="pt-6">
            <div className="caps-label mb-3">
              {BLOCK_META[block].name} · pass {BLOCK_META[block].pass}/{BLOCK_META[block].examCount}
            </div>
            <div className="space-y-2.5">
              {topics
                .sort((a, b) => a.mastery - b.mastery)
                .map((t) => {
                  const pct = Math.round(t.mastery * 100);
                  return (
                    <Link
                      key={t.topic.id}
                      href={`/practice/session/?topic=${t.topic.id}`}
                      className="tile block bg-card"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[16px] font-semibold">{t.topic.name}</span>
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
            </div>
          </section>
        );
      })}
    </div>
  );
}
