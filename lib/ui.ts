"use client";

import { useEffect, useSyncExternalStore } from "react";

// Ephemeral UI state (not persisted): whether the bottom nav is hidden,
// e.g. during a running quiz or mock exam.
let navHidden = false;
const listeners = new Set<() => void>();

export function setNavHidden(v: boolean) {
  if (navHidden !== v) {
    navHidden = v;
    listeners.forEach((l) => l());
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useNavHidden(): boolean {
  return useSyncExternalStore(subscribe, () => navHidden, () => false);
}

/** Hide the bottom nav while the calling component is mounted. */
export function useHideNav(active = true) {
  useEffect(() => {
    setNavHidden(active);
    return () => setNavHidden(false);
  }, [active]);
}
