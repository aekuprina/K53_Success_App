import Link from "next/link";
import { Metadata } from "next";
import { SIGNS, signById, SIGN_CATEGORIES } from "@/data/signs";
import { SignSvg } from "@/components/SignSvg";

// SEO: one static page per sign (§3.5 of the product bar)
export function generateStaticParams() {
  return SIGNS.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const sign = signById(params.id);
  if (!sign) return {};
  return {
    title: `${sign.name} — K53 road sign meaning`,
    description: `${sign.name}: ${sign.desc} Learn all K53 road signs for the South African learner's licence test.`,
  };
}

export default function SignPage({ params }: { params: { id: string } }) {
  const sign = signById(params.id);
  if (!sign) return <p>Sign not found.</p>;
  const cat = SIGN_CATEGORIES.find((c) => c.id === sign.category);
  const related = SIGNS.filter((s) => s.category === sign.category && s.id !== sign.id).slice(0, 4);

  return (
    <div className="space-y-4">
      <Link href="/signs/" className="text-sm font-medium text-brand-600">← All signs</Link>
      <div className="card flex flex-col items-center gap-4 py-8 text-center">
        <SignSvg spec={sign} size={140} />
        <div>
          <h1 className="text-2xl font-bold">{sign.name}</h1>
          <p className="text-sm text-ink-500 dark:text-slate-400">{cat?.name}</p>
        </div>
      </div>
      <div className="card space-y-2">
        <h2 className="font-semibold">What it means</h2>
        <p className="text-sm leading-relaxed">{sign.desc}</p>
        {cat && <p className="text-xs text-ink-500 dark:text-slate-400">{cat.blurb}</p>}
      </div>
      {related.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500 dark:text-slate-400">Related signs</h2>
          <div className="grid grid-cols-2 gap-3">
            {related.map((s) => (
              <Link key={s.id} href={`/signs/${s.id}/`} className="card flex flex-col items-center gap-2 text-center">
                <SignSvg spec={s} size={56} />
                <span className="text-sm font-semibold leading-tight">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="card text-center text-sm">
        <p className="font-semibold">Think you know your signs?</p>
        <Link href="/practice/session/?topic=reg" className="btn-primary mt-2 w-full">Test yourself free →</Link>
      </div>
    </div>
  );
}
