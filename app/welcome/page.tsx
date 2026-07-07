"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setState } from "@/lib/store";

const CODES = [
  { id: "1", name: "Code 1", desc: "Motorcycles" },
  { id: "8", name: "Code 8", desc: "Light motor vehicles (cars)" },
  { id: "10", name: "Code 10", desc: "Heavy motor vehicles" },
] as const;

export default function Welcome() {
  const router = useRouter();
  const [code, setCode] = useState<"1" | "8" | "10">("8");
  const [examDate, setExamDate] = useState("");

  function start() {
    setState({ onboarded: true, code, examDate: examDate || undefined });
    router.replace("/");
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-3xl">✅</div>
        <h1 className="text-3xl font-extrabold">Pass your K53 first time</h1>
        <p className="mt-2 text-ink-500 dark:text-slate-400">
          Built for South Africa&apos;s new computerised test. No registration, works offline.
        </p>
      </div>

      <div className="card space-y-3">
        <h2 className="font-semibold">Which licence are you going for?</h2>
        <div className="space-y-2">
          {CODES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCode(c.id)}
              className={`option-btn flex justify-between ${code === c.id ? "!border-brand-500 !bg-brand-50 dark:!bg-brand-900/30" : ""}`}
            >
              <span>{c.name}</span>
              <span className="text-sm text-ink-500 dark:text-slate-400">{c.desc}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-500 dark:text-slate-400">Question bank currently focuses on Code 8. More codes are coming.</p>
      </div>

      <div className="card space-y-2">
        <h2 className="font-semibold">When is your test? (optional)</h2>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="w-full rounded-xl border-2 border-ink-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
        />
        <p className="text-xs text-ink-500 dark:text-slate-400">We&apos;ll build your countdown and daily plan around it.</p>
      </div>

      <button className="btn-primary w-full text-lg" onClick={start}>
        Start practising — it&apos;s free
      </button>
      <p className="text-center text-xs text-ink-500 dark:text-slate-400">
        Not affiliated with the Department of Transport or RTMC.
      </p>
    </div>
  );
}
