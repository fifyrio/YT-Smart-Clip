"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileCheck } from "lucide-react";
import { toast } from "sonner";

interface DownloadButtonProps {
  videoId: string | null;
  startTime: number;
  endTime: number;
  formatId: string;
  disabled?: boolean;
}

export function DownloadButton({
  videoId,
  startTime,
  endTime,
  formatId,
  disabled,
}: DownloadButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownload = async () => {
    if (!videoId) {
      toast.error("No video selected");
      return;
    }

    setIsProcessing(true);
    toast.info("Starting clip processing...");

    // TODO: Implement actual Tauri command call
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Clip downloaded successfully!");
    }, 3000);
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
