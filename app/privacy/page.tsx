import Link from "next/link";
export const metadata = { title: "Privacy policy" };
export default function Privacy() {
  return (
    <div className="space-y-4">
      <Link href="/settings/" className="text-sm font-medium text-brand-600">← Back</Link>
      <h1 className="text-2xl font-bold">Privacy policy</h1>
      <div className="card space-y-3 text-sm leading-relaxed">
        <p><b>Short version: your data stays on your device.</b></p>
        <p>K53 Success works without registration. Your practice history, mistakes, bookmarks, exam date and settings are stored only in your browser or on your phone. We do not collect, transmit or sell personal information.</p>
        <p><b>POPIA.</b> We follow the Protection of Personal Information Act: we process the minimum information needed to run the app, and none of it leaves your device. You can delete everything at any time via Settings → Reset all progress.</p>
        <p><b>Users under 18.</b> The app is suitable for learners from age 16. Because no personal information is collected, no parental consent flow is required.</p>
        <p><b>Changes.</b> If a future version adds accounts or analytics, this policy will be updated first, and any new processing will be opt-in.</p>
        <p>Questions? Contact: privacy@k53success.co.za</p>
      </div>
    </div>
  );
}
