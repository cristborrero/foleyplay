#!/usr/bin/env bash
set -euo pipefail

# Build script for Android TV APK
# Usage: ./build-tv.sh [--open]
#   --open  Opens Android Studio after sync (default: skip)

OPEN_STUDIO=false
if [[ "${1:-}" == "--open" ]]; then
  OPEN_STUDIO=true
fi

echo "▶  Building Next.js..."
npm run build

echo "▶  Syncing Capacitor..."
npx cap sync android

if $OPEN_STUDIO; then
  echo "▶  Opening Android Studio..."
  npx cap open android
else
  echo ""
  echo "✅  Sync complete. To build the APK:"
  echo "    1. Open Android Studio:  npx cap open android"
  echo "    2. Build > Generate Signed APK"
  echo ""
  echo "Or install directly via ADB (debug build from Gradle):"
  echo "    cd android && ./gradlew assembleDebug"
  echo "    adb connect <TV_IP>:5555"
  echo "    adb install app/build/outputs/apk/debug/app-debug.apk"
fi
