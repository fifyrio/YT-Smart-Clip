#!/bin/bash

# Quick test script - just build and sign, no notarization
# Perfect for rapid local testing

set -e

echo "⚡ Quick build and sign (no notarization)..."
echo ""

# Build unsigned (for current architecture only)
echo "🔨 Building..."
echo "📋 Detecting architecture..."
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then
    TARGET="aarch64-apple-darwin"
    TARGET_DIR="aarch64-apple-darwin"
else
    TARGET="x86_64-apple-darwin"
    TARGET_DIR="x86_64-apple-darwin"
fi
echo "   Building for: $TARGET"

TAURI_SKIP_CODE_SIGNING=true pnpm tauri build --target "$TARGET"

# Find app
APP_PATH=$(find "src-tauri/target/$TARGET_DIR/release/bundle/macos" -name "*.app" -type d | head -n 1)

if [ -z "$APP_PATH" ]; then
    echo "❌ App not found"
    exit 1
fi

echo "✅ Built: $APP_PATH"
echo ""

# Check available identities
echo "📋 Available signing identities:"
security find-identity -v -p codesigning
echo ""

# Sign with ad-hoc (no certificate needed)
echo "📝 Signing with ad-hoc signature..."

RESOURCES_PATH="$APP_PATH/Contents/Resources"

# Sign binaries
[ -f "$RESOURCES_PATH/yt-dlp" ] && codesign --force --sign - "$RESOURCES_PATH/yt-dlp"
[ -f "$RESOURCES_PATH/ffmpeg" ] && codesign --force --sign - "$RESOURCES_PATH/ffmpeg"

# Sign app
codesign --force --deep --sign - \
    --entitlements src-tauri/entitlements.plist \
    "$APP_PATH"

# Verify
echo ""
echo "✅ Verifying..."
codesign --verify --deep --strict --verbose=2 "$APP_PATH"

echo ""
echo "🎉 Done! You can now run the app:"
echo "   open \"$APP_PATH\""
echo ""
echo "⚠️  Note: This is ad-hoc signed. Users will need to:"
echo "   1. Right-click the app"
echo "   2. Select 'Open'"
echo "   3. Click 'Open' in the dialog"
