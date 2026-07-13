"use client";

import Link from "next/link";
import { SIGNS, SIGN_CATEGORIES } from "@/data/signs";
import { SignSvg } from "@/components/SignSvg";
import { useAppState } from "@/lib/store";
import { isLearned } from "@/lib/drill";

export function CategoryGrid({ catId }: { catId: string }) {
  const state = useAppState();
  const cat = SIGN_CATEGORIES.find((c) => c.id === catId);
  if (!cat) return <p className="px-6 pt-4">Category not found.</p>;

  const signs = SIGNS.filter((s) => s.category === catId);
  const learned = signs.filter((s) => isLearned(state, s.id)).length;

  return (
    <div className="animate-screenIn px-6 pt-4">
      <Link href="/signs/" className="text-[15px] font-bold text-accent">← All signs</Link>
      <h1 className="h-display mt-2 text-[28px]">{cat.name}</h1>
      <p className="mt-1 text-sm font-medium text-muted">
        {signs.length} signs · {learned} learned
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {signs.map((s) => {
          const done = isLearned(state, s.id);
          return (
            <Link key={s.id} href={`/signs/${s.id}/`} className="relative flex flex-col items-center gap-2.5 rounded-tile bg-card p-4 text-center">
              {done && (
                <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-ok" aria-label="Learned">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5 10 17.5 19 7" />
                  </svg>
                </span>
              )}
              <SignSvg spec={s} size={62} />
              <span className="text-sm font-semibold leading-tight">{s.name}</span>
            </Link>
          );
        })}
      </div>

      <Link href={`/signs/drill/?cat=${catId}`} className="mt-5 flex items-center gap-4 rounded-tile bg-hero px-5 py-4 text-heroink">
        <span>
          <span className="block text-lg font-bold">Drill these {signs.length} signs</span>
          <span className="mt-0.5 block text-[12.5px] font-medium text-heromut">Missed ones come back first</span>
        </span>
        <span className="ml-auto font-display text-[22px] font-bold text-accent">→</span>
      </Link>
    </div>
  );
}
