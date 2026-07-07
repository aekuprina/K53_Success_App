"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppState, getState } from "@/lib/store";
import { buildMistakesSession, shuffleOptions, ShuffledQuestion } from "@/lib/quiz";
import { BANK_BY_ID } from "@/data/bank";
import { QuizRunner } from "@/components/QuizRunner";

export default function Mistakes() {
  const state = useAppState();
  const [session, setSession] = useState<ShuffledQuestion[] | null>(null);
  const [done, setDone] = useState<number | null>(null);

  if (session && done === null) {
    return (
      <div className="space-y-4">
        <button className="text-sm font-medium text-brand-600" onClick={() => setSession(null)}>← Stop session</button>
        <QuizRunner items={session} onDone={setDone} />
      </div>
    );
  }

  if (session && done !== null) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="text-5xl">🔁</div>
        <h1 className="text-2xl font-bold">{done}/{session.length} fixed</h1>
        <p className="text-ink-500 dark:text-slate-400">Answer a question correctly twice in a row and it leaves the queue.</p>
        <div className="flex w-full max-w-xs flex-col gap-2">
          <button className="btn-primary" onClick={() => { setSession(null); setDone(null); }}>Back to queue</button>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    );
  }

  const bookmarkedQs = state.bookmarks.map((id) => BANK_BY_ID.get(id)).filter(Boolean);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Fix mistakes</h1>
        <p className="text-sm text-ink-500 dark:text-slate-400">Your personal queue — the fastest way to raise your Readiness Score.</p>
      </header>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Mistake queue</h2>
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-bold text-red-600 dark:bg-red-900/30">{state.mistakes.length}</span>
        </div>
        {state.mistakes.length === 0 ? (
          <p className="text-sm text-ink-500 dark:text-slate-400">Nothing here — mistakes from practice and mock exams land in this queue automatically.</p>
        ) : (
          <button className="btn-primary w-full" onClick={() => { setDone(null); setSession(buildMistakesSession(getState())); }}>
            Practise {Math.min(state.mistakes.length, 15)} mistakes
          </button>
        )}
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Bookmarked questions</h2>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-bold text-amber-600 dark:bg-amber-900/30">{bookmarkedQs.length}</span>
        </div>
        {bookmarkedQs.length === 0 ? (
          <p className="text-sm text-ink-500 dark:text-slate-400">Tap the bookmark icon on any question to save it here.</p>
        ) : (
          <button
            className="btn-ghost w-full"
            onClick={() => {
              const salt = Date.now() & 0xffff;
              setDone(null);
              setSession(bookmarkedQs.map((q) => shuffleOptions(q!, salt)));
            }}
          >
            Practise bookmarks
          </button>
        )}
      </div>
    </div>
  );
}
