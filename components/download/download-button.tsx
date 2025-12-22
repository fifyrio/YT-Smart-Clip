"use client";

import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { downloadClip, checkYtDlp } from "@/lib/tauri-commands";
import { isTauri, getTauriErrorMessage } from "@/lib/tauri-utils";
import type { ClipOptions } from "@/lib/types";

interface DownloadButtonProps {
  videoId: string | null;
  startTime: number;
  endTime: number;
  formatId: string;
  downloadDirectory: string;
  options: ClipOptions;
  disabled?: boolean;
}

export function DownloadButton({
  videoId,
  startTime,
  endTime,
  formatId,
  downloadDirectory,
  options,
  disabled,
}: DownloadButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTauriEnv, setIsTauriEnv] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  useEffect(() => {
    setIsTauriEnv(isTauri());
  }, []);

  const handleDownload = async () => {
    if (!videoId) {
      toast.error("No video selected");
      return;
    }

    if (!downloadDirectory) {
      toast.error("Please select a download directory");
      return;
    }

    if (!isTauriEnv) {
      toast.warning(getTauriErrorMessage());
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProgressText("Checking dependencies...");

    try {
      const hasYtDlp = await checkYtDlp();
      if (!hasYtDlp) {
        toast.error("yt-dlp is not installed. Please install it: brew install yt-dlp");
        setIsProcessing(false);
        return;
      }

      setProgress(10);
      setProgressText("Starting download...");

      // Simulate progress updates (in real implementation, you'd get these from backend events)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) {
            return prev + 5;
          }
          return prev;
        });
      }, 500);

      const result = await downloadClip({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        videoId,
        startTime,
        endTime,
        outputPath: downloadDirectory,
        formatId: formatId,
        options,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setProgressText("Complete!");

      if (result.success && result.filePath) {
        toast.success(`Clip saved successfully!`, {
          description: result.filePath,
          duration: 5000,
        });
      } else {
        toast.error(result.error || "Download failed");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error instanceof Error ? error.message : "Download failed");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setProgressText("");
      }, 1000);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        onClick={handleDownload}
        disabled={disabled || isProcessing || !videoId}
        className="group relative w-full overflow-hidden rounded-clay-button bg-linear-to-br from-clay-gradient-start to-clay-gradient-end px-4 py-2.5 font-heading text-sm font-bold text-white shadow-clay-button transition-all duration-200 hover:-translate-y-1 hover:shadow-clay-button-hover active:scale-[0.92] active:shadow-clay-pressed disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-clay-button disabled:active:scale-100"
      >
        {/* Progress bar background */}
        {isProcessing && (
          <div
            className="absolute inset-0 bg-white/20 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        )}

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{progressText || "Processing..."}</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Download Clip</span>
            </>
          )}
        </span>
      </button>

      {/* Progress percentage */}
      {isProcessing && (
        <div className="flex items-center justify-between text-[10px] text-clay-muted">
          <span>{progressText}</span>
          <span className="font-bold">{progress}%</span>
        </div>
      )}
    </div>
  );
}
