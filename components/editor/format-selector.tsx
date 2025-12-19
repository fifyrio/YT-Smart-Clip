"use client";

import { Video, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
  isPro?: boolean;
  onUpgradeClick?: () => void;
}

const qualities = [
  { id: "360p", label: "360p", resolution: "640x360", isPro: false },
  { id: "480p", label: "480p", resolution: "854x480", isPro: false },
  { id: "720p", label: "720p", resolution: "1280x720", isPro: false },
  { id: "1080p", label: "1080p", resolution: "1920x1080", isPro: true },
  { id: "1440p", label: "1440p", resolution: "2560x1440", isPro: true },
  { id: "2160p", label: "2160p (4K)", resolution: "3840x2160", isPro: true },
];

export function FormatSelector({ selectedFormat, onFormatChange, isPro = false, onUpgradeClick }: FormatSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] shadow-clay-button">
          <Video className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-[#332F3A]">Video Quality</h3>
          <p className="text-xs text-[#635F69]">Select your preferred resolution</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {qualities.map((quality) => {
          const isDisabled = quality.isPro && !isPro;
          const isSelected = selectedFormat === quality.id;

          return (
            <button
              key={quality.id}
              onClick={() => !isDisabled && onFormatChange(quality.id)}
              disabled={isDisabled}
              className={cn(
                "relative rounded-[20px] p-4 text-left transition-all duration-300",
                isSelected && !isDisabled
                  ? "bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] shadow-clay-button scale-105"
                  : "bg-white/60 shadow-clay-pressed hover:bg-white/80 hover:-translate-y-1",
                isDisabled
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer active:scale-95"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "font-heading font-bold text-base",
                      isSelected && !isDisabled ? "text-white" : "text-[#332F3A]",
                      isDisabled && "text-[#635F69]"
                    )}>
                      {quality.label}
                    </span>
                    {quality.isPro && (
                      <Crown className={cn(
                        "h-3.5 w-3.5",
                        isDisabled ? "text-[#635F69]" : isSelected ? "text-[#FBBF24]" : "text-[#F59E0B]"
                      )} />
                    )}
                  </div>
                  <p className={cn(
                    "text-xs mt-0.5 font-medium",
                    isSelected && !isDisabled ? "text-white/80" : "text-[#635F69]"
                  )}>
                    {quality.resolution}
                  </p>
                </div>
                {isSelected && !isDisabled && (
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-clay-button">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#7C3AED]" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!isPro && (
        <button
          onClick={onUpgradeClick}
          className="w-full rounded-clay-button bg-linear-to-br from-clay-warning/10 to-clay-warning/5 p-3 border-2 border-clay-warning/20 transition-all duration-300 hover:-translate-y-1 hover:border-clay-warning/40 hover:from-clay-warning/15 hover:to-clay-warning/10 active:scale-95"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#FBBF24] to-clay-warning shadow-clay-button">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-heading text-sm font-bold text-[#92400E]">
                Upgrade to Pro
              </p>
              <p className="text-xs text-[#B45309]">
                Unlock HD & 4K quality exports
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
