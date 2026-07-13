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
  if (!sign) return <p className="px-6 pt-4">Sign not found.</p>;
  const cat = SIGN_CATEGORIES.find((c) => c.id === sign.category);
  const related = SIGNS.filter((s) => s.category === sign.category && s.id !== sign.id).slice(0, 4);

  return (
    <div className="animate-screenIn px-6 pt-4">
      <Link href="/signs/" className="text-[15px] font-bold text-accent">← All signs</Link>

      <div className="card mt-4 flex flex-col items-center py-9 text-center shadow-[0_1px_3px_rgba(2,0,53,0.08)]">
        <SignSvg spec={sign} size={140} />
        <h1 className="h-display mt-5 text-[26px]">{sign.name}</h1>
        <div className="caps-label mt-1.5">{cat?.name}</div>
      </div>

      <div className="card mt-4">
        <div className="caps-label">What it means</div>
        <p className="mt-2 text-[15px] font-medium leading-relaxed">{sign.desc}</p>
        {cat && <p className="mt-2 text-xs font-medium leading-relaxed text-muted">{cat.blurb}</p>}
      </div>

      {related.length > 0 && (
        <div className="pt-6">
          <div className="caps-label mb-3">Related signs</div>
          <div className="grid grid-cols-2 gap-3">
            {related.map((s) => (
              <Link key={s.id} href={`/signs/${s.id}/`} className="flex flex-col items-center gap-2.5 rounded-tile bg-card p-4 text-center">
                <SignSvg spec={s} size={56} />
                <span className="text-sm font-semibold leading-tight">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link href="/practice/session/?topic=reg" className="mt-5 flex items-center gap-4 rounded-tile bg-hero px-5 py-4 text-heroink">
        <span>
          <span className="block text-lg font-bold">Think you know your signs?</span>
          <span className="mt-0.5 block text-[12.5px] font-medium text-heromut">Test yourself free — no registration</span>
        </span>
        <span className="ml-auto font-display text-[22px] font-bold text-accent">→</span>
      </Link>
    </div>
  );
}
