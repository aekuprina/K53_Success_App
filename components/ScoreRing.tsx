"use client";

export function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const r = 56;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 90 ? "#22a76e" : score >= 75 ? "#84cc16" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" role="img" aria-label={`Readiness score ${score} out of 100`}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="12" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ - filled}`}
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="66" textAnchor="middle" fontSize="34" fontWeight="800" fill="currentColor">
        {score}
      </text>
      <text x="70" y="88" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.6">
        / 100
      </text>
    </svg>
  );
}
