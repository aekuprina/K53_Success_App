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
      <div className="px-6 pt-4">
        <button className="mb-4 text-[15px] font-bold text-accent" onClick={() => setSession(null)}>← Stop session</button>
        <QuizRunner items={session} onDone={setDone} />
      </div>
    );
  }

  if (session && done !== null) {
    return (
      <div className="flex min-h-[80vh] animate-screenIn flex-col items-center justify-center px-6 text-center">
        <div className="font-display text-[96px] font-bold leading-none">
          {done}<span className="text-[28px] text-accent">/{session.length}</span>
        </div>
        <h1 className="h-display mt-3 text-[26px]">Fixed</h1>
        <p className="mt-2 max-w-[290px] text-sm font-medium text-muted">
          Answer a question correctly twice in a row and it leaves the queue.
        </p>
        <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
          <button className="btn-primary text-[17px]" onClick={() => { setSession(null); setDone(null); }}>Back to queue</button>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    );
  }

  const bookmarkedQs = state.bookmarks.map((id) => BANK_BY_ID.get(id)).filter(Boolean);

  return (
    <div className="animate-screenIn px-6 pt-4">
      <h1 className="h-display text-[28px]">Fix mistakes</h1>
      <p className="mt-1 text-sm font-medium text-muted">Your personal queue — the fastest way to raise your Readiness Score.</p>

      <div className="mt-5 rounded-[24px] bg-hero p-6 text-heroink">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-accent">Mistake queue</div>
            <div className="mt-2 font-display text-[64px] font-bold leading-[0.85]">{state.mistakes.length}</div>
            <div className="mt-1.5 text-[12.5px] font-medium text-heromut">
              {state.mistakes.length === 0
                ? "Nothing here — mistakes land in this queue automatically."
                : "waiting for you"}
            </div>
          </div>
        </div>
        {state.mistakes.length > 0 && (
          <button
            className="btn-primary mt-5 w-full text-[16px]"
            onClick={() => { setDone(null); setSession(buildMistakesSession(getState())); }}
          >
            Practise {Math.min(state.mistakes.length, 15)} mistakes
          </button>
        )}
      </div>

      <div className="tile mt-4 flex items-center gap-3.5">
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] flex-none" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><path d="M6 3h12v18l-6-4-6 4z" /></svg>
        <div className="flex-1">
          <div className="font-semibold">Bookmarked questions</div>
          <div className="mt-0.5 text-xs font-medium text-muted">
            {bookmarkedQs.length ? `${bookmarkedQs.length} saved` : "Tap the bookmark icon on any question"}
          </div>
        </div>
        {bookmarkedQs.length > 0 && (
          <button
            className="text-sm font-bold text-accent"
            onClick={() => {
              const salt = Date.now() & 0xffff;
              setDone(null);
              setSession(bookmarkedQs.map((q) => shuffleOptions(q!, salt)));
            }}
          >
            Practise →
          </button>
        )}
      </div>
    </div>
  );
}
