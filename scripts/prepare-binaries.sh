#!/bin/bash

# Script to download and prepare yt-dlp and ffmpeg for bundling with the Tauri app

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BINARIES_DIR="$PROJECT_ROOT/src-tauri/binaries"

echo "Preparing binaries for macOS..."

# Create binaries directory if it doesn't exist
mkdir -p "$BINARIES_DIR"

# Download yt-dlp
echo "Downloading yt-dlp..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos -o "$BINARIES_DIR/yt-dlp-aarch64-apple-darwin"
chmod +x "$BINARIES_DIR/yt-dlp-aarch64-apple-darwin"

# yt-dlp from GitHub is already universal, so we can use it for all architectures
cp "$BINARIES_DIR/yt-dlp-aarch64-apple-darwin" "$BINARIES_DIR/yt-dlp-x86_64-apple-darwin"
cp "$BINARIES_DIR/yt-dlp-aarch64-apple-darwin" "$BINARIES_DIR/yt-dlp-universal-apple-darwin"

# Download ffmpeg (static build)
echo "Downloading ffmpeg..."
FFMPEG_URL="https://evermeet.cx/ffmpeg/getrelease/ffmpeg/zip"

# Download for arm64
curl -L "$FFMPEG_URL" -o "$BINARIES_DIR/ffmpeg.zip"
cd "$BINARIES_DIR"
unzip -o ffmpeg.zip
mv ffmpeg ffmpeg-aarch64-apple-darwin
chmod +x ffmpeg-aarch64-apple-darwin
rm ffmpeg.zip

# Note: evermeet.cx ffmpeg is universal binary, so we can use it for all architectures
cp ffmpeg-aarch64-apple-darwin ffmpeg-x86_64-apple-darwin
cp ffmpeg-aarch64-apple-darwin ffmpeg-universal-apple-darwin

echo "✅ Binaries prepared successfully!"
echo "  - yt-dlp: $BINARIES_DIR/yt-dlp-*-apple-darwin"
echo "  - ffmpeg: $BINARIES_DIR/ffmpeg-*-apple-darwin"
echo ""
echo "Architecture support:"
echo "  - aarch64 (Apple Silicon)"
echo "  - x86_64 (Intel)"
echo "  - universal (Both)"
