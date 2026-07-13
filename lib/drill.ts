import { SIGNS, SignSpec } from "@/data/signs";
import { AppState } from "./store";

/** A sign counts as "learned" when its last recognition answer was correct. */
export function isLearned(state: AppState, signId: string): boolean {
  const st = state.signStats[signId];
  return !!st && st.streak >= 1;
}

export interface CategoryProgress {
  id: string;
  total: number;
  learned: number;
}

export function categoryProgress(state: AppState, catId: string): CategoryProgress {
  const signs = SIGNS.filter((s) => s.category === catId);
  const learned = signs.filter((s) => isLearned(state, s.id)).length;
  return { id: catId, total: signs.length, learned };
}

export function overallProgress(state: AppState): { total: number; learned: number } {
  const learned = SIGNS.filter((s) => isLearned(state, s.id)).length;
  return { total: SIGNS.length, learned };
}

export interface DrillItem {
  sign: SignSpec;
  options: string[]; // sign descriptions
  answerIndex: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Recognition drill: show the sign, pick its meaning.
 * Unlearned and shaky signs come first; distractors are drawn
 * from the same category so they're plausible.
 */
export function buildDrill(state: AppState, catId: string | null, count = 10): DrillItem[] {
  const pool = catId ? SIGNS.filter((s) => s.category === catId) : SIGNS;

  const ranked = shuffle(pool)
    .map((sign) => {
      const st = state.signStats[sign.id];
      const seen = st ? st.a : 0;
      const streak = st ? st.streak : 0;
      return { sign, key: (streak >= 1 ? 2 : 0) + Math.min(seen, 3) * 0.2 };
    })
    .sort((a, b) => a.key - b.key)
    .slice(0, count)
    .map((x) => x.sign);

  return ranked.map((sign) => {
    const sameCat = SIGNS.filter((s) => s.category === sign.category && s.id !== sign.id);
    const others = SIGNS.filter((s) => s.category !== sign.category);
    const distractors = shuffle(sameCat.length >= 2 ? sameCat : [...sameCat, ...others])
      .filter((s) => s.desc !== sign.desc)
      .slice(0, 2)
      .map((s) => s.desc);
    const options = shuffle([sign.desc, ...distractors]);
    return { sign, options, answerIndex: options.indexOf(sign.desc) };
  });
}
