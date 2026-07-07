export type Block = "rules" | "signs" | "controls";

export interface Question {
  id: string;
  block: Block;
  topic: string;
  q: string;
  options: string[];
  answer: number; // index into options
  explain: string;
  rule?: string; // reference to rule / section
}

export interface Topic {
  id: string;
  block: Block;
  name: string;
  weight: number; // CLLT-calibrated topic weight inside its block
}
