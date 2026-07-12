"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { buildMockExam, scoreMock, ShuffledQuestion, MockOutcome } from "@/lib/quiz";
import { addMockResult, recordAnswer, useAppState } from "@/lib/store";
import { getTr } from "@/lib/i18n";
import { BLOCK_META, EXAM_MINUTES, EXAM_TOTAL } from "@/data/topics";

type Phase = "intro" | "running" | "results";

const LETTERS = ["A", "B", "C", "D"];

export default function MockExam() {
  const appState = useAppState();
  const [phase, setPhase] = useState<Phase>("intro");
  const [items, setItems] = useState<ShuffledQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [i, setI] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_MINUTES * 60);
  const [outcome, setOutcome] = useState<MockOutcome | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function start() {
    const built = buildMockExam();
    setItems(built);
    setAnswers(new Array(built.length).fill(null));
    setI(0);
    setSecondsLeft(EXAM_MINUTES * 60);
    setPhase("running");
  }

  function finish(finalAnswers: (number | null)[], builtItems: ShuffledQuestion[]) {
    if (timerRef.current) clearInterval(timerRef.current);
    const out = scoreMock(builtItems, finalAnswers);
    builtItems.forEach((item, idx) => {
      if (finalAnswers[idx] !== null) recordAnswer(item.q.id, finalAnswers[idx] === item.answerIndex);
    });
    addMockResult({ date: Date.now(), rules: out.rules, signs: out.signs, controls: out.controls, passed: out.passed, percent: out.percent });
    setOutcome(out);
    setPhase("results");
  }

  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase === "running" && secondsLeft === 0) finish(answers, items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase]);

  const answeredCount = useMemo(() => answers.filter((a) => a !== null).length, [answers]);

  if (phase === "intro") {
    return (
      <div className="animate-screenIn px-6 pt-4">
        <Link href="/" className="text-[15px] font-bold text-accent">← Home</Link>
        <h1 className="h-display mt-3.5 text-[30px] leading-[1.05]">Mock exam</h1>
        <p className="mt-1.5 text-[15px] font-medium text-muted">Exactly like the computerised test at the DLTC.</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="tile text-center">
            <div className="font-display text-[34px] font-bold leading-none">{EXAM_TOTAL}</div>
            <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Questions</div>
          </div>
          <div className="tile text-center">
            <div className="font-display text-[34px] font-bold leading-none">{EXAM_MINUTES}</div>
            <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Minutes</div>
          </div>
          <div className="tile text-center">
            <div className="font-display text-[34px] font-bold leading-none">3</div>
            <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">Blocks</div>
          </div>
        </div>

        <div className="mt-4 rounded-[24px] bg-hero p-6 text-heroink">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-accent">Pass every block — total is not enough</div>
          {(["rules", "signs", "controls"] as const).map((b) => (
            <div key={b} className="mt-4 flex items-center justify-between">
              <span className="text-[15px] font-semibold">{BLOCK_META[b].name}</span>
              <span className="font-display text-lg font-bold">
                {BLOCK_META[b].pass}<span className="text-heromut">/{BLOCK_META[b].examCount}</span>
              </span>
            </div>
          ))}
          <p className="mt-4 text-[12.5px] font-medium leading-relaxed text-heromut">
            64 scored + 4 unscored pilot questions. No feedback until the end; you can go back and change answers.
          </p>
        </div>

        <button className="btn-primary mt-5 w-full text-[17px]" onClick={start}>Start mock exam</button>
      </div>
    );
  }

  if (phase === "results" && outcome) {
    const blocks = [
      { name: BLOCK_META.rules.name, got: outcome.rules[0], of: outcome.rules[1], pass: Math.round((BLOCK_META.rules.pass / BLOCK_META.rules.examCount) * outcome.rules[1]) },
      { name: BLOCK_META.signs.name, got: outcome.signs[0], of: outcome.signs[1], pass: Math.round((BLOCK_META.signs.pass / BLOCK_META.signs.examCount) * outcome.signs[1]) },
      { name: BLOCK_META.controls.name, got: outcome.controls[0], of: outcome.controls[1], pass: Math.round((BLOCK_META.controls.pass / BLOCK_META.controls.examCount) * outcome.controls[1]) },
    ];
    const wrong = items
      .map((item, idx) => ({ item, idx }))
      .filter(({ item, idx }) => answers[idx] !== item.answerIndex);
    return (
      <div className="animate-screenIn px-6 pb-8 pt-8">
        <div className="text-center">
          <div className="caps-label">Mock result</div>
          <div className="mt-2 font-display text-[96px] font-bold leading-[0.85]">
            {outcome.percent}<span className="text-[28px] text-accent">%</span>
          </div>
          <h1 className={`h-display mt-3 text-[28px] ${outcome.passed ? "text-ok" : "text-bad"}`}>
            {outcome.passed ? "You passed" : "Not yet"}
          </h1>
        </div>

        <div className="card mt-6">
          {blocks.map((b, idx) => {
            const ok = b.got >= b.pass;
            return (
              <div key={b.name} className={idx > 0 ? "mt-4" : ""}>
                <div className="flex justify-between text-sm font-semibold">
                  <span>{b.name}</span>
                  <span className={ok ? "text-ok" : "text-bad"}>
                    {b.got}/{b.of} · need {b.pass}
                  </span>
                </div>
                <div className="mt-2 flex h-1.5 rounded-[3px] bg-line">
                  <span className={`rounded-[3px] ${ok ? "bg-ok" : "bg-bad"}`} style={{ width: `${(b.got / Math.max(b.of, 1)) * 100}%` }} />
                </div>
              </div>
            );
          })}
          <p className="mt-4 text-xs font-medium text-muted">Pilot questions are not scored — same as the real test.</p>
        </div>

        {wrong.length > 0 && (
          <div className="card mt-4">
            <h2 className="h-display text-lg">Review mistakes ({wrong.length})</h2>
            {wrong.slice(0, 20).map(({ item, idx }) => (
              <div key={item.q.id} className="mt-4 border-t border-line pt-4 text-sm first:mt-2">
                <p className="font-semibold">{item.q.q}</p>
                <p className="mt-1.5 font-medium text-bad">
                  {answers[idx] !== null ? `Your answer: ${item.options[answers[idx]!]}` : "Not answered"}
                </p>
                <p className="font-medium text-ok">Correct: {item.options[item.answerIndex]}</p>
                <p className="mt-1.5 leading-relaxed text-muted">{getTr(appState.lang, item.q.id)?.explain ?? item.q.explain}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2.5">
          <button className="btn-primary text-[17px]" onClick={start}>Try another mock</button>
          <Link href="/mistakes/" className="btn-ghost">Practise my mistakes</Link>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    );
  }

  // running — options at the bottom, question centered (prototype layout)
  const item = items[i];
  const mm = Math.floor(secondsLeft / 60);
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const blockLabel = item.pilot ? "PILOT QUESTION" : BLOCK_META[item.q.block].name.toUpperCase();
  return (
    <div className="flex min-h-screen animate-screenIn flex-col px-6 pt-4">
      <div>
        <div className="flex items-center justify-between">
          <span className="font-bold">{i + 1} / {items.length}</span>
          <span className={`font-display text-[17px] font-bold ${secondsLeft < 300 ? "text-bad" : ""}`}>
            {mm}:{ss}
          </span>
          <button
            className="text-sm font-bold text-accent"
            onClick={() => {
              if (answeredCount < items.length && !window.confirm(`You have ${items.length - answeredCount} unanswered questions. Finish anyway?`)) return;
              finish(answers, items);
            }}
          >
            Finish
          </button>
        </div>
        <div className="mt-3 flex h-1.5 rounded-[3px] bg-line">
          <span className="rounded-[3px] bg-accent transition-all" style={{ width: `${(answeredCount / items.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center py-6">
        <div className="caps-label">{blockLabel}</div>
        <h2 className="mt-3 text-[26px] font-bold leading-[1.32]">{item.q.q}</h2>
      </div>

      <div className="space-y-2.5">
        {item.options.map((opt, idx) => {
          const sel = answers[i] === idx;
          return (
            <button
              key={idx}
              className={`option-btn ${sel ? "!border-2 !border-accent bg-soft" : ""}`}
              onClick={() => {
                const next = [...answers];
                next[i] = idx;
                setAnswers(next);
                if (i + 1 < items.length) setTimeout(() => setI(i + 1), 150);
              }}
            >
              <span className={`option-chip ${sel ? "!border-0 !bg-accent !text-white" : ""}`}>{LETTERS[idx]}</span>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 pb-7 pt-3">
        <button className="btn-ghost flex-1" disabled={i === 0} onClick={() => setI(i - 1)}>Back</button>
        <button className="btn-primary flex-1" disabled={i + 1 >= items.length} onClick={() => setI(i + 1)}>
          {answers[i] !== null ? "Next" : "Skip"}
        </button>
      </div>
    </div>
  );
}
