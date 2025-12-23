#!/bin/bash

# Script to download and prepare yt-dlp and ffmpeg for bundling with the Tauri app

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BINARIES_DIR="$PROJECT_ROOT/src-tauri/binaries"

TARGET_PLATFORM=${1:-auto}

detect_platform() {
  case "$(uname -s)" in
    Darwin) echo "macos" ;;
    MINGW*|MSYS*|CYGWIN*) echo "windows" ;;
    Linux) echo "linux" ;;
    *) echo "unknown" ;;
  esac
}

if [[ "$TARGET_PLATFORM" == "auto" ]]; then
  TARGET_PLATFORM=$(detect_platform)
fi

if [[ ! "$TARGET_PLATFORM" =~ ^(macos|windows|all)$ ]]; then
  echo "Usage: $0 [macos|windows|all]"
  echo "  macos   - Prepare macOS binaries"
  echo "  windows - Prepare Windows binaries"
  echo "  all     - Prepare both macOS and Windows binaries"
  exit 1
fi

echo "Preparing binaries for: $TARGET_PLATFORM"

mkdir -p "$BINARIES_DIR"

prepare_macos() {
  echo "Preparing binaries for macOS..."

  # Download yt-dlp (universal)
  echo "Downloading yt-dlp (macOS universal)..."
  curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos -o "$BINARIES_DIR/yt-dlp-aarch64-apple-darwin"
  chmod +x "$BINARIES_DIR/yt-dlp-aarch64-apple-darwin"

  # yt-dlp from GitHub is already universal, so we can use it for all architectures
  cp "$BINARIES_DIR/yt-dlp-aarch64-apple-darwin" "$BINARIES_DIR/yt-dlp-x86_64-apple-darwin"
  cp "$BINARIES_DIR/yt-dlp-aarch64-apple-darwin" "$BINARIES_DIR/yt-dlp-universal-apple-darwin"

  # Download ffmpeg (static universal build)
  echo "Downloading ffmpeg (macOS universal)..."
  local ffmpeg_url="https://evermeet.cx/ffmpeg/getrelease/ffmpeg/zip"

  curl -L "$ffmpeg_url" -o "$BINARIES_DIR/ffmpeg.zip"
  (cd "$BINARIES_DIR" && unzip -o ffmpeg.zip && rm ffmpeg.zip)
  mv "$BINARIES_DIR/ffmpeg" "$BINARIES_DIR/ffmpeg-aarch64-apple-darwin"
  chmod +x "$BINARIES_DIR/ffmpeg-aarch64-apple-darwin"

  # evermeet.cx ffmpeg is universal, so we can reuse for both architectures
  cp "$BINARIES_DIR/ffmpeg-aarch64-apple-darwin" "$BINARIES_DIR/ffmpeg-x86_64-apple-darwin"
  cp "$BINARIES_DIR/ffmpeg-aarch64-apple-darwin" "$BINARIES_DIR/ffmpeg-universal-apple-darwin"
}

prepare_windows() {
  echo "Preparing binaries for Windows..."

  # Download yt-dlp
  echo "Downloading yt-dlp (Windows x86_64)..."
  curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe -o "$BINARIES_DIR/yt-dlp-x86_64-pc-windows-msvc.exe"
  chmod +x "$BINARIES_DIR/yt-dlp-x86_64-pc-windows-msvc.exe"

  # Download ffmpeg (static build)
  echo "Downloading ffmpeg (Windows x86_64)..."
  local ffmpeg_zip_url="https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
  local tmp_dir
  tmp_dir=$(mktemp -d)

  curl -L "$ffmpeg_zip_url" -o "$tmp_dir/ffmpeg.zip"
  unzip -q "$tmp_dir/ffmpeg.zip" -d "$tmp_dir"

  local ffmpeg_path
  ffmpeg_path=$(find "$tmp_dir" -name ffmpeg.exe | head -n 1)

  if [[ -z "$ffmpeg_path" ]]; then
    echo "❌ ffmpeg.exe not found in downloaded archive"
    rm -rf "$tmp_dir"
    exit 1
  fi

  cp "$ffmpeg_path" "$BINARIES_DIR/ffmpeg-x86_64-pc-windows-msvc.exe"
  chmod +x "$BINARIES_DIR/ffmpeg-x86_64-pc-windows-msvc.exe"

  rm -rf "$tmp_dir"
}

if [[ "$TARGET_PLATFORM" == "macos" || "$TARGET_PLATFORM" == "all" ]]; then
  prepare_macos
fi

if [[ "$TARGET_PLATFORM" == "windows" || "$TARGET_PLATFORM" == "all" ]]; then
  prepare_windows
fi

echo "✅ Binaries prepared successfully!"
echo "  - macOS: $BINARIES_DIR/yt-dlp-*-apple-darwin, $BINARIES_DIR/ffmpeg-*-apple-darwin"
echo "  - Windows: $BINARIES_DIR/yt-dlp-x86_64-pc-windows-msvc.exe, $BINARIES_DIR/ffmpeg-x86_64-pc-windows-msvc.exe"
