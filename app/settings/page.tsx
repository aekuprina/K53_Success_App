"use client";

import Link from "next/link";
import { useAppState, setState, resetState } from "@/lib/store";

export default function Settings() {
  const state = useAppState();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>

      <div className="card space-y-4">
        <label className="flex items-center justify-between">
          <span className="font-medium">Dark mode</span>
          <button
            role="switch"
            aria-checked={state.dark}
            onClick={() => setState({ dark: !state.dark })}
            className={`h-7 w-12 rounded-full p-1 transition ${state.dark ? "bg-brand-600" : "bg-ink-300"}`}
          >
            <span className={`block h-5 w-5 rounded-full bg-white transition ${state.dark ? "translate-x-5" : ""}`} />
          </button>
        </label>

        <div>
          <label className="mb-1 block font-medium">Licence code</label>
          <div className="flex gap-2">
            {(["1", "8", "10"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setState({ code: c })}
                className={`flex-1 rounded-xl border-2 px-3 py-2 font-semibold ${
                  state.code === c ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30" : "border-ink-300 dark:border-slate-700"
                }`}
              >
                Code {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block font-medium">Exam date</label>
          <input
            type="date"
            value={state.examDate ?? ""}
            onChange={(e) => setState({ examDate: e.target.value || undefined })}
            className="w-full rounded-xl border-2 border-ink-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Language</label>
          <select disabled className="w-full rounded-xl border-2 border-ink-300 bg-white px-4 py-3 opacity-60 dark:border-slate-700 dark:bg-slate-900">
            <option>English (Afrikaans, isiZulu &amp; isiXhosa coming soon)</option>
          </select>
        </div>
      </div>

      <div className="card space-y-2 text-sm">
        <Link href="/about/" className="block py-1.5 font-medium">About K53 Success</Link>
        <Link href="/privacy/" className="block py-1.5 font-medium">Privacy policy (POPIA)</Link>
        <Link href="/terms/" className="block py-1.5 font-medium">Terms of use</Link>
      </div>

      <div className="card">
        <button
          className="w-full text-left font-medium text-red-500"
          onClick={() => {
            if (window.confirm("Delete all your progress on this device? This cannot be undone.")) resetState();
          }}
        >
          Reset all progress
        </button>
        <p className="mt-1 text-xs text-ink-500 dark:text-slate-400">
          All data lives on your device only. Resetting deletes it permanently.
        </p>
      </div>

      <p className="text-center text-xs text-ink-500 dark:text-slate-400">
        v0.1.0 · Not affiliated with the Department of Transport or RTMC
      </p>
    </div>
  );
}
