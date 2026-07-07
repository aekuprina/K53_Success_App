import { Topic } from "./types";

export const TOPICS: Topic[] = [
  // Rules of the road block (28 exam questions, pass 22)
  { id: "rules-road", block: "rules", name: "Rules of the road", weight: 5 },
  { id: "speed", block: "rules", name: "Speed limits", weight: 4 },
  { id: "row", block: "rules", name: "Right of way & intersections", weight: 5 },
  { id: "overtake", block: "rules", name: "Overtaking & lanes", weight: 4 },
  { id: "park", block: "rules", name: "Parking & stopping", weight: 4 },
  { id: "signals", block: "rules", name: "Signals & lights", weight: 3 },
  { id: "law", block: "rules", name: "Your licence & the law", weight: 3 },
  // Signs block (28 exam questions, pass 23)
  { id: "reg", block: "signs", name: "Regulatory signs", weight: 7 },
  { id: "warn", block: "signs", name: "Warning signs", weight: 7 },
  { id: "guide", block: "signs", name: "Guidance & information signs", weight: 4 },
  { id: "mark", block: "signs", name: "Road markings", weight: 6 },
  { id: "tsig", block: "signs", name: "Traffic signals", weight: 4 },
  // Vehicle controls block (8 exam questions, pass 6)
  { id: "ctrl", block: "controls", name: "Vehicle controls", weight: 5 },
  { id: "pretrip", block: "controls", name: "Pre-trip checks & safe use", weight: 3 },
];

export const BLOCK_META = {
  rules: { name: "Rules of the road", examCount: 28, pass: 22 },
  signs: { name: "Road signs & markings", examCount: 28, pass: 23 },
  controls: { name: "Vehicle controls", examCount: 8, pass: 6 },
} as const;

export const EXAM_TOTAL = 68; // 64 scored + 4 unscored pilot questions, like the real CLLT
export const EXAM_MINUTES = 60;

export function topicById(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}
