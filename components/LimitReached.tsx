"use client";

import Link from "next/link";
import { FREE_DAILY_QUESTIONS } from "@/lib/premium";

/** Shown when the free daily practice limit is used up. */
export function LimitReached() {
  return (
    <div className="flex min-h-[80vh] animate-screenIn flex-col items-center justify-center px-6 text-center">
      <div className="caps-label">Free plan</div>
      <div className="mt-2 font-display text-[96px] font-bold leading-none">
        {FREE_DAILY_QUESTIONS}<span className="text-[28px] text-accent">/{FREE_DAILY_QUESTIONS}</span>
      </div>
      <h1 className="h-display mt-3 text-[26px]">That&apos;s today&apos;s free questions</h1>
      <p className="mt-2 max-w-[300px] text-sm font-medium leading-relaxed text-muted">
        Nice work — you used all {FREE_DAILY_QUESTIONS}. They reset at midnight. Or unlock everything once and never stop mid-streak again.
      </p>
      <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
        <Link href="/upgrade/?reason=daily" className="btn-primary text-[17px]">See unlock options</Link>
        <Link href="/signs/" className="btn-ghost">Drill signs — always free</Link>
        <Link href="/" className="btn-ghost">Home</Link>
      </div>
    </div>
  );
}
