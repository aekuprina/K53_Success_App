import { Question, Block } from "./types";
import { RULES_QUESTIONS } from "./questions-rules";
import { SIGNS_QUESTIONS } from "./questions-signs";
import { CONTROLS_QUESTIONS } from "./questions-controls";

export const BANK: Question[] = [...RULES_QUESTIONS, ...SIGNS_QUESTIONS, ...CONTROLS_QUESTIONS];

export const BANK_BY_ID = new Map(BANK.map((q) => [q.id, q]));

export function questionsByBlock(block: Block): Question[] {
  return BANK.filter((q) => q.block === block);
}

export function questionsByTopic(topic: string): Question[] {
  return BANK.filter((q) => q.topic === topic);
}
