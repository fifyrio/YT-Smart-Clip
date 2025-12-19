"use client";

import { useState } from "react";
import { URLInput } from "@/components/editor/url-input";
import { VideoPlayer } from "@/components/video-player/video-player";
import { Timeline } from "@/components/video-player/timeline";
import { FormatSelector } from "@/components/editor/format-selector";
import { ProcessingOptions } from "@/components/editor/processing-options";
import { DownloadButton } from "@/components/download/download-button";
import { X } from "lucide-react";
import type { ClipOptions } from "@/lib/types";

export default function Home() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [duration, setDuration] = useState(100);
  const [startTime, setStartTime] = useState(14);
  const [endTime, setEndTime] = useState(88);
  const [selectedFormat, setSelectedFormat] = useState("1080p-60");
  const [options, setOptions] = useState<ClipOptions>({
    subtitles: false,
    summary: true,
    removeSilence: false,
    highQuality: true,
  });

  const handleVideoLoad = (id: string) => {
    setVideoId(id);
    // TODO: Fetch actual duration from YouTube API
    setDuration(100);
  };

  const handleTimeChange = (start: number, end: number) => {
    setStartTime(start);
    setEndTime(end);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="ml-3 font-semibold">YT Smart Clip</span>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video Player & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <URLInput onVideoLoad={handleVideoLoad} />

            <div className="space-y-4">
              <label className="text-sm font-medium text-muted-foreground">
                Preview
              </label>
              <VideoPlayer videoId={videoId} />
            </div>

            <div className="p-6 rounded-lg bg-card border border-border">
              <Timeline
                duration={duration}
                startTime={startTime}
                endTime={endTime}
                onTimeChange={handleTimeChange}
              />
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-card border border-border">
              <FormatSelector
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
              />
            </div>

            <div className="p-6 rounded-lg bg-card border border-border">
              <ProcessingOptions
                options={options}
                onOptionsChange={setOptions}
              />
            </div>

            <DownloadButton
              videoId={videoId}
              startTime={startTime}
              endTime={endTime}
              formatId={selectedFormat}
            />

            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-600 dark:text-yellow-500 flex items-center gap-2">
                <span className="font-semibold">⚠️ View AI Summary</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
