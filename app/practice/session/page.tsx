"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buildPracticeSession } from "@/lib/quiz";
import { getState } from "@/lib/store";
import { topicById } from "@/data/topics";
import { QuizRunner } from "@/components/QuizRunner";

function SessionInner() {
  const params = useSearchParams();
  const topic = params.get("topic") ?? "rules-road";
  const [done, setDone] = useState<number | null>(null);
  const [runId, setRunId] = useState(0);

  const items = useMemo(
    () => buildPracticeSession(topic, getState(), 12),
    [topic, runId]
  );

  const t = topicById(topic);

  if (done !== null) {
    const pct = Math.round((done / items.length) * 100);
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="text-5xl">{pct >= 75 ? "🎉" : pct >= 50 ? "💪" : "📚"}</div>
        <h1 className="text-2xl font-bold">
          {done}/{items.length} correct
        </h1>
        <p className="text-ink-500 dark:text-slate-400">
          {pct >= 75 ? "Strong work — keep this topic warm." : "Mistakes go to your Fix-mistakes queue automatically."}
        </p>
        <div className="flex w-full max-w-xs flex-col gap-2">
          <button className="btn-primary" onClick={() => { setDone(null); setRunId((x) => x + 1); }}>
            Practise again
          </button>
          <Link href="/practice/" className="btn-ghost">Other topics</Link>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/practice/" className="text-sm font-medium text-brand-600">← Topics</Link>
        <h1 className="text-sm font-semibold">{t?.name}</h1>
      </div>
      <QuizRunner items={items} onDone={setDone} />
    </div>
  );
}

export default function PracticeSession() {
  return (
    <Suspense fallback={null}>
      <SessionInner />
    </Suspense>
  );
}
