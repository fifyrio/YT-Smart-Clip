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
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] shadow-clay-button">
          <Video className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-heading text-sm font-bold text-[#332F3A]">Video Quality</h3>
          <p className="text-[10px] text-[#635F69]">Select resolution</p>
        </div>
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
                "relative rounded-clay-button p-2.5 text-left transition-all duration-300",
                isSelected && !isDisabled
                  ? "bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] shadow-clay-button scale-105"
                  : "bg-white/60 shadow-clay-pressed hover:bg-white/80 hover:-translate-y-1",
                isDisabled
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer active:scale-95"
              )}
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      "font-heading font-bold text-sm",
                      isSelected && !isDisabled ? "text-white" : "text-[#332F3A]",
                      isDisabled && "text-[#635F69]"
                    )}>
                      {quality.label}
                    </span>
                    {quality.isPro && (
                      <Crown className={cn(
                        "h-2.5 w-2.5",
                        isDisabled ? "text-[#635F69]" : isSelected ? "text-[#FBBF24]" : "text-[#F59E0B]"
                      )} />
                    )}
                  </div>
                  <p className={cn(
                    "text-[10px] mt-0.5 font-medium",
                    isSelected && !isDisabled ? "text-white/80" : "text-[#635F69]"
                  )}>
                    {quality.resolution}
                  </p>
                </div>
                {isSelected && !isDisabled && (
                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-clay-button">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#7C3AED]" />
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
          className="w-full rounded-clay-button bg-linear-to-br from-clay-warning/10 to-clay-warning/5 p-2 border-2 border-clay-warning/20 transition-all duration-300 hover:-translate-y-1 hover:border-clay-warning/40 hover:from-clay-warning/15 hover:to-clay-warning/10 active:scale-95"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#FBBF24] to-clay-warning shadow-clay-button">
              <Crown className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-heading text-xs font-bold text-[#92400E]">
                Upgrade to Pro
              </p>
              <p className="text-[10px] text-[#B45309]">
                Unlock HD & 4K quality
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
