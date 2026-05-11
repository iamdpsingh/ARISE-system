# ARISE: THE SYSTEM

ARISE is a Solo Leveling inspired workout + study discipline app built with Expo/React Native.
It tracks daily quests, nutrition, streak/progress, phase advancement, and uploads mission logs to your own GitHub repo.

Repository: https://github.com/iamdpsingh/ARISE-system

## Core Features

- Solo Leveling themed system UI (status, quests, phases, health, history)
- Separate Timetable tab with full add/edit/remove/reset controls
- Daily routine + workout completion with XP/level system
- Phase map with locked phase preview (details visible before unlock)
- Missed day does not reset whole progression anymore
- GitHub mission log upload with in-app "Test Log Upload Now"
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

## GitHub Log Sync (In-App)

No PAT is hardcoded in source.

Configure from app settings:
1. GitHub Personal Access Token (repo scope)
2. GitHub owner (username/org)
3. Repository name

Then tap `TEST LOG UPLOAD NOW` to verify upload.

## Build Prerequisites

### Android APK (EAS Local Build)

- EAS login required: `eas login`
- Java 17 required
- Android SDK required (with `platform-tools`, platform API, and build-tools)

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
- This repo keeps user secrets out of versioned source by design
- `.gitignore` already blocks common secret files
