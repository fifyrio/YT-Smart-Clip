"use client";

import { useState, useCallback, useEffect } from "react";
import { URLInput } from "@/components/editor/url-input";
import { VideoPlayer } from "@/components/video-player/video-player";
import { Timeline } from "@/components/video-player/timeline";
import { FormatSelector } from "@/components/editor/format-selector";
import { DirectorySelector } from "@/components/editor/directory-selector";
import { ProcessingOptions } from "@/components/editor/processing-options";
import { DownloadButton } from "@/components/download/download-button";
import { UpgradeDialog } from "@/components/upgrade/upgrade-dialog";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { Scissors, Settings, Crown } from "lucide-react";
import type { ClipOptions } from "@/lib/types";
import { getStoredActivationToken } from "@/lib/license-api";
import { showWindow } from "./show-window";

export default function Home() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState("360p");
  const [downloadDirectory, setDownloadDirectory] = useState<string>("");
  const [isPro, setIsPro] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [options, setOptions] = useState<ClipOptions>({
    subtitles: false,
    summary: true,
    removeSilence: false,
    highQuality: true,
  });

  const handleVideoLoad = useCallback((id: string) => {
    setVideoId(id);
  }, []);

  const handleDurationChange = useCallback((newDuration: number) => {
    setDuration(newDuration);
    const defaultStart = Math.floor(newDuration * 0.1);
    const defaultEnd = Math.floor(newDuration * 0.9);
    setStartTime(defaultStart);
    setEndTime(defaultEnd);
  }, []);

  const handleTimeChange = useCallback((start: number, end: number) => {
    setStartTime(start);
    setEndTime(end);
  }, []);

  // Check for activation token on mount
  useEffect(() => {
    const checkActivation = () => {
      const token = getStoredActivationToken();
      if (token) {
        // Token exists, mark as Pro
        // TODO: In the future, verify token signature offline
        setIsPro(true);
        localStorage.setItem("isPro", "true");
      }
    };

    checkActivation();
  }, []);

  // Show window after initial render
  useEffect(() => {
    showWindow();
  }, []);

  const handleActivateSuccess = useCallback(() => {
    setIsPro(true);
    localStorage.setItem("isPro", "true");
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F4F1FA]">
      {/* Floating Background Blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[60vh] w-[60vh] rounded-full bg-[#8B5CF6]/10 blur-3xl animate-clay-float" />
        <div className="absolute -right-[10%] top-[20%] h-[60vh] w-[60vh] rounded-full bg-[#EC4899]/10 blur-3xl animate-clay-float-delayed animation-delay-2000" />
        <div className="absolute bottom-[10%] left-[40%] h-[50vh] w-[50vh] rounded-full bg-[#0EA5E9]/10 blur-3xl animate-clay-float-slow animation-delay-4000" />
      </div>

      {/* Header with Clay Design - Compact */}
      <header className="relative backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between rounded-[32px] bg-white/60 px-5 shadow-clay-card backdrop-blur-xl mt-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-clay-gradient-start to-clay-gradient-end shadow-clay-button">
                <Scissors className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-lg font-black tracking-tight text-clay-foreground">
                  YT Smart Clip
                </h1>
                {isPro && (
                  <div className="flex items-center gap-1 rounded-full bg-linear-to-br from-[#FBBF24] to-clay-warning px-2 py-0.5 shadow-clay-button">
                    <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-heading text-[10px] font-black text-white">
                      PRO
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Get Pro Button - Only show when not Pro */}
              {!isPro && (
                <button
                  onClick={() => setIsUpgradeDialogOpen(true)}
                  className="flex h-9 items-center gap-1.5 rounded-full bg-linear-to-br from-[#A78BFA] to-[#7C3AED] px-3 shadow-clay-button transition-all duration-200 hover:-translate-y-1 hover:shadow-clay-button-hover active:scale-[0.92] active:shadow-clay-pressed"
                  aria-label="Get Pro"
                >
                  <Crown className="h-3.5 w-3.5 text-white" />
                  <span className="font-heading text-xs font-bold text-white">
                    Get Pro
                  </span>
                </button>
              )}

              {/* Settings Button */}
              <button
                onClick={() => setIsSettingsDialogOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 shadow-clay-button transition-all duration-200 hover:-translate-y-1 hover:shadow-clay-button-hover active:scale-[0.92] active:shadow-clay-pressed"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4 text-clay-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Compact */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Video Player & Timeline */}
          <div className="lg:col-span-2 space-y-4">
            {/* URL Input Card */}
            <div className="rounded-clay-card bg-white/70 p-4 shadow-clay-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-clay-card-hover">
              <URLInput onVideoLoad={handleVideoLoad} />
            </div>

            {/* Video Player Card */}
            <div className="rounded-clay-card bg-white/70 p-4 shadow-clay-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-clay-card-hover">
              <div className="mb-2">
                <h2 className="font-heading text-base font-bold text-[#332F3A]">
                  Preview
                </h2>
                <p className="text-xs text-[#635F69]">
                  Watch and select the perfect clip
                </p>
              </div>
              <VideoPlayer
                videoId={videoId}
                onDurationChange={handleDurationChange}
              />
            </div>

            {/* Timeline Card */}
            <div className="rounded-clay-card bg-white/70 p-4 shadow-clay-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-clay-card-hover">
              <div className="mb-2">
                <h2 className="font-heading text-base font-bold text-[#332F3A]">
                  Clip Range
                </h2>
                <p className="text-xs text-[#635F69]">
                  Drag to select start and end points
                </p>
              </div>
              <Timeline
                duration={duration}
                startTime={startTime}
                endTime={endTime}
                onTimeChange={handleTimeChange}
              />
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-3">
            {/* Video Quality Card */}
            <div className="rounded-clay-card bg-white/70 p-4 shadow-clay-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-clay-card-hover">
              <FormatSelector
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
                isPro={isPro}
                onUpgradeClick={() => setIsUpgradeDialogOpen(true)}
              />
            </div>

            {/* Save Destination Card */}
            <div className="rounded-clay-card bg-white/70 p-4 shadow-clay-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-clay-card-hover">
              <DirectorySelector
                onDirectoryChange={setDownloadDirectory}
              />
            </div>

            {/* Download Button */}
            <DownloadButton
              videoId={videoId}
              startTime={startTime}
              endTime={endTime}
              formatId={selectedFormat}
              downloadDirectory={downloadDirectory}
              options={options}
            />

            {/* AI Summary Teaser */}
            <div className="rounded-clay-button bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5 p-3 border-2 border-[#F59E0B]/20 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FBBF24] to-[#F59E0B]">
                  <span className="text-xs font-bold text-white">✨</span>
                </div>
                <div className="flex-1">
                  <p className="font-heading text-xs font-bold text-[#92400E]">
                    AI Summary Coming Soon
                  </p>
                  <p className="text-[10px] text-[#B45309]">
                    Get smart insights from your clips
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Upgrade Dialog */}
      <UpgradeDialog
        isOpen={isUpgradeDialogOpen}
        onClose={() => setIsUpgradeDialogOpen(false)}
        onActivateSuccess={handleActivateSuccess}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
      />
    </div>
  );
}
