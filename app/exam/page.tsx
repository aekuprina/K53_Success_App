"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { buildMockExam, scoreMock, ShuffledQuestion, MockOutcome } from "@/lib/quiz";
import { addMockResult, recordAnswer, useAppState } from "@/lib/store";
import { getTr } from "@/lib/i18n";
import { BLOCK_META, EXAM_MINUTES, EXAM_TOTAL } from "@/data/topics";

type Phase = "intro" | "running" | "results";

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
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setPhase((p) => p); // finish handled below via effect on 0
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase === "running" && secondsLeft === 0) finish(answers, items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase]);

  const answeredCount = useMemo(() => answers.filter((a) => a !== null).length, [answers]);

  if (phase === "intro") {
    return (
      <div className="space-y-4">
        <Link href="/" className="text-sm font-medium text-brand-600">← Home</Link>
        <h1 className="text-2xl font-bold">Mock exam — real CLLT format</h1>
        <div className="card space-y-3 text-sm leading-relaxed">
          <p>Exactly like the computerised test at the DLTC:</p>
          <ul className="space-y-1.5">
            <li>• <b>{EXAM_TOTAL} questions</b> — 64 scored + 4 unscored pilot questions</li>
            <li>• <b>{EXAM_MINUTES} minutes</b> on the clock</li>
            <li>• Rules of the road: pass {BLOCK_META.rules.pass}/{BLOCK_META.rules.examCount}</li>
            <li>• Signs &amp; markings: pass {BLOCK_META.signs.pass}/{BLOCK_META.signs.examCount}</li>
            <li>• Vehicle controls: pass {BLOCK_META.controls.pass}/{BLOCK_META.controls.examCount}</li>
            <li>• You must pass <b>every block</b> — a strong total is not enough</li>
            <li>• No feedback until the end, and you can go back to change answers</li>
          </ul>
        </div>
        <button className="btn-primary w-full text-lg" onClick={start}>Start mock exam</button>
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
      <div className="space-y-4 pb-8">
        <div className="text-center">
          <div className="text-6xl">{outcome.passed ? "🎉" : "📚"}</div>
          <h1 className="mt-2 text-3xl font-extrabold">{outcome.passed ? "You passed!" : "Not yet — keep going"}</h1>
          <p className="mt-1 text-ink-500 dark:text-slate-400">{outcome.percent}% overall</p>
        </div>
        <div className="card space-y-3">
          {blocks.map((b) => {
            const ok = b.got >= b.pass;
            return (
              <div key={b.name}>
                <div className="flex justify-between text-sm font-medium">
                  <span>{b.name}</span>
                  <span className={ok ? "text-brand-600" : "text-red-500"}>
                    {b.got}/{b.of} · need {b.pass} · {ok ? "pass" : "fail"}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-300/40 dark:bg-slate-800">
                  <div className={`h-full ${ok ? "bg-brand-500" : "bg-red-400"}`} style={{ width: `${(b.got / Math.max(b.of, 1)) * 100}%` }} />
                </div>
              </div>
            );
          })}
          <p className="text-xs text-ink-500 dark:text-slate-400">Pilot questions are not scored — same as the real test.</p>
        </div>

        {wrong.length > 0 && (
          <div className="card space-y-4">
            <h2 className="font-semibold">Review your mistakes ({wrong.length})</h2>
            {wrong.slice(0, 20).map(({ item, idx }) => (
              <div key={item.q.id} className="border-t border-ink-300/30 pt-3 text-sm first:border-0 first:pt-0 dark:border-slate-800">
                <p className="font-medium">{item.q.q}</p>
                {answers[idx] !== null && <p className="mt-1 text-red-500">Your answer: {item.options[answers[idx]!]}</p>}
                {answers[idx] === null && <p className="mt-1 text-red-500">Not answered</p>}
                <p className="text-brand-600">Correct: {item.options[item.answerIndex]}</p>
                <p className="mt-1 text-ink-500 dark:text-slate-400">{getTr(appState.lang, item.q.id)?.explain ?? item.q.explain}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button className="btn-primary" onClick={start}>Try another mock</button>
          <Link href="/mistakes/" className="btn-ghost">Practise my mistakes</Link>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    );
  }

  // running
  const item = items[i];
  const mm = Math.floor(secondsLeft / 60);
  const ss = String(secondsLeft % 60).padStart(2, "0");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">
          {i + 1} / {items.length}
        </span>
        <span className={`rounded-lg px-2 py-1 font-mono font-bold ${secondsLeft < 300 ? "bg-red-100 text-red-600 dark:bg-red-900/30" : "bg-ink-100 dark:bg-slate-800"}`}>
          {mm}:{ss}
        </span>
        <span className="text-ink-500 dark:text-slate-400">{answeredCount} answered</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink-300/40 dark:bg-slate-800">
        <div className="h-full bg-brand-500" style={{ width: `${(answeredCount / items.length) * 100}%` }} />
      </div>

      <div className="card space-y-4">
        <h2 className="text-lg font-semibold leading-snug">{item.q.q}</h2>
        <div className="space-y-2">
          {item.options.map((opt, idx) => (
            <button
              key={idx}
              className={`option-btn ${answers[i] === idx ? "!border-brand-500 !bg-brand-50 dark:!bg-brand-900/30" : ""}`}
              onClick={() => {
                const next = [...answers];
                next[i] = idx;
                setAnswers(next);
                if (i + 1 < items.length) setTimeout(() => setI(i + 1), 150);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn-ghost flex-1" disabled={i === 0} onClick={() => setI(i - 1)}>← Back</button>
        <button className="btn-ghost flex-1" disabled={i + 1 >= items.length} onClick={() => setI(i + 1)}>Skip →</button>
      </div>
      <button
        className="btn-primary w-full"
        onClick={() => {
          if (answeredCount < items.length && !window.confirm(`You have ${items.length - answeredCount} unanswered questions. Finish anyway?`)) return;
          finish(answers, items);
        }}
      >
        Finish exam
      </button>
    </div>
  );
}
