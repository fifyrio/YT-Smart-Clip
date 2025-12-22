#!/bin/bash

# Local macOS Build and Sign Script
# This script builds and signs the app locally for testing

set -e  # Exit on error

echo "🚀 Starting local build and sign process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration - you can edit these
SIGNING_IDENTITY="Developer ID Application: hongmei shen (L8T9XWPP8D)"  # Change this to your actual identity
APPLE_ID="fifyriowill@gmail.com"  # Change this to your Apple ID
TEAM_ID="L8T9XWPP8D"  # Change this to your Team ID

echo "📋 Configuration:"
echo "   Signing Identity: $SIGNING_IDENTITY"
echo "   Apple ID: $APPLE_ID"
echo "   Team ID: $TEAM_ID"
echo ""

# Step 1: Check if we have the signing identity
echo "🔍 Checking for signing identities..."
security find-identity -v -p codesigning

# Step 2: Build the app (unsigned)
echo ""
echo "🔨 Building Tauri app (unsigned)..."
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

# Step 3: Find the built app
APP_PATH=$(find "src-tauri/target/$TARGET_DIR/release/bundle/macos" -name "*.app" -type d | head -n 1)

if [ -z "$APP_PATH" ]; then
    echo -e "${RED}❌ App bundle not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found app at: $APP_PATH${NC}"

# Step 4: List app contents
echo ""
echo "📁 App bundle contents:"
ls -la "$APP_PATH/Contents/Resources/" || true

# Step 5: Sign external binaries
RESOURCES_PATH="$APP_PATH/Contents/Resources"

echo ""
if [ -f "$RESOURCES_PATH/yt-dlp" ]; then
    echo "📝 Signing yt-dlp..."
    codesign --force --timestamp --options runtime \
        --sign "$SIGNING_IDENTITY" \
        "$RESOURCES_PATH/yt-dlp" 2>&1 || {
        echo -e "${YELLOW}⚠️  Failed with specific identity, trying ad-hoc signing...${NC}"
        codesign --force --timestamp --options runtime \
            --sign - \
            "$RESOURCES_PATH/yt-dlp"
    }
    echo -e "${GREEN}✅ yt-dlp signed${NC}"
else
    echo -e "${YELLOW}⚠️  yt-dlp not found${NC}"
fi

echo ""
if [ -f "$RESOURCES_PATH/ffmpeg" ]; then
    echo "📝 Signing ffmpeg..."
    codesign --force --timestamp --options runtime \
        --sign "$SIGNING_IDENTITY" \
        "$RESOURCES_PATH/ffmpeg" 2>&1 || {
        echo -e "${YELLOW}⚠️  Failed with specific identity, trying ad-hoc signing...${NC}"
        codesign --force --timestamp --options runtime \
            --sign - \
            "$RESOURCES_PATH/ffmpeg"
    }
    echo -e "${GREEN}✅ ffmpeg signed${NC}"
else
    echo -e "${YELLOW}⚠️  ffmpeg not found${NC}"
fi

# Step 6: Sign the entire app bundle
echo ""
echo "📝 Signing app bundle with hardened runtime..."
codesign --force --deep --timestamp --options runtime \
    --sign "$SIGNING_IDENTITY" \
    --entitlements src-tauri/entitlements.plist \
    "$APP_PATH" 2>&1 || {
    echo -e "${YELLOW}⚠️  Failed with specific identity, trying ad-hoc signing...${NC}"
    codesign --force --deep --timestamp --options runtime \
        --sign - \
        --entitlements src-tauri/entitlements.plist \
        "$APP_PATH"
}

# Step 7: Verify the signature
echo ""
echo "✅ Verifying signature..."
codesign --verify --deep --strict --verbose=2 "$APP_PATH"

echo ""
echo "📊 Signature details:"
codesign -dvv "$APP_PATH"

echo ""
echo "🔒 Gatekeeper assessment:"
spctl --assess --type execute --verbose=4 "$APP_PATH" 2>&1 || echo -e "${YELLOW}⚠️  Gatekeeper assessment failed (expected if not notarized)${NC}"

# Step 8: Create DMG
echo ""
echo "📦 Creating DMG..."
DMG_DIR="src-tauri/target/$TARGET_DIR/release/bundle/dmg"
mkdir -p "$DMG_DIR"
APP_NAME="YT Smart Clip"
DMG_PATH="$DMG_DIR/${APP_NAME}_local_signed.dmg"

# Remove old DMG if exists
rm -f "$DMG_PATH"

# Create DMG
hdiutil create -volname "$APP_NAME" -srcfolder "$APP_PATH" -ov -format UDZO "$DMG_PATH"

echo -e "${GREEN}✅ Created DMG at: $DMG_PATH${NC}"

# Step 9: Optional - Notarize (requires credentials)
echo ""
read -p "Do you want to notarize the DMG? (requires Apple ID password) [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Notarizing DMG..."
    echo "⚠️  You will need an App-Specific Password for your Apple ID"
    echo "    Generate one at: https://appleid.apple.com"
    echo ""

    read -sp "Enter App-Specific Password: " APP_PASSWORD
    echo ""

    xcrun notarytool submit "$DMG_PATH" \
        --apple-id "$APPLE_ID" \
        --password "$APP_PASSWORD" \
        --team-id "$TEAM_ID" \
        --wait \
        --timeout 30m || {
        echo -e "${RED}❌ Notarization failed${NC}"
        exit 1
    }

    echo ""
    echo "📌 Stapling notarization ticket..."
    xcrun stapler staple "$DMG_PATH"

    echo ""
    echo "✅ Verifying staple..."
    xcrun stapler validate "$DMG_PATH"

    echo -e "${GREEN}✅ Notarization completed!${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping notarization${NC}"
    echo "   DMG is signed but not notarized"
    echo "   Users will need to right-click -> Open on first launch"
fi

echo ""
echo -e "${GREEN}✅✅✅ Build and sign process completed! ✅✅✅${NC}"
echo ""
echo "📍 Outputs:"
echo "   App:  $APP_PATH"
echo "   DMG:  $DMG_PATH"
echo ""
echo "🧪 To test the app:"
echo "   1. Open Finder and navigate to the DMG location"
echo "   2. Double-click to mount the DMG"
echo "   3. Drag the app to Applications or run directly"
