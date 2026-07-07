import { Question, Block } from "@/data/types";
import { BANK, questionsByBlock } from "@/data/bank";
import { BLOCK_META, EXAM_TOTAL } from "@/data/topics";
import { AppState } from "./store";

// Deterministic PRNG so option order is stable within an attempt
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface ShuffledQuestion {
  q: Question;
  options: string[];
  answerIndex: number;
  pilot?: boolean; // unscored pilot question in mock exam
}

export function shuffleOptions(q: Question, salt: number): ShuffledQuestion {
  const rnd = mulberry32(hash(q.id) ^ salt);
  const idx = q.options.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return {
    q,
    options: idx.map((i) => q.options[i]),
    answerIndex: idx.indexOf(q.answer),
  };
}

function shuffleArray<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Practice session: prioritise weak & unseen questions in a topic */
export function buildPracticeSession(topic: string, state: AppState, count = 12): ShuffledQuestion[] {
  const pool = BANK.filter((q) => q.topic === topic);
  const scored = pool
    .map((q) => {
      const st = state.stats[q.id];
      const acc = st && st.a > 0 ? st.c / st.a : -1; // unseen first
      const streak = st?.streak ?? 0;
      return { q, key: acc + streak * 0.2 + Math.random() * 0.15 };
    })
    .sort((a, b) => a.key - b.key)
    .slice(0, count);
  const salt = Date.now() & 0xffff;
  return scored.map(({ q }) => shuffleOptions(q, salt));
}

/** Smart mistakes session */
export function buildMistakesSession(state: AppState, count = 15): ShuffledQuestion[] {
  const ids = [...state.mistakes];
  const salt = Date.now() & 0xffff;
  return ids
    .slice(0, count)
    .map((id) => BANK.find((q) => q.id === id))
    .filter((q): q is Question => Boolean(q))
    .map((q) => shuffleOptions(q, salt));
}

/** Full CLLT-style mock exam: 64 scored (28/28/8) + 4 unscored pilot = 68 */
export function buildMockExam(): ShuffledQuestion[] {
  const salt = Date.now() & 0xffff;
  const rnd = mulberry32(salt ^ 0x5eed);
  const pick = (block: Block, n: number) => shuffleArray(questionsByBlock(block), rnd).slice(0, n);

  const rules = pick("rules", Math.min(BLOCK_META.rules.examCount, questionsByBlock("rules").length));
  const signs = pick("signs", Math.min(BLOCK_META.signs.examCount, questionsByBlock("signs").length));
  const controls = pick("controls", Math.min(BLOCK_META.controls.examCount, questionsByBlock("controls").length));

  const used = new Set([...rules, ...signs, ...controls].map((q) => q.id));
  const pilotPool = shuffleArray(BANK.filter((q) => !used.has(q.id)), rnd);
  const pilots = pilotPool.slice(0, Math.max(0, EXAM_TOTAL - used.size));

  const all: ShuffledQuestion[] = [
    ...rules.map((q) => shuffleOptions(q, salt)),
    ...signs.map((q) => shuffleOptions(q, salt)),
    ...controls.map((q) => shuffleOptions(q, salt)),
    ...pilots.map((q) => ({ ...shuffleOptions(q, salt), pilot: true })),
  ];
  return shuffleArray(all, rnd);
}

export interface MockOutcome {
  rules: [number, number];
  signs: [number, number];
  controls: [number, number];
  passed: boolean;
  percent: number;
}

export function scoreMock(items: ShuffledQuestion[], answers: (number | null)[]): MockOutcome {
  const got: Record<Block, number> = { rules: 0, signs: 0, controls: 0 };
  const of: Record<Block, number> = { rules: 0, signs: 0, controls: 0 };
  items.forEach((item, i) => {
    if (item.pilot) return; // pilots don't count
    of[item.q.block]++;
    if (answers[i] === item.answerIndex) got[item.q.block]++;
  });
  const passed =
    got.rules >= Math.round((BLOCK_META.rules.pass / BLOCK_META.rules.examCount) * of.rules) &&
    got.signs >= Math.round((BLOCK_META.signs.pass / BLOCK_META.signs.examCount) * of.signs) &&
    got.controls >= Math.round((BLOCK_META.controls.pass / BLOCK_META.controls.examCount) * of.controls);
  const totalGot = got.rules + got.signs + got.controls;
  const totalOf = of.rules + of.signs + of.controls;
  return {
    rules: [got.rules, of.rules],
    signs: [got.signs, of.signs],
    controls: [got.controls, of.controls],
    passed,
    percent: totalOf ? Math.round((totalGot / totalOf) * 100) : 0,
  };
}
