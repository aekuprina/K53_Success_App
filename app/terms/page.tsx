import Link from "next/link";
export const metadata = { title: "Terms of use" };
export default function Terms() {
  return (
    <div className="space-y-4">
      <Link href="/settings/" className="text-sm font-medium text-brand-600">← Back</Link>
      <h1 className="text-2xl font-bold">Terms of use</h1>
      <div className="card space-y-3 text-sm leading-relaxed">
        <p>K53 Success is a study aid. Passing the official learner&apos;s licence test depends on you and the testing authority — we cannot and do not guarantee the result of any government examination.</p>
        <p>The Readiness Score is a statistical estimate based on your practice, not a promise. Content is checked for accuracy against public road-traffic rules, but official sources always take precedence.</p>
        <p>All questions, explanations and illustrations are original work © K53 Success. You may not copy or resell them.</p>
        <p>Not affiliated with the Department of Transport or the Road Traffic Management Corporation (RTMC).</p>
      </div>
    </div>
  );
}
