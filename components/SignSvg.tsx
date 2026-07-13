import React from "react";
import { SignSpec } from "@/data/signs";

const RED = "#c8102e";
const BLUE = "#00539f";
const GREEN = "#007749";
const YELLOW = "#f5c400";
const INK = "#1a1a1a";
const FONT = "Archivo, 'Helvetica Neue', Arial, sans-serif";

function Glyph({ id, color }: { id: string; color: string }) {
  const c = color;
  switch (id) {
    case "arrow-up":
      return <path d="M50 22 L64 46 L55 46 L55 78 L45 78 L45 46 L36 46 Z" fill={c} />;
    case "arrow-left":
      return <path d="M22 50 L46 36 L46 45 L78 45 L78 55 L46 55 L46 64 Z" fill={c} />;
    case "arrow-right":
      return <path d="M78 50 L54 36 L54 45 L22 45 L22 55 L54 55 L54 64 Z" fill={c} />;
    case "arrow-turn-left":
      return <path d="M62 78 L62 48 Q62 40 54 40 L44 40 L44 50 L28 38 L44 26 L44 34 L56 34 Q72 34 72 48 L72 78 Z" fill={c} />;
    case "curve-right":
      return <path d="M40 78 Q40 56 56 46 Q66 40 66 26 L56 26 Q56 34 48 39 Q30 50 30 78 Z" fill={c} />;
    case "curve-left":
      return <path d="M60 78 Q60 56 44 46 Q34 40 34 26 L44 26 Q44 34 52 39 Q70 50 70 78 Z" fill={c} />;
    case "hairpin":
      return <path d="M38 78 L38 44 Q38 30 50 30 Q62 30 62 44 L62 58 L70 58 L56 74 L44 58 L52 58 L52 44 Q52 40 50 40 Q48 40 48 44 L48 78 Z" fill={c} />;
    case "crossroad":
      return <path d="M45 22 L55 22 L55 45 L78 45 L78 55 L55 55 L55 78 L45 78 L45 55 L22 55 L22 45 L45 45 Z" fill={c} />;
    case "t-junction":
      return <path d="M24 26 L76 26 L76 40 L58 40 L58 78 L42 78 L42 40 L24 40 Z" fill={c} />;
    case "narrow":
      return <><path d="M32 22 Q40 50 32 78 L40 78 Q48 50 40 22 Z" fill={c} /><path d="M68 22 Q60 50 68 78 L60 78 Q52 50 60 22 Z" fill={c} /></>;
    case "person":
      return <><circle cx="50" cy="28" r="7" fill={c} /><path d="M46 38 L54 38 L58 56 L52 56 L56 76 L49 76 L47 60 L44 76 L38 74 L44 54 L42 56 Z" fill={c} /></>;
    case "children":
      return <><circle cx="38" cy="30" r="6" fill={c} /><path d="M34 38 L42 38 L46 56 L40 56 L42 74 L36 74 L35 60 L32 74 L27 72 L32 52 Z" fill={c} /><circle cx="62" cy="34" r="5" fill={c} /><path d="M59 41 L66 41 L69 56 L64 56 L66 74 L61 74 L60 62 L57 74 L52 72 L57 54 Z" fill={c} /></>;
    case "animal":
      return <path d="M24 60 L30 46 L38 44 L40 36 L46 40 L64 40 L72 34 L74 44 L68 48 L68 62 L62 62 L60 52 L44 52 L42 62 L36 62 L34 52 L30 60 Z" fill={c} />;
    case "car":
      return <path d="M24 58 L28 46 Q30 40 38 40 L62 40 Q70 40 72 46 L76 58 L76 64 L68 64 A6 6 0 0 1 56 64 L44 64 A6 6 0 0 1 32 64 L24 64 Z" fill={c} />;
    case "truck":
      return <path d="M22 40 L58 40 L58 62 L22 62 Z M58 48 L70 48 L76 56 L76 62 L58 62 Z" fill={c} />;
    case "bicycle":
      return <><circle cx="34" cy="62" r="10" fill="none" stroke={c} strokeWidth="4" /><circle cx="66" cy="62" r="10" fill="none" stroke={c} strokeWidth="4" /><path d="M34 62 L46 42 L60 42 L66 62 M46 42 L54 62 L34 62" fill="none" stroke={c} strokeWidth="4" /></>;
    case "traffic-light":
      return <><rect x="40" y="24" width="20" height="48" rx="4" fill={c} /><circle cx="50" cy="34" r="5" fill="#fff" /><circle cx="50" cy="48" r="5" fill="#fff" /><circle cx="50" cy="62" r="5" fill="#fff" /></>;
    case "railway":
      return <><path d="M28 28 L72 72 M72 28 L28 72" stroke={c} strokeWidth="9" strokeLinecap="round" /></>;
    case "ped-crossing":
      return <><path d="M26 70 L74 70 M26 62 L74 62 M26 54 L74 54" stroke={c} strokeWidth="4" /><circle cx="50" cy="26" r="6" fill={c} /><path d="M46 34 L54 34 L57 48 L52 48 L54 62 L48 62 L47 52 L44 62 L39 60 L44 46 Z" fill={c} /></>;
    case "slippery":
      return <><path d="M30 40 Q36 34 44 38 L62 34 Q70 32 72 40 L66 44 Q60 40 52 44 L38 48 Q30 48 30 40 Z" fill={c} /><path d="M30 62 Q38 56 46 62 M52 68 Q60 62 68 68" stroke={c} strokeWidth="4" fill="none" /></>;
    case "hill":
      return <><path d="M22 70 L50 40 L78 70 Z" fill={c} /><text fontFamily={FONT} x="50" y="66" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">10%</text></>;
    case "rocks":
      return <><path d="M30 30 L44 40 L36 48 L52 56 L44 64 L60 72 L24 72 Z" fill={c} /><circle cx="62" cy="38" r="4" fill={c} /><circle cx="68" cy="52" r="4" fill={c} /></>;
    case "hump":
      return <path d="M24 66 L36 66 Q50 46 64 66 L76 66 L76 72 L24 72 Z" fill={c} />;
    case "gravel":
      return <><circle cx="36" cy="60" r="4" fill={c} /><circle cx="50" cy="52" r="4" fill={c} /><circle cx="64" cy="60" r="4" fill={c} /><circle cx="43" cy="68" r="4" fill={c} /><circle cx="57" cy="68" r="4" fill={c} /><path d="M30 40 L70 40" stroke={c} strokeWidth="5" /></>;
    case "roadworks":
      return <><path d="M30 72 L44 40 L50 40 L64 72 Z" fill={c} /><path d="M50 40 L70 30 L72 36 L54 46 Z" fill={c} /></>;
    case "two-way":
      return <><path d="M40 26 L52 44 L45 44 L45 74 L35 74 L35 44 L28 44 Z" fill={c} /><path d="M60 74 L48 56 L55 56 L55 26 L65 26 L65 56 L72 56 Z" fill={c} /></>;
    case "roundabout":
      return <><circle cx="50" cy="50" r="16" fill="none" stroke={c} strokeWidth="7" /><path d="M50 22 L58 34 L42 34 Z" fill={c} /><path d="M26 62 L38 58 L32 72 Z" fill={c} /><path d="M74 62 L68 72 L62 58 Z" fill={c} /></>;
    case "fuel":
      return <><rect x="34" y="30" width="24" height="42" rx="3" fill={c} /><rect x="39" y="36" width="14" height="10" fill="#fff" /><path d="M58 40 L66 40 L70 48 L70 66 A4 4 0 0 1 62 66 L62 52 L58 52 Z" fill="none" stroke={c} strokeWidth="4" /></>;
    case "phone":
      return <path d="M32 30 Q50 22 68 30 L64 42 Q50 36 36 42 Z M40 46 L60 46 L64 72 L36 72 Z" fill={c} />;
    case "bed":
      return <path d="M26 62 L26 42 L32 42 L32 54 L74 54 L74 62 Z M34 44 A5 5 0 1 0 34 54 Z M40 48 L70 48 L74 54 L40 54 Z" fill={c} />;
    case "food":
      return <><path d="M40 26 L40 74 M34 26 L34 42 Q34 48 40 48 Q46 48 46 42 L46 26" stroke={c} strokeWidth="5" fill="none" /><path d="M60 26 Q54 40 60 50 L60 74 M60 26 Q66 40 60 50" stroke={c} strokeWidth="5" fill="none" /></>;
    case "info-i":
      return <text x="50" y="70" textAnchor="middle" fontSize="56" fontStyle="italic" fontWeight="700" fill={c} fontFamily="Georgia, serif">i</text>;
    case "hospital-h":
      return <text fontFamily={FONT} x="50" y="70" textAnchor="middle" fontSize="56" fontWeight="800" fill={c}>H</text>;
    case "parking-p":
      return <text fontFamily={FONT} x="50" y="70" textAnchor="middle" fontSize="56" fontWeight="800" fill={c}>P</text>;
    case "stop-s":
      return <text fontFamily={FONT} x="50" y="70" textAnchor="middle" fontSize="56" fontWeight="800" fill={c}>S</text>;
    case "exclaim":
      return <><rect x="45" y="24" width="10" height="36" rx="4" fill={c} /><circle cx="50" cy="72" r="6.5" fill={c} /></>;
    case "no-entry-bar":
      return <rect x="24" y="43" width="52" height="14" rx="2" fill="#fff" />;
    case "one-way":
      return <><rect x="24" y="40" width="52" height="20" fill={c} /><path d="M60 34 L76 50 L60 66 Z" fill={c} /></>;
    case "u-turn":
      return <path d="M38 78 L38 46 Q38 30 52 30 Q66 30 66 46 L66 56 L74 56 L61 72 L48 56 L56 56 L56 46 Q56 38 52 38 Q48 38 48 46 L48 78 Z" fill={c} />;
    case "dead-end":
      return <><rect x="44" y="34" width="12" height="44" fill={c} /><rect x="26" y="24" width="48" height="12" fill={RED} /></>;
    case "exit-3":
      return <><path d="M30 26 L42 26 L42 74 L30 74 Z" transform="skewX(-14)" fill={c} /><path d="M52 26 L64 26 L64 74 L52 74 Z" transform="skewX(-14)" fill={c} /><path d="M74 26 L86 26 L86 74 L74 74 Z" transform="skewX(-14)" fill={c} /></>;
    case "route-n1":
      return <text fontFamily={FONT} x="50" y="66" textAnchor="middle" fontSize="36" fontWeight="800" fill={c}>N1</text>;
    case "speed-60":
      return <text fontFamily={FONT} x="50" y="66" textAnchor="middle" fontSize="40" fontWeight="800" fill={INK}>60</text>;
    case "speed-100":
      return <text fontFamily={FONT} x="50" y="64" textAnchor="middle" fontSize="32" fontWeight="800" fill={INK}>100</text>;
    case "speed-120":
      return <text fontFamily={FONT} x="50" y="64" textAnchor="middle" fontSize="32" fontWeight="800" fill={INK}>120</text>;
    case "min-40":
      return <text fontFamily={FONT} x="50" y="66" textAnchor="middle" fontSize="40" fontWeight="800" fill="#fff">40</text>;
    case "height-4m":
      return <><text fontFamily={FONT} x="50" y="60" textAnchor="middle" fontSize="24" fontWeight="800" fill={INK}>4,2 m</text><path d="M30 30 L38 38 L34 38 L34 42 L26 42 L26 38 L22 38 Z" transform="translate(20 -8)" fill={INK} /></>;
    case "weight-10t":
      return <text fontFamily={FONT} x="50" y="64" textAnchor="middle" fontSize="30" fontWeight="800" fill={INK}>10 t</text>;
    case "no-overtake":
      return <><path d="M28 58 L32 48 Q34 44 39 44 L49 44 Q54 44 56 48 L60 58 L60 64 L54 64 A4 4 0 0 1 44 64 L44 64 L34 64 A4 4 0 0 1 28 64 Z" fill={RED} /><path d="M46 40 L50 32 Q52 28 56 28 L64 28 Q69 28 71 32 L74 40 L74 46 L69 46 A4 4 0 0 1 60 46 L58 46 A4 4 0 0 1 50 46 L46 46 Z" transform="translate(-4 24)" fill={INK} /></>;
    case "both-ways-arrow":
      return <><path d="M50 22 L62 40 L54 40 L54 60 L46 60 L46 40 L38 40 Z" fill={c} /><path d="M50 78 L38 60 L46 60 L46 60 L54 60 L62 60 Z" fill={c} /></>;
    case "keep-left":
      return <path d="M50 24 L50 40 Q50 46 44 48 L34 52 L34 62 L26 52 L34 40 L34 46 L42 43 Q44 42 44 38 L44 24 Z M50 24 L58 24 L58 76 L50 76 Z" fill={c} />;
    case "stop-go":
      return <><circle cx="50" cy="38" r="12" fill="none" stroke={c} strokeWidth="5" /><rect x="46" y="52" width="8" height="26" fill={c} /></>;
    case "wide-load":
      return <><rect x="30" y="40" width="40" height="20" fill={c} /><path d="M24 50 L32 42 L32 58 Z" fill={c} /><path d="M76 50 L68 42 L68 58 Z" fill={c} /></>;
    default:
      return <circle cx="50" cy="50" r="18" fill={c} />;
  }
}

export function SignSvg({ spec, size = 72 }: { spec: SignSpec; size?: number }) {
  const s = spec;
  let frame: React.ReactNode = null;
  let glyphColor = INK;
  let slash = false;

  switch (s.shape) {
    case "stop":
      frame = (
        <>
          <polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill={RED} stroke="#fff" strokeWidth="4" />
          <text fontFamily={FONT} x="50" y="60" textAnchor="middle" fontSize="24" fontWeight="800" fill="#fff">STOP</text>
        </>
      );
      break;
    case "yield":
      frame = (
        <polygon points="8,12 92,12 50,92" fill="#fff" stroke={RED} strokeWidth="10" strokeLinejoin="round" />
      );
      break;
    case "prohib":
      frame = <circle cx="50" cy="50" r="44" fill="#fff" stroke={RED} strokeWidth="9" />;
      slash = true;
      break;
    case "limit":
      frame = <circle cx="50" cy="50" r="44" fill="#fff" stroke={RED} strokeWidth="9" />;
      break;
    case "command":
      frame = <circle cx="50" cy="50" r="46" fill={BLUE} />;
      glyphColor = "#fff";
      break;
    case "no-entry":
      frame = <circle cx="50" cy="50" r="46" fill={RED} />;
      glyphColor = "#fff";
      break;
    case "warning":
      frame = <polygon points="50,6 94,88 6,88" fill="#fff" stroke={RED} strokeWidth="8" strokeLinejoin="round" />;
      break;
    case "warning-temp":
      frame = <polygon points="50,6 94,88 6,88" fill={YELLOW} stroke={RED} strokeWidth="8" strokeLinejoin="round" />;
      break;
    case "info-blue":
      frame = <rect x="6" y="6" width="88" height="88" rx="8" fill={BLUE} />;
      glyphColor = "#fff";
      break;
    case "guide-green":
      frame = <rect x="6" y="6" width="88" height="88" rx="8" fill={GREEN} />;
      glyphColor = "#fff";
      break;
    case "rect-white":
      frame = <rect x="6" y="6" width="88" height="88" rx="8" fill="#fff" stroke={INK} strokeWidth="4" />;
      break;
  }

  const warnShape = s.shape === "warning" || s.shape === "warning-temp";

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={s.name} className="drop-shadow-sm">
      {frame}
      {s.glyph && (
        <g transform={warnShape ? "translate(14 22) scale(0.72)" : s.shape === "yield" ? "translate(20 14) scale(0.6)" : "translate(9 9) scale(0.82)"}>
          <Glyph id={s.glyph} color={glyphColor} />
        </g>
      )}
      {slash && <line x1="21" y1="21" x2="79" y2="79" stroke={RED} strokeWidth="8" />}
    </svg>
  );
}
