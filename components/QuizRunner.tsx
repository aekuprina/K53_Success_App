"use client";

import { useState } from "react";
import { ShuffledQuestion } from "@/lib/quiz";
import { recordAnswer, toggleBookmark, useAppState } from "@/lib/store";
import { topicById } from "@/data/topics";

interface Props {
  items: ShuffledQuestion[];
  onDone: (correct: number) => void;
}

/** Practice-style runner: answer → instant feedback + plain-language explanation */
export function QuizRunner({ items, onDone }: Props) {
  const state = useAppState();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  if (items.length === 0) return null;
  const item = items[i];
  const answered = picked !== null;
  const bookmarked = state.bookmarks.includes(item.q.id);

  function pick(idx: number) {
    if (answered) return;
    setPicked(idx);
    const ok = idx === item.answerIndex;
    if (ok) setCorrectCount((c) => c + 1);
    recordAnswer(item.q.id, ok);
  }

  function next() {
    if (i + 1 >= items.length) {
      onDone(correctCount);
    } else {
      setI(i + 1);
      setPicked(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-ink-500 dark:text-slate-400">
        <span>
          Question {i + 1} of {items.length}
        </span>
        <span>{topicById(item.q.topic)?.name}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink-300/40 dark:bg-slate-800">
        <div className="h-full bg-brand-500 transition-all" style={{ width: `${((i + (answered ? 1 : 0)) / items.length) * 100}%` }} />
      </div>

      <div className="card space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-semibold leading-snug">{item.q.q}</h2>
          <button
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this question"}
            onClick={() => toggleBookmark(item.q.id)}
            className={`shrink-0 rounded-lg p-1.5 ${bookmarked ? "text-amber-500" : "text-ink-300 dark:text-slate-600"}`}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
              <path d="M6 3h12v18l-6-4-6 4z" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          {item.options.map((opt, idx) => {
            let cls = "option-btn";
            if (answered) {
              if (idx === item.answerIndex) cls += " !border-brand-500 !bg-brand-50 dark:!bg-brand-900/30";
              else if (idx === picked) cls += " !border-red-400 !bg-red-50 dark:!bg-red-900/20";
              else cls += " opacity-60";
            }
            return (
              <button key={idx} className={cls} disabled={answered} onClick={() => pick(idx)}>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`rounded-xl p-3 text-sm leading-relaxed ${
              picked === item.answerIndex
                ? "bg-brand-50 text-brand-900 dark:bg-brand-900/30 dark:text-brand-100"
                : "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100"
            }`}
          >
            <p className="font-semibold">{picked === item.answerIndex ? "Correct!" : "Not quite."}</p>
            <p className="mt-1">{item.q.explain}</p>
            {item.q.rule && <p className="mt-1 text-xs opacity-70">Reference: {item.q.rule}</p>}
          </div>
        )}
      </div>

      {answered && (
        <button className="btn-primary w-full" onClick={next}>
          {i + 1 >= items.length ? "Finish" : "Next question"}
        </button>
      )}
    </div>
  );
}
