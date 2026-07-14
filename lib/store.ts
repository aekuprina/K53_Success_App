"use client";

import { useSyncExternalStore } from "react";

export interface QStat {
  a: number; // attempts
  c: number; // correct
  streak: number; // consecutive correct
  last: number; // last attempt timestamp
}

export interface MockResult {
  date: number;
  rules: [number, number];
  signs: [number, number];
  controls: [number, number];
  passed: boolean;
  percent: number;
}

export type Entitlement = "free" | "unlock" | "pass";

export interface AppState {
  onboarded: boolean;
  code: "1" | "8" | "10";
  examDate?: string;
  dark: boolean;
  lang: "en" | "af" | "zu" | "xh";
  /** Purchase level. Synced with the store billing (RevenueCat) in native builds. */
  entitlement: Entitlement;
  voucher?: string;
  /** Free-plan usage tracking */
  usageDay: string; // YYYY-MM-DD
  usageCount: number; // practice questions answered today
  mocksUsed: number; // completed mock exams (free plan allows 1)
  stats: Record<string, QStat>;
  /** Per-sign recognition stats from the signs drill (keyed by sign id) */
  signStats: Record<string, QStat>;
  mistakes: string[];
  bookmarks: string[];
  mocks: MockResult[];
}

const KEY = "k53.v1";

const DEFAULT_STATE: AppState = {
  onboarded: false,
  code: "8",
  dark: false,
  lang: "en",
  entitlement: "free",
  usageDay: "",
  usageCount: 0,
  mocksUsed: 0,
  stats: {},
  signStats: {},
  mistakes: [],
  bookmarks: [],
  mocks: [],
};

let state: AppState = DEFAULT_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function load(): AppState {
  if (loaded) return state;
  loaded = true;
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) state = { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } catch {
      /* corrupted storage — start fresh */
    }
  }
  return state;
}

function persist() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }
}

export function getState(): AppState {
  return load();
}

export function setState(patch: Partial<AppState>) {
  state = { ...load(), ...patch };
  persist();
  listeners.forEach((l) => l());
}

export function resetState() {
  state = { ...DEFAULT_STATE, stats: {}, mistakes: [], bookmarks: [], mocks: [] };
  persist();
  listeners.forEach((l) => l());
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function recordAnswer(qid: string, correct: boolean, opts?: { countUsage?: boolean }) {
  const s = load();
  const prev = s.stats[qid] ?? { a: 0, c: 0, streak: 0, last: 0 };
  const next: QStat = {
    a: prev.a + 1,
    c: prev.c + (correct ? 1 : 0),
    streak: correct ? prev.streak + 1 : 0,
    last: Date.now(),
  };
  let mistakes = s.mistakes;
  if (!correct && !mistakes.includes(qid)) mistakes = [...mistakes, qid];
  if (correct && next.streak >= 2 && mistakes.includes(qid)) mistakes = mistakes.filter((m) => m !== qid);

  const countUsage = opts?.countUsage !== false;
  const day = todayKey();
  const usagePatch = countUsage
    ? s.usageDay === day
      ? { usageCount: s.usageCount + 1 }
      : { usageDay: day, usageCount: 1 }
    : {};

  setState({ stats: { ...s.stats, [qid]: next }, mistakes, ...usagePatch });
}

export function setEntitlement(entitlement: Entitlement, voucher?: string) {
  setState({ entitlement, voucher });
}

export function recordSignAnswer(signId: string, correct: boolean) {
  const s = load();
  const prev = s.signStats[signId] ?? { a: 0, c: 0, streak: 0, last: 0 };
  const next: QStat = {
    a: prev.a + 1,
    c: prev.c + (correct ? 1 : 0),
    streak: correct ? prev.streak + 1 : 0,
    last: Date.now(),
  };
  setState({ signStats: { ...s.signStats, [signId]: next } });
}

export function toggleBookmark(qid: string) {
  const s = load();
  const bookmarks = s.bookmarks.includes(qid)
    ? s.bookmarks.filter((b) => b !== qid)
    : [...s.bookmarks, qid];
  setState({ bookmarks });
}

export function addMockResult(r: MockResult) {
  const s = load();
  setState({ mocks: [...s.mocks, r].slice(-20), mocksUsed: s.mocksUsed + 1 });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getState, () => DEFAULT_STATE);
}
