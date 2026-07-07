#!/usr/bin/env node
/**
 * Question bank validator for K53 Success App.
 *
 * Usage:
 *   node scripts/validate-bank.mjs             # validate the whole bank
 *   node scripts/validate-bank.mjs new.json    # validate a candidate batch (JSON array) against the bank
 *
 * Checks:
 *  - schema: id, block, topic, q, options (2-4), answer index in range, explain
 *  - unique ids, correct id prefix per block (r/s/c)
 *  - topics exist and match the block
 *  - exact and near-duplicate questions (normalized token Jaccard >= 0.75)
 *  - answer distribution & option-count report, per-topic distribution report
 *
 * Exits non-zero if any ERROR is found. Warnings don't fail the run.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const VALID_TOPICS = {
  rules: ["rules-road", "speed", "row", "overtake", "park", "signals", "law"],
  signs: ["reg", "warn", "guide", "mark", "tsig"],
  controls: ["ctrl", "pretrip"],
};
const ID_PREFIX = { rules: "r", signs: "s", controls: "c" };

// --- load existing bank by parsing the TS data files (no build needed) ---
function extractQuestions(source) {
  // Matches one-line object literals in the data files.
  const out = [];
  const re = /\{\s*id:\s*"([^"]+)",\s*block:\s*"([^"]+)",\s*topic:\s*"([^"]+)",\s*q:\s*"((?:[^"\\]|\\.)*)",\s*options:\s*\[((?:[^\]\\]|\\.)*)\],\s*answer:\s*(\d+),\s*explain:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(source))) {
    const options = [...m[5].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]);
    out.push({ id: m[1], block: m[2], topic: m[3], q: m[4], options, answer: Number(m[6]), explain: m[7] });
  }
  return out;
}

function loadBank() {
  const dir = path.join(ROOT, "data");
  const files = readdirSync(dir).filter((f) => /^questions-.*\.ts$/.test(f));
  let all = [];
  for (const f of files) {
    const qs = extractQuestions(readFileSync(path.join(dir, f), "utf8"));
    all = all.concat(qs.map((q) => ({ ...q, file: f })));
  }
  return all;
}

// --- similarity ---
const STOP = new Set("a an the is are do does did you your what when which who how must may of to in on at for and or it this that with while not no".split(" "));
function tokens(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w));
}
function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter || 1);
}

// --- validate ---
const errors = [];
const warnings = [];

const bank = loadBank();
const candidatePath = process.argv[2];
let candidates = [];
if (candidatePath) {
  candidates = JSON.parse(readFileSync(candidatePath, "utf8"));
  if (!Array.isArray(candidates)) {
    console.error("Candidate file must be a JSON array of question objects.");
    process.exit(1);
  }
}

const scope = candidatePath ? candidates : bank;
const existing = candidatePath ? bank : [];

// schema + ids
const seenIds = new Set(existing.map((q) => q.id));
for (const q of scope) {
  const where = q.id ?? "(no id)";
  if (!q.id || !q.block || !q.topic || !q.q || !q.options || q.answer === undefined || !q.explain) {
    errors.push(`${where}: missing required field (id/block/topic/q/options/answer/explain)`);
    continue;
  }
  if (!VALID_TOPICS[q.block]) errors.push(`${where}: unknown block "${q.block}"`);
  else if (!VALID_TOPICS[q.block].includes(q.topic)) errors.push(`${where}: topic "${q.topic}" not valid for block "${q.block}"`);
  if (ID_PREFIX[q.block] && !q.id.startsWith(ID_PREFIX[q.block])) errors.push(`${where}: id must start with "${ID_PREFIX[q.block]}" for block ${q.block}`);
  if (seenIds.has(q.id)) errors.push(`${where}: duplicate id`);
  seenIds.add(q.id);
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4) errors.push(`${where}: needs 2-4 options, has ${q.options?.length}`);
  else if (q.answer < 0 || q.answer >= q.options.length) errors.push(`${where}: answer index ${q.answer} out of range`);
  if (q.q.length < 15) warnings.push(`${where}: question very short`);
  if (q.explain.length < 20) warnings.push(`${where}: explanation very short`);
  if (/\bDepartment of Transport approved\b|\bofficial K53 manual says\b/i.test(q.q + q.explain)) warnings.push(`${where}: possibly references official material — must be original wording`);
}

// duplicates (within scope and against existing bank)
const pool = [...existing, ...scope];
const toks = pool.map((q) => tokens(q.q));
for (let i = 0; i < pool.length; i++) {
  for (let j = Math.max(i + 1, existing.length); j < pool.length; j++) {
    if (pool[i].id === pool[j].id) continue;
    const sim = jaccard(toks[i], toks[j]);
    if (sim >= 0.99) errors.push(`${pool[j].id}: exact duplicate of ${pool[i].id}`);
    else if (sim >= 0.75) warnings.push(`${pool[j].id}: very similar to ${pool[i].id} (jaccard ${sim.toFixed(2)}) — rephrase or replace`);
  }
}

// reports
const byTopic = {};
const byBlock = {};
for (const q of pool) {
  byTopic[q.topic] = (byTopic[q.topic] ?? 0) + 1;
  byBlock[q.block] = (byBlock[q.block] ?? 0) + 1;
}

console.log(`Bank: ${bank.length} questions${candidatePath ? ` | Candidates: ${candidates.length}` : ""}`);
console.log("Per block:", byBlock);
console.log("Per topic:", byTopic);

if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} warning(s):`);
  warnings.slice(0, 40).forEach((w) => console.log("  -", w));
  if (warnings.length > 40) console.log(`  ...and ${warnings.length - 40} more`);
}
if (errors.length) {
  console.error(`\n✗ ${errors.length} error(s):`);
  errors.slice(0, 40).forEach((e) => console.error("  -", e));
  if (errors.length > 40) console.error(`  ...and ${errors.length - 40} more`);
  process.exit(1);
}
console.log("\n✓ Validation passed");
