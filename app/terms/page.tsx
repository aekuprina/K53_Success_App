import Link from "next/link";
export const metadata = { title: "Terms of use" };
export default function Terms() {
  return (
    <div className="animate-screenIn space-y-4 px-6 pt-4">
      <Link href="/settings/" className="text-[15px] font-bold text-accent">← Back</Link>
      <h1 className="h-display text-[26px]">Terms of use</h1>
      <div className="card space-y-3 text-sm font-medium leading-relaxed">
        <p>K53 Success is a study aid. Passing the official learner&apos;s licence test depends on you and the testing authority — we cannot and do not guarantee the result of any government examination.</p>
        <p>The Readiness Score is a statistical estimate based on your practice, not a promise. Content is checked for accuracy against public road-traffic rules, but official sources always take precedence.</p>
        <p>All questions, explanations and illustrations are original work © K53 Success. You may not copy or resell them.</p>
        <p>Not affiliated with the Department of Transport or the Road Traffic Management Corporation (RTMC).</p>
      </div>
    </div>
  );
}
