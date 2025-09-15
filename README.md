# Melly Moo

A kid-safe bubble popping game built with React Native, Expo, and TypeScript.

## Features

- **Kid-Safe Design**: No fail states, no social features, COPPA compliant
- **Accessibility**: Color assist, reduce motion, long-press mode
- **Local Storage**: All data stored locally, no cloud required
- **Parent Controls**: Grown-ups area with privacy settings and shop
- **Multiple Themes**: Farm, Beach, Candy Land, and Space worlds
- **Reward System**: Stickers, costumes, and decorations to collect

## Tech Stack

- **Frontend**: React Native with TypeScript, Expo Router
- **UI**: React Native Paper
- **State**: Zustand with persistence
- **Storage**: AsyncStorage (local only)
- **Navigation**: Expo Router

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Run on device/simulator:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## Build

### Development Build
```bash
npx eas build --profile development --platform ios
npx eas build --profile development --platform android
```

### Production Build
```bash
npx eas build --profile production --platform all
```

## Project Structure

```
app/                    # Expo Router screens
  index.tsx            # Title screen
  home.tsx             # Main menu
  play/                # Game flow
  settings.tsx         # Kid-safe settings
  grownups/            # Parent area
src/
  components/          # Reusable UI components
  features/            # Feature modules
  services/            # Business logic
  state/               # Zustand store
  lib/                 # Utilities and config
```

## Privacy

This app is designed for children and complies with COPPA:
- No personal data collection
- All data stored locally on device
- Optional analytics are device-local only
- Parent controls available in Grown-ups area

## License

Private - All rights reserved