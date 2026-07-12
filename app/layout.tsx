import type { Metadata, Viewport } from "next";
import "@fontsource/archivo/latin-400.css";
import "@fontsource/archivo/latin-500.css";
import "@fontsource/archivo/latin-600.css";
import "@fontsource/archivo/latin-700.css";
import "@fontsource/archivo/latin-800.css";
import "@fontsource/oswald/latin-500.css";
import "@fontsource/oswald/latin-600.css";
import "@fontsource/oswald/latin-700.css";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://k53-success-app.vercel.app"),
  title: {
    default: "K53 Success — Pass your learner's licence first time",
    template: "%s · K53 Success",
  },
  description:
    "Free K53 learner's licence practice for South Africa, built for the new computerised test (CLLT). Mock exams, road signs, and an honest Readiness Score. No registration needed.",
  manifest: "/manifest.json",
  keywords: ["K53", "learners licence", "learner's license test", "South Africa", "CLLT", "K53 test 2026", "road signs"],
  openGraph: {
    title: "K53 Success — Pass your learner's licence first time",
    description: "Practice for the new computerised K53 test. Mock exams, signs, Readiness Score.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#020035",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(JSON.parse(localStorage.getItem('k53.v1')||'{}').dark)document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
