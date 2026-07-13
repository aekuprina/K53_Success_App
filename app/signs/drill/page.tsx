"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { buildDrill } from "@/lib/drill";
import { getState } from "@/lib/store";
import { SIGN_CATEGORIES } from "@/data/signs";
import { DrillRunner } from "@/components/DrillRunner";

function DrillInner() {
  const params = useSearchParams();
  const router = useRouter();
  const cat = params.get("cat");
  const [done, setDone] = useState<number | null>(null);
  const [runId, setRunId] = useState(0);

  const items = useMemo(() => buildDrill(getState(), cat, 10), [cat, runId]);
  const catMeta = SIGN_CATEGORIES.find((c) => c.id === cat);
  const title = `Recognition drill${catMeta ? ` · ${catMeta.name.replace(" signs", "")}` : ""}`;

  if (done !== null) {
    const pct = Math.round((done / items.length) * 100);
    return (
      <div className="flex min-h-[80vh] animate-screenIn flex-col items-center justify-center px-6 text-center">
        <div className="caps-label">{title}</div>
        <div className="mt-2 font-display text-[96px] font-bold leading-none">
          {done}<span className="text-[28px] text-accent">/{items.length}</span>
        </div>
        <h1 className="h-display mt-3 text-[26px]">{pct >= 75 ? "Sharp eyes" : "Keep drilling"}</h1>
        <p className="mt-2 max-w-[290px] text-sm font-medium text-muted">
          Signs you got right are marked as learned. Missed ones come back first next drill.
        </p>
        <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
          <button className="btn-primary text-[17px]" onClick={() => { setDone(null); setRunId((x) => x + 1); }}>
            Drill again
          </button>
          <Link href="/signs/" className="btn-ghost">Back to signs</Link>
        </div>
      </div>
    );
  }

  return <DrillRunner items={items} title={title} onDone={setDone} onExit={() => router.push("/signs/")} />;
}

export default function SignsDrill() {
  return (
    <Suspense fallback={null}>
      <DrillInner />
    </Suspense>
  );
}
