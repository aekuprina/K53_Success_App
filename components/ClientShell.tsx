"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "@/lib/store";

const NAV = [
  { href: "/", label: "Home", icon: "M3 11.5 12 4l9 7.5M5.5 10v9h13v-9" },
  { href: "/practice/", label: "Practice", icon: "M4 6h16M4 12h16M4 18h10" },
  { href: "/exam/", label: "Mock exam", icon: "M7 3h10v18H7zM10 7h4" },
  { href: "/signs/", label: "Signs", icon: "M12 3l9 9-9 9-9-9z" },
  { href: "/settings/", label: "More", icon: "M12 8a4 4 0 100 8 4 4 0 000-8zM4 12h2m12 0h2M12 4v2m0 12v2" },
];

export function ClientShell({ children }: { children: React.ReactNode }) {
  const state = useAppState();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.dark);
  }, [state.dark]);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  const inQuiz = pathname?.startsWith("/exam") || pathname?.includes("/session");

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <main className="flex-1 px-4 pb-24 pt-4">{children}</main>
      {!inQuiz && (
        <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-ink-300/40 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div className="mx-auto flex max-w-lg justify-around">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href.replace(/\/$/, ""));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 text-[11px] font-medium ${
                    active ? "text-brand-600" : "text-ink-500 dark:text-slate-400"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
