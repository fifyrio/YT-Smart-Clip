"use client";

import { Video, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
  isPro?: boolean;
}

const qualities = [
  { id: "360p", label: "360p", resolution: "640x360", isPro: false },
  { id: "480p", label: "480p", resolution: "854x480", isPro: false },
  { id: "720p", label: "720p", resolution: "1280x720", isPro: false },
  { id: "1080p", label: "1080p", resolution: "1920x1080", isPro: true },
  { id: "1440p", label: "1440p", resolution: "2560x1440", isPro: true },
  { id: "2160p", label: "2160p (4K)", resolution: "3840x2160", isPro: true },
];

export function FormatSelector({ selectedFormat, onFormatChange, isPro = false }: FormatSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Video className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Video Quality</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {qualities.map((quality) => {
          const isDisabled = quality.isPro && !isPro;
          const isSelected = selectedFormat === quality.id;

          return (
            <button
              key={quality.id}
              onClick={() => !isDisabled && onFormatChange(quality.id)}
              disabled={isDisabled}
              className={cn(
                "relative p-3 rounded-lg border text-left transition-all",
                isSelected && !isDisabled
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50",
                isDisabled
                  ? "opacity-50 cursor-not-allowed bg-muted/30"
                  : "hover:bg-accent/50 cursor-pointer"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "font-medium text-sm",
                      isDisabled && "text-muted-foreground"
                    )}>
                      {quality.label}
                    </span>
                    {quality.isPro && (
                      <Crown className={cn(
                        "h-3 w-3",
                        isDisabled ? "text-muted-foreground" : "text-yellow-500"
                      )} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {quality.resolution}
                  </p>
                </div>
                {isSelected && !isDisabled && (
                  <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!isPro && (
        <div className="mt-3 p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-xs text-yellow-600 dark:text-yellow-500">
            <Crown className="h-3 w-3 inline mr-1" />
            Upgrade to Pro for HD & 4K quality
          </p>
        </div>
      )}
    </div>
  );
}
