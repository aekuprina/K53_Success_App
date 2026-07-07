"use client";

import { useState } from "react";
import Link from "next/link";
import { SIGNS, SIGN_CATEGORIES } from "@/data/signs";
import { SignSvg } from "@/components/SignSvg";

export default function SignsLibrary() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const list = SIGNS.filter((s) => {
    if (cat && s.category !== cat) return false;
    if (query && !(s.name + " " + s.desc).toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Road signs</h1>
        <p className="text-sm text-ink-500 dark:text-slate-400">{SIGNS.length} signs, offline, growing every release.</p>
      </header>

      <input
        type="search"
        placeholder="Search signs… e.g. yield, speed, animals"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl border-2 border-ink-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCat(null)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${cat === null ? "bg-brand-600 text-white" : "bg-ink-100 dark:bg-slate-800"}`}
        >
          All
        </button>
        {SIGN_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(cat === c.id ? null : c.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${cat === c.id ? "bg-brand-600 text-white" : "bg-ink-100 dark:bg-slate-800"}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {list.map((s) => (
          <Link key={s.id} href={`/signs/${s.id}/`} className="card flex flex-col items-center gap-2 text-center">
            <SignSvg spec={s} size={64} />
            <span className="text-sm font-semibold leading-tight">{s.name}</span>
          </Link>
        ))}
      </div>
      {list.length === 0 && <p className="text-center text-sm text-ink-500 dark:text-slate-400">No signs match your search.</p>}
    </div>
  );
}
