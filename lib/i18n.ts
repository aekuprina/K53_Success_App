export type Lang = "en" | "af" | "zu" | "xh";

export interface TrEntry {
  /** Short translation of the question itself — shown as a hint under the English question */
  q?: string;
  /** Translated explanation */
  explain: string;
}

export const LANGS: { id: Lang; name: string; native: string; needsReview?: boolean }[] = [
  { id: "en", name: "English", native: "English" },
  { id: "af", name: "Afrikaans", native: "Afrikaans" },
  { id: "zu", name: "isiZulu", native: "isiZulu", needsReview: true },
  { id: "xh", name: "isiXhosa", native: "isiXhosa", needsReview: true },
];

// Questions always stay in English (the real CLLT is taken in English).
// Only hints and explanations are translated.
import { TR_AF } from "@/data/i18n/af";
import { TR_ZU } from "@/data/i18n/zu";
import { TR_XH } from "@/data/i18n/xh";

const TABLES: Partial<Record<Lang, Record<string, TrEntry>>> = {
  af: TR_AF,
  zu: TR_ZU,
  xh: TR_XH,
};

export function getTr(lang: Lang, qid: string): TrEntry | undefined {
  if (lang === "en") return undefined;
  return TABLES[lang]?.[qid];
}

export function langMeta(lang: Lang) {
  return LANGS.find((l) => l.id === lang)!;
}
