"use client";

import { useState } from "react";
import { ShuffledQuestion } from "@/lib/quiz";
import { recordAnswer, toggleBookmark, useAppState } from "@/lib/store";
import { topicById } from "@/data/topics";
import { getTr } from "@/lib/i18n";

const LETTERS = ["A", "B", "C", "D"];

interface Props {
  items: ShuffledQuestion[];
  onDone: (correct: number) => void;
}

/** Practice-style runner: answer → instant feedback sheet + plain-language explanation */
export function QuizRunner({ items, onDone }: Props) {
  const state = useAppState();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  if (items.length === 0) return null;
  const item = items[i];
  const answered = picked !== null;
  const bookmarked = state.bookmarks.includes(item.q.id);
  const tr = getTr(state.lang, item.q.id);
  const wasCorrect = picked === item.answerIndex;

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
    <div className="animate-screenIn">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold">
          {i + 1} / {items.length}
        </span>
        <span className="caps-label !mb-0">{topicById(item.q.topic)?.name}</span>
        <button
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark this question"}
          onClick={() => toggleBookmark(item.q.id)}
          className={bookmarked ? "text-accent" : "text-muted"}
        >
          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
            <path d="M6 3h12v18l-6-4-6 4z" />
          </svg>
        </button>
      </div>
      <div className="mt-3 flex h-1.5 rounded-[3px] bg-line">
        <span className="rounded-[3px] bg-accent transition-all" style={{ width: `${((i + (answered ? 1 : 0)) / items.length) * 100}%` }} />
      </div>

      <div className="pb-4 pt-8">
        <h2 className="text-[22px] font-bold leading-[1.32]">{item.q.q}</h2>
        {tr?.q && <p className="mt-2 text-sm font-medium italic text-muted">{tr.q}</p>}
      </div>

      <div className="space-y-2.5">
        {item.options.map((opt, idx) => {
          let box = "option-btn";
          let chip = "option-chip";
          if (answered) {
            if (idx === item.answerIndex) {
              box += " !border-2 !border-ok bg-ok-soft";
              chip += " !border-0 !bg-ok !text-white";
            } else if (idx === picked) {
              box += " !border-2 !border-bad bg-bad-soft";
              chip += " !border-0 !bg-bad !text-white";
            } else {
              box += " opacity-50";
            }
          }
          return (
            <button key={idx} className={box} disabled={answered} onClick={() => pick(idx)}>
              <span className={chip}>{LETTERS[idx]}</span>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 animate-sheetUp">
          <div className={`rounded-tile p-4 ${wasCorrect ? "bg-ok-soft" : "bg-bad-soft"}`}>
            <p className={`font-display text-lg font-bold uppercase ${wasCorrect ? "text-ok" : "text-bad"}`}>
              {wasCorrect ? "Correct" : "Not quite"}
            </p>
            {tr ? (
              <>
                <p className="mt-1.5 text-sm font-medium leading-relaxed">{tr.explain}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.q.explain}</p>
              </>
            ) : (
              <p className="mt-1.5 text-sm font-medium leading-relaxed">{item.q.explain}</p>
            )}
            {item.q.rule && <p className="mt-1.5 text-xs text-muted">Reference: {item.q.rule}</p>}
          </div>
          <button className="btn-primary mt-3 w-full text-[17px]" onClick={next}>
            {i + 1 >= items.length ? "Finish" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}
