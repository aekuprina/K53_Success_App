"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { buildPracticeSession } from "@/lib/quiz";
import { getState } from "@/lib/store";
import { topicById } from "@/data/topics";
import { QuizRunner } from "@/components/QuizRunner";

function SessionInner() {
  const params = useSearchParams();
  const router = useRouter();
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
      <div className="flex min-h-[80vh] animate-screenIn flex-col items-center justify-center px-6 text-center">
        <div className="caps-label">{t?.name}</div>
        <div className="mt-2 font-display text-[96px] font-bold leading-none">
          {done}<span className="text-[28px] text-accent">/{items.length}</span>
        </div>
        <h1 className="h-display mt-3 text-[26px]">{pct >= 75 ? "Strong work" : "Keep going"}</h1>
        <p className="mt-2 max-w-[290px] text-sm font-medium text-muted">
          {pct >= 75 ? "Keep this topic warm until exam day." : "Mistakes go to your Fix-mistakes queue automatically."}
        </p>
        <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
          <button className="btn-primary text-[17px]" onClick={() => { setDone(null); setRunId((x) => x + 1); }}>
            Practise again
          </button>
          <Link href="/practice/" className="btn-ghost">Other topics</Link>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    );
  }

  return <QuizRunner items={items} onDone={setDone} onExit={() => router.push("/practice/")} exitLabel="Practice" />;
}

export default function PracticeSession() {
  return (
    <Suspense fallback={null}>
      <SessionInner />
    </Suspense>
  );
}
