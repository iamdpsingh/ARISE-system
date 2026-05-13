# ARISE: THE SYSTEM

ARISE is a Solo Leveling inspired workout + study discipline app built with Expo/React Native.
It tracks daily quests, nutrition, streak/progress, phase advancement, and uploads mission logs to your own GitHub repo.

Repository: https://github.com/iamdpsingh/ARISE-system

## Core Features

- Solo Leveling themed system UI (status, quests, phases, health, history)
- Separate Timetable tab with full add/edit/remove/reset controls
- Daily routine + workout completion with XP/level system
- Calendar-based day counter that advances after midnight even when targets are missed
- Rest Day support with streak preservation and phase summary tracking
- Active-phase daily logs, phase overall logs, and retry-safe GitHub log uploads
- Phase map with locked phase preview (details visible before unlock)
- Missed day does not reset whole progression anymore
- GitHub mission log upload with in-app "Upload Logs"
- Home-screen widgets:
  - Status
  - Quest
  - Nutrition
  - Water Intake
  - Timetable

## Tech Stack

- Expo SDK 54
- React Native 0.81
- TypeScript
- React Navigation
- AsyncStorage
- Expo Notifications
- Expo Background Task / Task Manager
- Expo SecureStore
- `@bittingz/expo-widgets`

## Project Structure

```text
arise-system/
├── assets/
├── releases/
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── notifications/
│   ├── screens/
│   ├── services/
│   └── theme/
├── widgets/
│   ├── android/
│   └── ios/
├── App.tsx
├── app.json
├── eas.json
└── package.json
```

## Local Setup

### Requirements

- Node.js 18+ (20+ recommended)
- npm
- Expo CLI / `npx expo`
- EAS CLI (`npm i -g eas-cli`)

### Install and run

```bash
git clone https://github.com/iamdpsingh/ARISE-system.git
cd ARISE-system
npm install
npx expo start
```

## Daily Logs And GitHub Log Sync

No PAT is hardcoded in source.

Configure from app settings:
1. GitHub Personal Access Token (repo scope)
2. GitHub owner (username/org)
3. Repository name

Daily logs are generated at day rollover for the day that just ended. The app uses a pending upload queue, so logs are not lost if the app is closed, the phone restarts, the network is down, or GitHub upload fails.

Then tap `UPLOAD LOGS` to upload/retry pending logs manually.

Local behavior:
- Active phase daily logs are visible in the app.
- When a phase completes, an overall phase log is kept locally.
- Daily logs from that completed phase are removed from the local log display after the phase log is created.

GitHub behavior:
- Daily logs are uploaded under `logs/phase_XX/daily/YYYY-MM-DD.md`.
- Phase summaries are uploaded under `logs/phase_XX/`.
- Existing dated files are updated in place instead of duplicated.

## Build Prerequisites

### Android APK (EAS Local Build)

- EAS login required: `eas login`
- Java 17 required
- Android SDK required (with `platform-tools`, platform API, and build-tools)
- If the SDK is not in the default macOS location, export `ANDROID_HOME` and `ANDROID_SDK_ROOT` to your local SDK root before running Gradle/EAS.

Build command:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
eas build -p android --local --profile preview
```

### iOS IPA (EAS Cloud Build)

- EAS login required
- Apple Developer account required
- Apple credentials/certificates/provisioning required (EAS can manage interactively)

Build command:

```bash
eas build -p ios --profile preview
```

## Security Notes

- Never commit `.env`, `secrets.json`, tokens, keys, or provisioning files
- GitHub tokens are stored with Expo SecureStore on device, not in source or AsyncStorage
- This repo keeps user secrets out of versioned source by design
- `.gitignore` already blocks common secret files
