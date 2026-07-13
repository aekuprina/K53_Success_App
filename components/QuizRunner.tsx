"use client";

import { useState } from "react";
import { ShuffledQuestion } from "@/lib/quiz";
import { recordAnswer, toggleBookmark, useAppState } from "@/lib/store";
import { topicById } from "@/data/topics";
import { getTr } from "@/lib/i18n";
import { useHideNav } from "@/lib/ui";

const LETTERS = ["A", "B", "C", "D"];

interface Props {
  items: ShuffledQuestion[];
  onDone: (correct: number) => void;
  onExit?: () => void;
  exitLabel?: string;
}

/**
 * Study runner, Ultramarine layout: question is the central element,
 * options sit at the bottom within thumb reach, feedback slides up as a sheet.
 */
export function QuizRunner({ items, onDone, onExit, exitLabel = "Back" }: Props) {
  const state = useAppState();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  useHideNav();

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
    <div className="flex min-h-screen animate-screenIn flex-col px-6 pt-4">
      {/* Top bar */}
      <div>
        <div className="flex items-center justify-between">
          {onExit ? (
            <button className="text-[15px] font-bold text-accent" onClick={onExit}>← {exitLabel}</button>
          ) : (
            <span className="font-bold">{i + 1} / {items.length}</span>
          )}
          {onExit && <span className="font-bold">{i + 1} / {items.length}</span>}
          <button
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this question"}
            onClick={() => toggleBookmark(item.q.id)}
            className={`-m-2 p-2 ${bookmarked ? "text-accent" : "text-muted"}`}
          >
            <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
              <path d="M6 3h12v18l-6-4-6 4z" />
            </svg>
          </button>
        </div>
        <div className="mt-3 flex h-1.5 rounded-[3px] bg-line">
          <span className="rounded-[3px] bg-accent transition-all" style={{ width: `${((i + (answered ? 1 : 0)) / items.length) * 100}%` }} />
        </div>
      </div>

      {/* Question — the central element */}
      <div className="flex flex-1 flex-col justify-center py-6">
        <div className="caps-label">{topicById(item.q.topic)?.name}</div>
        <h2 className="mt-3 text-[26px] font-bold leading-[1.32]">{item.q.q}</h2>
        {tr?.q && <p className="mt-2.5 text-sm font-medium italic text-muted">{tr.q}</p>}
      </div>

      {/* Options — bottom, thumb reach */}
      <div className="space-y-2.5 pb-2">
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
      <p className={`pb-6 pt-1 text-center text-xs font-medium text-muted ${answered ? "invisible" : ""}`}>
        Tap the answer you think is correct
      </p>

      {/* Feedback sheet */}
      {answered && (
        <div className="fixed inset-x-0 bottom-0 z-30">
          <div className="mx-auto max-w-lg animate-sheetUp rounded-t-[24px] bg-card px-6 pb-7 pt-5 shadow-[0_-12px_44px_rgba(2,0,53,0.28)]">
            <p className={`font-display text-xl font-bold uppercase ${wasCorrect ? "text-ok" : "text-bad"}`}>
              {wasCorrect ? "Correct" : "Not quite"}
            </p>
            {!wasCorrect && (
              <p className="mt-1.5 text-sm font-bold">Correct: {item.options[item.answerIndex]}</p>
            )}
            {tr ? (
              <>
                <p className="mt-1.5 text-sm font-medium leading-relaxed">{tr.explain}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.q.explain}</p>
              </>
            ) : (
              <p className="mt-1.5 text-sm font-medium leading-relaxed">{item.q.explain}</p>
            )}
            {item.q.rule && <p className="mt-1.5 text-xs text-muted">Reference: {item.q.rule}</p>}
            <button className="btn-primary mt-4 w-full text-[17px]" onClick={next}>
              {i + 1 >= items.length ? "Finish" : "Next question"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
