"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { downloadClip, checkYtDlp } from "@/lib/tauri-commands";
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

  const handleDownload = async () => {
    if (!videoId) {
      toast.error("No video selected");
      return;
    }

    if (!downloadDirectory) {
      toast.error("Please select a download directory");
      return;
    }

    setIsProcessing(true);
    toast.info("Checking dependencies...");

    try {
      // Check if running in Tauri
      if (typeof window !== "undefined" && !(window as any).__TAURI__) {
        toast.warning("Download only works in desktop app. Run: npm run tauri:dev");
        setIsProcessing(false);
        return;
      }

      // Check if yt-dlp is installed
      const hasYtDlp = await checkYtDlp();
      if (!hasYtDlp) {
        toast.error("yt-dlp is not installed. Please install it: brew install yt-dlp");
        setIsProcessing(false);
        return;
      }

      toast.info("Downloading and clipping video...");

      // Call Tauri command to download
      const result = await downloadClip({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        videoId,
        startTime,
        endTime,
        outputPath: downloadDirectory,
        formatId: "best",
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
    <Button
      size="lg"
      className="w-full"
      onClick={handleDownload}
      disabled={disabled || isProcessing || !videoId}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Download className="mr-2 h-5 w-5" />
          Download Clip
        </>
      )}
    </Button>
  );
}
