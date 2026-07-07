import { BANK } from "@/data/bank";
import { TOPICS } from "@/data/topics";
import { Topic } from "@/data/types";
import { AppState } from "./store";

export interface TopicMastery {
  topic: Topic;
  mastery: number; // 0..1
  attempted: number;
  total: number;
}

export interface Readiness {
  score: number; // 0..100 calibrated pass-probability estimate
  coverage: number; // 0..1
  accuracy: number; // 0..1
  recency: number; // 0..1
  mockFactor: number; // 0..1
  topics: TopicMastery[];
  danger: TopicMastery[]; // top-3 topics most likely to fail you
}

const DAY = 86400000;

function qMastery(state: AppState, qid: string): number {
  const st = state.stats[qid];
  if (!st || st.a === 0) return 0;
  const acc = st.c / st.a;
  const stability = Math.min(1, st.streak / 2);
  const days = (Date.now() - st.last) / DAY;
  const recency = Math.exp(-days / 21); // fades over ~3 weeks
  return (0.55 * acc + 0.45 * stability) * (0.5 + 0.5 * recency);
}

export function computeReadiness(state: AppState): Readiness {
  const topics: TopicMastery[] = TOPICS.map((topic) => {
    const qs = BANK.filter((q) => q.topic === topic.id);
    const attempted = qs.filter((q) => (state.stats[q.id]?.a ?? 0) > 0).length;
    const mastery = qs.length ? qs.reduce((sum, q) => sum + qMastery(state, q.id), 0) / qs.length : 0;
    return { topic, mastery, attempted, total: qs.length };
  });

  const weightSum = topics.reduce((s, t) => s + t.topic.weight, 0);
  const weightedMastery = topics.reduce((s, t) => s + t.mastery * t.topic.weight, 0) / (weightSum || 1);

  const attemptedAll = BANK.filter((q) => (state.stats[q.id]?.a ?? 0) > 0).length;
  const coverage = BANK.length ? attemptedAll / BANK.length : 0;

  const attemptsTotal = Object.values(state.stats).reduce((s, st) => s + st.a, 0);
  const correctTotal = Object.values(state.stats).reduce((s, st) => s + st.c, 0);
  const accuracy = attemptsTotal ? correctTotal / attemptsTotal : 0;

  const lastPractice = Object.values(state.stats).reduce((m, st) => Math.max(m, st.last), 0);
  const recency = lastPractice ? Math.exp(-((Date.now() - lastPractice) / DAY) / 7) : 0;

  const recentMocks = state.mocks.slice(-3);
  const mockFactor = recentMocks.length
    ? recentMocks.reduce((s, m) => s + (m.passed ? 1 : m.percent / 100) , 0) / recentMocks.length
    : 0;

  // Calibrated blend. Without a mock exam the score is capped:
  // a real pass prediction needs at least one full mock.
  let score01 =
    0.42 * weightedMastery +
    0.18 * coverage +
    0.12 * accuracy +
    0.08 * recency +
    0.2 * mockFactor;
  if (recentMocks.length === 0) score01 = Math.min(score01, 0.65);

  const danger = [...topics]
    .filter((t) => t.total > 0)
    .sort((a, b) => a.mastery * a.topic.weight - b.mastery * b.topic.weight || a.mastery - b.mastery)
    .slice(0, 3);

  return {
    score: Math.round(score01 * 100),
    coverage,
    accuracy,
    recency,
    mockFactor,
    topics,
    danger,
  };
}

export function readinessLabel(score: number): { label: string; advice: string } {
  if (score >= 90) return { label: "Ready to pass", advice: "Keep your streak until exam day. One mock per day keeps you sharp." };
  if (score >= 75) return { label: "Almost there", advice: "Close your 3 danger topics below, then do a full mock exam." };
  if (score >= 50) return { label: "Getting there", advice: "Practise your weak topics daily and take a full mock exam." };
  if (score >= 25) return { label: "Keep practising", advice: "Work through each topic, then retry your mistakes." };
  return { label: "Just started", advice: "Begin with topic practice. Small daily sessions beat one long cram." };
}
