"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/store";
import { computeReadiness, readinessLabel } from "@/lib/readiness";
import { ScoreRing } from "@/components/ScoreRing";

export default function Home() {
  const state = useAppState();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!state.onboarded) {
      router.replace("/welcome/");
    } else {
      setReady(true);
    }
  }, [state.onboarded, router]);

  if (!ready) return null;

  const r = computeReadiness(state);
  const { label, advice } = readinessLabel(r.score);
  const daysLeft = state.examDate
    ? Math.ceil((new Date(state.examDate).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">K53 Success</h1>
          <p className="text-sm text-ink-500 dark:text-slate-400">Code {state.code} · learner&apos;s licence</p>
        </div>
        {daysLeft !== null && daysLeft >= 0 && (
          <div className="rounded-xl bg-brand-600 px-3 py-2 text-center text-white">
            <div className="text-xl font-bold leading-none">{daysLeft}</div>
            <div className="text-[10px] uppercase tracking-wide">days to exam</div>
          </div>
        )}
      </header>

      <section className="card flex items-center gap-4">
        <ScoreRing score={r.score} size={120} />
        <div className="min-w-0">
          <h2 className="font-bold">{label}</h2>
          <p className="mt-1 text-sm text-ink-700 dark:text-slate-300">{advice}</p>
          <p className="mt-2 text-xs text-ink-500 dark:text-slate-400">
            Readiness Score estimates your chance of passing — it is not a guarantee.
          </p>
        </div>
      </section>

      {r.danger.length > 0 && r.score > 0 && (
        <section className="card">
          <h3 className="font-semibold">Your 3 danger topics</h3>
          <p className="mb-2 text-xs text-ink-500 dark:text-slate-400">Close these first — they are most likely to fail you.</p>
          <div className="space-y-2">
            {r.danger.map((d) => (
              <Link
                key={d.topic.id}
                href={`/practice/session/?topic=${d.topic.id}`}
                className="flex items-center justify-between rounded-xl bg-ink-100 px-3 py-2.5 text-sm font-medium dark:bg-slate-800"
              >
                <span>{d.topic.name}</span>
                <span className="text-xs text-ink-500 dark:text-slate-400">{Math.round(d.mastery * 100)}% mastered →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link href="/exam/" className="card block space-y-1 !bg-brand-600 text-white">
          <div className="text-2xl">📝</div>
          <div className="font-bold">Mock exam</div>
          <div className="text-xs opacity-90">68 questions, real CLLT format</div>
        </Link>
        <Link href="/practice/" className="card block space-y-1">
          <div className="text-2xl">🎯</div>
          <div className="font-bold">Practice topics</div>
          <div className="text-xs text-ink-500 dark:text-slate-400">Train your weak spots</div>
        </Link>
        <Link href="/mistakes/" className="card block space-y-1">
          <div className="text-2xl">🔁</div>
          <div className="font-bold">Fix mistakes</div>
          <div className="text-xs text-ink-500 dark:text-slate-400">
            {state.mistakes.length ? `${state.mistakes.length} waiting` : "Nothing waiting"}
          </div>
        </Link>
        <Link href="/signs/" className="card block space-y-1">
          <div className="text-2xl">🚸</div>
          <div className="font-bold">Road signs</div>
          <div className="text-xs text-ink-500 dark:text-slate-400">Learn every sign</div>
        </Link>
      </div>

      {state.mocks.length > 0 && (
        <section className="card">
          <h3 className="font-semibold">Recent mock exams</h3>
          <div className="mt-2 space-y-1.5 text-sm">
            {state.mocks.slice(-3).reverse().map((m, i) => (
              <div key={i} className="flex justify-between">
                <span className={m.passed ? "text-brand-600 font-medium" : "text-red-500 font-medium"}>
                  {m.passed ? "Passed" : "Not passed"} · {m.percent}%
                </span>
                <span className="text-ink-500 dark:text-slate-400">{new Date(m.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
