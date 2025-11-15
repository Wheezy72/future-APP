# Future — Wellness, Finance & Social Accountability (Expo + React Native)

A production-ready mobile app (Expo SDK 49, React Native, Expo Router v2, Reanimated v3) that blends personal wellness, habit-building, social accountability (removed), and personal finance into a cohesive experience with premium design and smooth interactions.

## Features

- Security
  - 4-digit PIN with biometric unlock (Android Face on supported devices like Samsung A05)
  - Auto-lock patterns can be added later
- UI/UX
  - Dark cyberpunk theme with glassmorphic cards
  - Ambient animated background via Reanimated
  - Ionicons everywhere for a consistent icon set
- Home Dashboard
  - Today’s stats (goals, entries, expenses)
  - XP/Level progress
  - Smart Insights + quick mindfulness visual
- Manage (Segmented: Finance, Goals & Journal, Wellness)
  - Finance
    - Expense tracking (add/delete), dynamic categories
    - Budgets per category + progress for current month
    - Savings goals with contributions and progress
    - Analytics: category bar chart and monthly trend bar chart (react-native-svg)
  - Goals & Journal
    - Create goals (type habit), target, optional category
    - Increment progress; XP rewards in future
    - Journal entries with mood and optional attached photos (no paper texture, no handwriting font)
  - Wellness
    - Mood logging
    - Mindfulness timer with visual breathing pulse (Box 4-4-4-4, 4-7-8, or Custom) + haptics
    - No audio coach (per requirement)
- Notifications
  - Daily reminders sample (schedule/list/cancel in Notifications Center)
- Offline-first + Cloud + Backup
  - All data persisted locally (AsyncStorage)
  - Cloud Sync settings (REST or Firebase stub)
  - Manual Sync Now from Home or Settings
  - Export/Import JSON backup in app documents directory

## Tech Stack

- React 18, React Native 0.72
- Expo SDK 49 (expo-router v2, dev client)
- Reanimated v3
- Ionicons (@expo/vector-icons)
- AsyncStorage (data persistence)
- expo-notifications, expo-image-picker, expo-haptics, expo-file-system
- react-native-svg (charts)
- Fonts: Orbitron, Rajdhani, ShareTechMono (via @expo-google-fonts)

## How to Run

1) Prerequisites
- Node.js 18+
- Android Studio or Xcode
- Dev Client required (Reanimated v3 + native modules)

2) Install
- npm install

3) Start Metro
- npm run start

4) Build and run a Dev Client
- Android: npm run android
- iOS (macOS): npm run ios

5) Permissions
- Notifications: allow when prompted
- Photos: allow if you plan to attach images

## Cloud Sync

- Settings → Cloud Sync:
  - Enabled toggle
  - Base URL: https://your-api.example.com (REST) or "firebase" (stub)
  - Save Cloud then tap Sync Now in Settings or Home
- REST endpoints (expected):
  - GET /sync returns a JSON object with keys for each dataset
  - POST /sync accepts a JSON body to replace server state
- Firebase stub provided (no SDK included). If you want Firebase:
  - Add Firebase SDK packages
  - Wire src/services/firebase.js with real init and Firestore document sync/default

Datasets synced
- finance:expenses, finance:budgets, finance:savings
- gj:goals, gj:entries
- wellness:moods
- xp:total

## Backup

- Settings → Backup
  - Export JSON → writes backup-<timestamp>.json under app documents
  - Import Latest → restores the latest backup file
- To move to another device:
  1) Export JSON on old device
  2) Copy the backup file from device storage (Documents directory) to the new device
  3) Place it in the new device’s app documents directory
  4) Use Import Latest on the new device (or implement a file picker to import from any path)

## Packaging a final APK (Android)

Expo SDK 49 uses EAS Build for production binaries. Two options:

Option A — EAS Build (Recommended)
1) Install EAS CLI
   - npm i -g eas-cli
2) Configure EAS
   - eas login (if you have an Expo account)
   - eas init
3) Build APK (or AAB)
   - APK (for easy sideload): eas build -p android --profile preview
   - AAB (for Play Store): eas build -p android --profile production
4) Download the build artifact from the EAS Build page or CLI output

Option B — Local Gradle build (no EAS)
1) Prebuild native projects
   - expo prebuild
2) Open android/ in Android Studio or use Gradle CLI:
   - cd android
   - ./gradlew assembleRelease
3) Find APK at:
   - android/app/build/outputs/apk/release/app-release.apk

Notes:
- If you change native dependencies or app.json config, rebuild the Dev Client (npm run android) and re-run production builds.
- For signing:
  - EAS handles keystore management interactively
  - For local Gradle, generate/upload a keystore and configure signing in android/app/build.gradle

## Project Structure

- app/
  - _layout.jsx (Root Stack + Animated Background)
  - index.jsx (startup)
  - pin-entry.jsx (authentication)
  - (tabs)/
    - _layout.jsx (Tab bar)
    - home.jsx (dashboard, progress, insights, manual sync)
    - manage.jsx (segmented: finance, goals-journal, wellness)
    - finance.jsx
    - goals-journal.jsx
    - wellness.jsx
    - settings.jsx (security, cloud, backup, notifications link)
  - notifications.jsx (view/cancel scheduled reminders)
- src/
  - components/ (AnimatedBackground, GlassCard, CachedImage)
  - hooks/ (useFonts via @expo-google-fonts)
  - constants/theme.js
  - services/
    - auth.js, storage.js
    - data.js (XP/levels, stats)
    - finance.js (expenses, budgets, savings, analytics)
    - goalsJournal.js (goals, entries)
    - wellness.js (moods)
    - notifications.js
    - cloud.js (REST/Firebase stubs)
    - settings.js (cloud preferences)
    - sync.js (datasets + push/pull orchestration)
    - backup.js (export/import JSON files)
    - insights.js (basic correlations)
  - utils/xp.js

## Scripts

- npm run start — Expo dev server (dev client)
- npm run android — build & run on Android
- npm run ios — build & run on iOS
- npm run web — web dev

## License

Demo and internal use. Add your license of choice (e.g., MIT) before distributing.