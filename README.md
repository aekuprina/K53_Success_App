# K53 Success App

Pass your South African learner's licence **first time**. Built for the new computerised test (CLLT): calibrated question bank, realistic 68-question mock exam, honest Readiness Score, offline-first PWA.

**Live:** https://k53-success-app.vercel.app

## What's inside (MVP)

- **Guest start** — first question in under 60 seconds, no registration
- **Topic practice** — 14 topics across the 3 CLLT blocks, weakest-first ordering
- **Mock exam** — 68 questions (64 scored + 4 pilot), 60-minute timer, per-block pass thresholds (22/28, 23/28, 6/8)
- **Readiness Score** — pass-probability estimate from coverage, accuracy, stability, recency and mock results, plus your top-3 danger topics
- **Smart mistakes queue** — wrong answers auto-queue; two correct answers in a row clears them
- **Road signs library** — original SVG signs with search, categories, and a static SEO page per sign
- **Offline PWA** — service worker, installable, works without data after first load
- **Dark mode**, POPIA-compliant privacy (all data on-device), DoT/RTMC disclaimer

## Stack

Next.js 14 (App Router, static export) · TypeScript · Tailwind CSS · Capacitor 6 for native shells. No backend — all state in `localStorage`.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # static export to out/
```

Deploys automatically to Vercel on push to `main`.

## Publish to App Store / Google Play

See [PUBLISHING.md](./PUBLISHING.md) for the full checklist.

```bash
npm run build:mobile          # build web + sync to native shells
npx cap add android           # first time only
npx cap add ios               # first time only (requires macOS + Xcode)
npm run android               # open in Android Studio
npm run ios                   # open in Xcode
```

## Content

All questions, explanations and sign illustrations are **original work** — not copied from official publications. The app is not affiliated with the Department of Transport or RTMC.

## Roadmap (from Product Bar v1)

v1.1: Afrikaans, streaks/daily goal, WhatsApp share & reminders, exam-day content pages, premium unlock (R79) / Pass Pack (R149) via PayFast.
v2: isiZulu/isiXhosa hints + TTS audio, driving-school marketplace, B2B dashboards, post-exam calibration loop CMS.
