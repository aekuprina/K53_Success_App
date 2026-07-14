import { AppState, Entitlement, todayKey } from "./store";

// Free plan: limited by volume, never by time. Pay once — no subscriptions.
export const FREE_DAILY_QUESTIONS = 15;
export const FREE_MOCKS = 1;

// Store prices per platform (final billing via RevenueCat in native builds)
export const PRICES = {
  unlock: { android: "R79", ios: "R99" },
  pass: { android: "R149", ios: "R179" },
} as const;

export function isEntitled(state: AppState): boolean {
  return state.entitlement === "unlock" || state.entitlement === "pass";
}

/** Practice questions left today on the free plan (Infinity when entitled). */
export function questionsLeftToday(state: AppState): number {
  if (isEntitled(state)) return Number.POSITIVE_INFINITY;
  if (state.usageDay !== todayKey()) return FREE_DAILY_QUESTIONS;
  return Math.max(0, FREE_DAILY_QUESTIONS - state.usageCount);
}

export function canStartMock(state: AppState): boolean {
  return isEntitled(state) || state.mocksUsed < FREE_MOCKS;
}

// Voucher codes (планка: PayFast + ваучеры). Redeemable until store billing ships.
const VOUCHERS: Record<string, Entitlement> = {
  K53FOUNDER: "pass",
  K53TEAM: "unlock",
};

export function voucherEntitlement(code: string): Entitlement | null {
  return VOUCHERS[code.trim().toUpperCase()] ?? null;
}

export function detectPlatform(): "ios" | "android" {
  if (typeof navigator !== "undefined" && /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent)) return "ios";
  return "android";
}
