"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setState, useAppState } from "@/lib/store";
import { LANGS } from "@/lib/i18n";

const CODES = [
  { id: "1", name: "Code 1", desc: "Motorcycles" },
  { id: "8", name: "Code 8", desc: "Light motor vehicles (cars)" },
  { id: "10", name: "Code 10", desc: "Heavy motor vehicles" },
] as const;

export default function Welcome() {
  const router = useRouter();
  const state = useAppState();
  const [code, setCode] = useState<"1" | "8" | "10">("8");
  const [examDate, setExamDate] = useState("");

  function start() {
    setState({ onboarded: true, code, examDate: examDate || undefined });
    router.replace("/");
  }

  return (
    <div className="animate-screenIn">
      {/* Hero */}
      <div className="rounded-b-hero bg-hero px-6 pb-8 pt-5 text-heroink">
        <span className="text-[13px] font-extrabold tracking-[0.18em]">K53 SUCCESS</span>
        <h1 className="h-display mt-6 text-[44px] leading-[0.95]">
          Pass your K53<br />
          <span className="text-accent">first time</span>
        </h1>
        <p className="mt-4 max-w-[300px] text-[15px] font-medium leading-relaxed text-heromut">
          Built for South Africa&apos;s new computerised test. No registration, works offline.
        </p>
      </div>

      <div className="px-6">
        <div className="pt-7">
          <div className="caps-label mb-2.5">Explanations in your language</div>
          <div className="flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => setState({ lang: l.id })}
                className={`rounded-full px-3.5 py-2 text-[13px] font-bold ${
                  state.lang === l.id ? "bg-ink text-ground" : "border-[1.5px] border-line text-muted"
                }`}
              >
                {l.native}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs font-medium text-muted">Questions stay in English, like the real test.</p>
        </div>

        <div className="pt-6">
          <div className="caps-label mb-2.5">Which licence are you going for?</div>
          <div className="space-y-2.5">
            {CODES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCode(c.id)}
                className={`option-btn justify-between ${code === c.id ? "!border-2 !border-accent bg-soft" : ""}`}
              >
                <span className="font-bold">{c.name}</span>
                <span className="text-sm font-medium text-muted">{c.desc}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs font-medium text-muted">Question bank currently focuses on Code 8. More codes are coming.</p>
        </div>

        <div className="pt-6">
          <div className="caps-label mb-2.5">When is your test? (optional)</div>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full rounded-tile border-[1.5px] border-line bg-card px-4 py-3.5 font-medium outline-none"
          />
          <p className="mt-2 text-xs font-medium text-muted">We&apos;ll build your countdown and daily plan around it.</p>
        </div>

        <button className="btn-primary mt-7 w-full text-[17px]" onClick={start}>
          Start practising — it&apos;s free
        </button>
        <p className="pb-8 pt-4 text-center text-xs font-medium text-muted">
          Not affiliated with the Department of Transport or RTMC.
        </p>
      </div>
    </div>
  );
}
