# Building YT Smart Clip for Distribution

This guide explains how to build a distributable macOS app that includes all necessary dependencies.

## Overview

The app bundles `yt-dlp` and `ffmpeg` as sidecar binaries, so users don't need to install them separately.

## Prerequisites

- macOS (for building macOS apps)
- Node.js and pnpm
- Rust and Cargo (installed via Tauri setup)

## Building for Distribution

### 1. Prepare Binaries

Download and prepare the required binaries:

```bash
pnpm prepare:binaries
```

This script will:
- Download the latest `yt-dlp` for macOS
- Download `ffmpeg` static binary for macOS
- Place them in `src-tauri/binaries/` with correct naming for both architectures

### 2. Build the App

```bash
pnpm tauri:build
```

This will:
1. Run the prepare:binaries script
2. Build the Next.js frontend
3. Build the Tauri app with bundled binaries
4. Create a `.dmg` installer in `src-tauri/target/release/bundle/`

## How It Works

### Development Mode

In development (`pnpm tauri:dev`), the app will:
1. First try to use system-installed `yt-dlp` and `ffmpeg` (if available)
2. Fall back to bundled binaries if system binaries aren't found

This allows developers to work without downloading binaries every time.

### Production Mode

In production builds, the app:
1. Bundles `yt-dlp` and `ffmpeg` inside the `.app` bundle
2. Uses these bundled binaries automatically
3. Users don't need to install any dependencies

## Binary Locations

- **Source**: `src-tauri/binaries/`
- **In .app bundle**: `YT Smart Clip.app/Contents/Resources/binaries/`

## Supported Architectures

The build script downloads binaries for:
- Apple Silicon (aarch64-apple-darwin)
- Intel Macs (x86_64-apple-darwin)

## Troubleshooting

### Binaries not found during build

Run the prepare script manually:
```bash
pnpm prepare:binaries
```

Check that files exist in `src-tauri/binaries/`:
- `yt-dlp-aarch64-apple-darwin`
- `yt-dlp-x86_64-apple-darwin`
- `ffmpeg-aarch64-apple-darwin`
- `ffmpeg-x86_64-apple-darwin`

### Download fails

The script uses curl to download binaries. Ensure you have internet access and the URLs are still valid:
- yt-dlp: https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos
- ffmpeg: https://evermeet.cx/ffmpeg/getrelease/ffmpeg/zip

## File Size

The bundled app will be larger due to included binaries:
- yt-dlp: ~15-20 MB
- ffmpeg: ~60-80 MB
- Total additional size: ~80-100 MB

This is normal and expected for a self-contained application.
