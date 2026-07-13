"use client";

import { useState } from "react";
import { DrillItem } from "@/lib/drill";
import { recordSignAnswer } from "@/lib/store";
import { useHideNav } from "@/lib/ui";
import { SignSvg } from "@/components/SignSvg";

const LETTERS = ["A", "B", "C", "D"];

interface Props {
  items: DrillItem[];
  title: string;
  onDone: (correct: number) => void;
  onExit: () => void;
}

/** Recognition drill: the sign itself is the question. */
export function DrillRunner({ items, title, onDone, onExit }: Props) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  useHideNav();

  if (items.length === 0) return null;
  const item = items[i];
  const answered = picked !== null;
  const wasCorrect = picked === item.answerIndex;

  function pick(idx: number) {
    if (answered) return;
    setPicked(idx);
    const ok = idx === item.answerIndex;
    if (ok) setCorrectCount((c) => c + 1);
    recordSignAnswer(item.sign.id, ok);
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
      <div>
        <div className="flex items-center justify-between">
          <button className="text-[15px] font-bold text-accent" onClick={onExit}>← Signs</button>
          <span className="font-bold">{i + 1} / {items.length}</span>
          <span className="w-12" />
        </div>
        <div className="mt-3 flex h-1.5 rounded-[3px] bg-line">
          <span className="rounded-[3px] bg-accent transition-all" style={{ width: `${((i + (answered ? 1 : 0)) / items.length) * 100}%` }} />
        </div>
      </div>

      {/* The sign IS the question */}
      <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
        <div className="caps-label">{title}</div>
        <div className="mt-6 rounded-card bg-card p-8 shadow-[0_1px_3px_rgba(2,0,53,0.08)]">
          <SignSvg spec={item.sign} size={150} />
        </div>
        <h2 className="mt-6 text-[22px] font-bold leading-tight">What does this sign mean?</h2>
      </div>

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
              <span className="flex-1 text-[15px]">{opt}</span>
            </button>
          );
        })}
      </div>
      <p className={`pb-6 pt-1 text-center text-xs font-medium text-muted ${answered ? "invisible" : ""}`}>
        Tap the meaning of this sign
      </p>

      {answered && (
        <div className="fixed inset-x-0 bottom-0 z-30">
          <div className="mx-auto max-w-lg animate-sheetUp rounded-t-[24px] bg-card px-6 pb-7 pt-5 shadow-[0_-12px_44px_rgba(2,0,53,0.28)]">
            <p className={`font-display text-xl font-bold uppercase ${wasCorrect ? "text-ok" : "text-bad"}`}>
              {wasCorrect ? "Correct" : "Not quite"}
            </p>
            <p className="mt-1.5 text-sm font-bold">{item.sign.name}</p>
            <p className="mt-1 text-sm font-medium leading-relaxed">{item.sign.desc}</p>
            <button className="btn-primary mt-4 w-full text-[17px]" onClick={next}>
              {i + 1 >= items.length ? "Finish" : "Next sign"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
