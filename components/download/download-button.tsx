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
    toast.info("Checking dependencies...");

    try {
      const hasYtDlp = await checkYtDlp();
      if (!hasYtDlp) {
        toast.error("yt-dlp is not installed. Please install it: brew install yt-dlp");
        setIsProcessing(false);
        return;
      }

      toast.info("Downloading and clipping video...");

      const result = await downloadClip({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        videoId,
        startTime,
        endTime,
        outputPath: downloadDirectory,
        formatId: formatId,
        options,
      });

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
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || isProcessing || !videoId}
      className="group relative w-full rounded-clay-button bg-linear-to-br from-clay-gradient-start to-clay-gradient-end px-8 py-4 font-heading text-lg font-bold text-white shadow-clay-button transition-all duration-200 hover:-translate-y-1 hover:shadow-clay-button-hover active:scale-[0.92] active:shadow-clay-pressed disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-clay-button disabled:active:scale-100"
    >
      <span className="flex items-center justify-center gap-3">
        {isProcessing ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Download className="h-6 w-6" />
            <span>Download Clip</span>
          </>
        )}
      </span>
    </button>
  );
}
