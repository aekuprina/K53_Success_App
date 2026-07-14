"use client";

import Link from "next/link";
import { useAppState, setState, resetState } from "@/lib/store";
import { LANGS } from "@/lib/i18n";
import { isEntitled } from "@/lib/premium";

export default function Settings() {
  const state = useAppState();
  const entitled = isEntitled(state);

  return (
    <div className="animate-screenIn px-6 pt-4">
      <h1 className="h-display text-[26px]">Settings</h1>

      {/* Plan */}
      <div className="card mt-4 flex items-center justify-between">
        <div>
          <div className="caps-label">Your plan</div>
          <div className="mt-1 text-lg font-bold">
            {state.entitlement === "pass" ? "Pass Pack" : state.entitlement === "unlock" ? "Unlock" : "Free"}
          </div>
          {!entitled && <div className="text-xs font-medium text-muted">15 questions/day · 1 mock · signs free</div>}
        </div>
        {!entitled && (
          <Link href="/upgrade/" className="btn-primary !px-4 !py-2.5 text-sm">Upgrade</Link>
        )}
      </div>

      <div className="card mt-4">
        <label className="flex items-center justify-between">
          <span className="text-lg font-semibold">Dark mode</span>
          <button
            role="switch"
            aria-checked={state.dark}
            onClick={() => setState({ dark: !state.dark })}
            className={`h-7 w-12 rounded-full p-1 transition ${state.dark ? "bg-accent" : "bg-line"}`}
          >
            <span className={`block h-5 w-5 rounded-full bg-white transition ${state.dark ? "translate-x-5" : ""}`} />
          </button>
        </label>

        <div className="mt-5 border-t border-line pt-5">
          <div className="caps-label mb-2.5">Licence code</div>
          <div className="flex gap-2.5">
            {(["1", "8", "10"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setState({ code: c })}
                className={`flex-1 rounded-tile border-[1.5px] px-3 py-3 font-bold ${
                  state.code === c ? "border-2 border-accent bg-soft" : "border-line text-muted"
                }`}
              >
                Code {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <div className="caps-label mb-2.5">Exam date</div>
          <input
            type="date"
            value={state.examDate ?? ""}
            onChange={(e) => setState({ examDate: e.target.value || undefined })}
            className="w-full rounded-tile border-[1.5px] border-line bg-card px-4 py-3.5 font-medium outline-none"
          />
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <div className="caps-label mb-2.5">Explanation language</div>
          <div className="grid grid-cols-2 gap-2.5">
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => setState({ lang: l.id })}
                className={`rounded-tile border-[1.5px] px-3 py-3 font-bold ${
                  state.lang === l.id ? "border-2 border-accent bg-soft" : "border-line text-muted"
                }`}
              >
                {l.native}
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-xs font-medium leading-relaxed text-muted">
            Questions stay in English — the real test is in English. Hints and explanations switch to your language.
            {(state.lang === "zu" || state.lang === "xh") && " isiZulu/isiXhosa are community translations — tell us if something reads wrong."}
          </p>
        </div>
      </div>

      <div className="card mt-4 !py-2">
        <button
          className="block w-full border-b border-line py-4 text-left text-[17px] font-semibold"
          onClick={() => window.alert("Restore purchases becomes available in the App Store / Google Play version.")}
        >
          Restore purchases
        </button>
        <Link href="/about/" className="block border-b border-line py-4 text-[17px] font-semibold">About K53 Success</Link>
        <Link href="/privacy/" className="block border-b border-line py-4 text-[17px] font-semibold">Privacy policy (POPIA)</Link>
        <Link href="/terms/" className="block py-4 text-[17px] font-semibold">Terms of use</Link>
      </div>

      <div className="card mt-4">
        <button
          className="text-lg font-bold text-bad"
          onClick={() => {
            if (window.confirm("Delete all your progress on this device? This cannot be undone.")) resetState();
          }}
        >
          Reset all progress
        </button>
        <p className="mt-2 text-[13px] font-medium leading-relaxed text-muted">
          All data lives on your device only. Resetting deletes it permanently.
        </p>
      </div>

      <p className="px-2 pb-2 pt-5 text-center text-[12.5px] font-medium text-muted">
        v0.1.0 · Not affiliated with the Department of Transport or RTMC
      </p>
    </div>
  );
}
