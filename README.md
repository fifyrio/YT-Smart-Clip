# YT Smart Clip

A modern desktop application for clipping YouTube videos with AI-powered features. Built with Next.js, React, and Tauri.

## ✨ Features

- 🎥 **YouTube Video Preview** - Load and preview YouTube videos directly in the app
- ✂️ **Smart Clipping** - Select precise start and end times with an intuitive timeline slider
- 🎨 **Format Selection** - Choose from multiple quality options (1080p, 720p, etc.)
- 🤖 **AI Summary** - Generate smart summaries of video content
- 📝 **Subtitle Support** - Burn subtitles directly into clips
- 🔇 **Remove Silence** - Automatically cut silent moments from clips
- 🌙 **Dark Mode** - Beautiful dark theme optimized for extended use
- 💻 **Cross-platform** - Works on macOS, Windows, and Linux

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js 16](https://nextjs.org/) with React 19
- **Desktop Framework**: [Tauri 2](https://v2.tauri.app/) (Rust)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Rust (for Tauri)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/yt-smart-clip.git
cd yt-smart-clip
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building the Desktop App

To build the Tauri desktop application:

```bash
npm run tauri dev   # Development mode
npm run tauri build # Production build
```

## 📁 Project Structure

```
yt-smart-clip/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Main editor page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Shadcn UI components
│   ├── editor/              # Editor-specific components
│   │   ├── url-input.tsx
│   │   ├── format-selector.tsx
│   │   └── processing-options.tsx
│   ├── video-player/        # Video player components
│   │   ├── video-player.tsx
│   │   └── timeline.tsx
│   ├── download/
│   │   └── download-button.tsx
│   └── theme-provider.tsx
├── lib/
│   ├── types.ts             # TypeScript type definitions
│   ├── video-utils.ts       # Video utility functions
│   └── utils.ts             # General utilities
└── src-tauri/               # Tauri backend (to be implemented)
    ├── src/
    │   ├── main.rs
    │   └── commands/
    └── Cargo.toml
```

## 🎯 Current Status

### ✅ Completed
- Project initialization with Next.js + Tauri
- UI components implementation
- Main page layout matching design
- YouTube URL input with validation
- Video player with YouTube iframe API
- Timeline slider for clip selection
- Format selector
- Processing options panel
- Download button UI

### 🚧 In Progress / TODO
- [ ] Implement Tauri backend integration
- [ ] Add yt-dlp integration for video downloading
- [ ] Add ffmpeg integration for video processing
- [ ] Implement local SQLite database
- [ ] Add AI summary generation (OpenAI/Anthropic API)
- [ ] Add subtitle burning functionality
- [ ] Add silence removal feature
- [ ] Package for macOS, Windows, and Linux
- [ ] Add cloud sync (optional)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Inspired by the [youtube-clipper](https://github.com/yourusername/youtube-clipper) project
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- Built with [Next.js](https://nextjs.org/) and [Tauri](https://tauri.app/)
