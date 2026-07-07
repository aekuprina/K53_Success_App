# Publishing K53 Success to the app stores

The app is a static Next.js export wrapped in Capacitor. One codebase → web (Vercel) + Android + iOS.

## 0. Prerequisites

- **Google Play:** Google Play Console account (once-off $25), Android Studio
- **App Store:** Apple Developer Program ($99/yr), a Mac with Xcode 15+
- App ID is set to `za.co.k53success.app` in `capacitor.config.ts` — change it *before* first store upload if needed (it is permanent)

## 1. Build the native projects

```bash
npm install
npm run build:mobile      # next build + cap sync
npx cap add android       # creates android/ (first time)
npx cap add ios           # creates ios/ (first time, macOS only)
```

`android/` and `ios/` are gitignored by default; remove those lines from `.gitignore` once you customise the native shells.

## 2. Android (Google Play)

1. `npm run android` → opens Android Studio
2. Set version in `android/app/build.gradle` (`versionCode`, `versionName`)
3. Build → Generate Signed Bundle → create an upload keystore (**back it up — losing it means losing the app listing**)
4. Upload the `.aab` to Play Console → Internal testing first
5. Store listing needs: title (30 ch), short description (80 ch), full description, 512×512 icon (in `public/icons/icon-512.png`), feature graphic 1024×500, ≥2 phone screenshots
6. Data safety form: declare **no data collected** (all state is on-device)
7. Content rating questionnaire: Education, no user content → Everyone

## 3. iOS (App Store)

1. `npm run ios` → opens Xcode
2. Signing & Capabilities → select your team; set bundle ID `za.co.k53success.app`
3. Set version + build number
4. Product → Archive → Distribute → App Store Connect
5. App Store Connect: create the app, fill in privacy details ("Data not collected"), add screenshots (6.7" and 5.5"), keywords, description
6. Submit for review. Expect questions about "test prep" apps — the DoT/RTMC disclaimer in-app (About/Terms) covers the affiliation issue

## 4. Store copy (draft)

**Title:** K53 Success: Learner's Licence Test SA
**Short:** Pass your K53 learner's test first time. New computerised test format. Free.
**Description highlights:** built for the new CLLT · realistic 68-question mock exam with real pass thresholds · Readiness Score tells you when you're actually ready · works offline, under 2 MB · no registration, no ads in your test

## 5. Versioning workflow

Every release: bump `version` in `package.json`, `versionCode/versionName` (Android), build number (iOS). Web deploys automatically from `main` via Vercel; stores need a manual archive/upload.

## 6. Before you submit — checklist

- [ ] Run a full mock exam on a real low-end Android device
- [ ] Test offline mode (airplane mode after first load)
- [ ] Verify dark mode on both platforms
- [ ] Privacy policy URL for store listings: https://k53-success-app.vercel.app/privacy/
- [ ] Terms URL: https://k53-success-app.vercel.app/terms/
- [ ] Keystore + Apple certificates backed up in a password manager
