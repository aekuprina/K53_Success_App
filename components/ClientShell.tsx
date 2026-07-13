"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "@/lib/store";
import { useNavHidden } from "@/lib/ui";

// Icons from the Ultramarine prototype (21px, stroke 1.9)
const NAV = [
  { href: "/", label: "Home", icon: <><path d="M3 10.5 12 4l9 6.5" /><path d="M5.5 9.5V20h13V9.5" /></> },
  { href: "/practice/", label: "Practice", icon: <path d="M4 7h16M4 12h16M4 17h16" /> },
  { href: "/exam/", label: "Mock exam", icon: <rect x="6" y="3" width="12" height="18" rx="2.5" /> },
  { href: "/signs/", label: "Signs", icon: <rect x="12" y="3" width="12.7" height="12.7" rx="2" transform="rotate(45 12 3)" /> },
  { href: "/settings/", label: "More", icon: <><circle cx="12" cy="12" r="3.4" /><path d="M12 3.5v3.4M12 17.1V20.5M3.5 12h3.4M17.1 12H20.5" /></> },
];

export function ClientShell({ children }: { children: React.ReactNode }) {
  const state = useAppState();
  const pathname = usePathname();
  const navHidden = useNavHidden();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.dark);
  }, [state.dark]);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <main className={`flex-1 ${navHidden ? "pb-6" : "pb-28"}`}>{children}</main>
      {!navHidden && (
        <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-ground">
          <div className="mx-auto flex max-w-lg px-3 pb-5 pt-3">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href.replace(/\/$/, ""));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-1 flex-col items-center gap-[5px] text-[9.5px] font-bold tracking-[0.04em] ${
                    active ? "text-accent" : "text-muted"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon}
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
