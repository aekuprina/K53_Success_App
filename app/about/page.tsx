import Link from "next/link";
export const metadata = { title: "About" };
export default function About() {
  return (
    <div className="animate-screenIn space-y-4 px-6 pt-4">
      <Link href="/settings/" className="text-[15px] font-bold text-accent">← Back</Link>
      <h1 className="h-display text-[26px]">About K53 Success</h1>
      <div className="card space-y-3 text-sm font-medium leading-relaxed">
        <p>K53 Success helps South Africans pass the learner&apos;s licence test first time. It is built for the new computerised test (CLLT), with plain-language explanations, a realistic mock exam and an honest Readiness Score.</p>
        <p>All questions and illustrations are our own original work. We are <b>not affiliated with the Department of Transport, the RTMC, or any DLTC</b>. This app prepares you for the official test — it does not replace official study material.</p>
        <p>After your real exam, tell us which topics came up. Every report makes the question bank more accurate for the next learner.</p>
      </div>
    </div>
  );
}
