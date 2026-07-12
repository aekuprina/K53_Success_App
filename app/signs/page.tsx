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
    <div className="animate-screenIn px-6 pt-4">
      <h1 className="h-display text-[28px]">Road signs</h1>
      <p className="mt-1 text-sm font-medium text-muted">{SIGNS.length} signs · offline · growing every release</p>

      <div className="mt-4 flex items-center gap-2.5 rounded-tile border-[1.5px] border-line bg-card px-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="flex-none text-muted"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
        <input
          type="search"
          placeholder={`Search all ${SIGNS.length} signs`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent py-3.5 font-medium outline-none placeholder:text-muted"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setCat(null)}
          className={`rounded-full px-3.5 py-2 text-xs font-bold ${cat === null ? "bg-ink text-ground" : "border-[1.5px] border-line text-muted"}`}
        >
          All
        </button>
        {SIGN_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(cat === c.id ? null : c.id)}
            className={`rounded-full px-3.5 py-2 text-xs font-bold ${cat === c.id ? "bg-ink text-ground" : "border-[1.5px] border-line text-muted"}`}
          >
            {c.name.replace(" signs", "")}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {list.map((s) => (
          <Link key={s.id} href={`/signs/${s.id}/`} className="flex flex-col items-center gap-2.5 rounded-tile bg-card p-4 text-center">
            <SignSvg spec={s} size={62} />
            <span className="text-sm font-semibold leading-tight">{s.name}</span>
          </Link>
        ))}
      </div>
      {list.length === 0 && <p className="pt-6 text-center text-sm font-medium text-muted">No signs match your search.</p>}
    </div>
  );
}
