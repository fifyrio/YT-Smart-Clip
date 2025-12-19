#!/bin/bash

echo "🚀 Setting up YT Smart Clip dependencies..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew not found. Please install it first:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

echo "✓ Homebrew found"

# Install yt-dlp
if ! command -v yt-dlp &> /dev/null; then
    echo "📦 Installing yt-dlp..."
    brew install yt-dlp
    echo "✅ yt-dlp installed"
else
    echo "✓ yt-dlp already installed ($(yt-dlp --version | head -1))"
fi

# Install ffmpeg (optional)
if ! command -v ffmpeg &> /dev/null; then
    echo "📦 Installing ffmpeg..."
    brew install ffmpeg
    echo "✅ ffmpeg installed"
else
    echo "✓ ffmpeg already installed ($(ffmpeg -version | head -1))"
fi

echo ""
echo "🎉 All dependencies installed!"
echo ""
echo "Next steps:"
echo "1. Run: npm run tauri:dev"
echo "2. Test the download functionality"
echo ""
