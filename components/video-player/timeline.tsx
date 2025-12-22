"use client";

import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/video-utils";
import { Scissors } from "lucide-react";

interface TimelineProps {
  duration: number;
  startTime: number;
  endTime: number;
  onTimeChange: (start: number, end: number) => void;
}

export function Timeline({ duration, startTime, endTime, onTimeChange }: TimelineProps) {
  const handleValueChange = (values: number[]) => {
    const [start, end] = values;
    // Ensure minimum 1 second clip
    if (end - start >= 1) {
      onTimeChange(start, end);
    }
  };

  const clipDuration = endTime - startTime;

  return (
    <div className="w-full space-y-3">
      {/* Duration display */}
      <div className="flex items-center justify-end">
        <span className="text-[10px] text-[#635F69] font-medium">
          Duration: {formatTime(clipDuration)}
        </span>
      </div>

      {/* Slider and time displays */}
      <div className="space-y-3">
        <Slider
          min={0}
          max={duration || 100}
          step={0.1}
          value={[startTime, endTime]}
          onValueChange={handleValueChange}
          className="w-full"
          minStepsBetweenThumbs={1}
        />

        {/* Time display cards with Clay styling */}
        <div className="flex justify-between items-center gap-3">
          {/* Start time card */}
          <div className="flex-1 rounded-[20px] bg-white/60 backdrop-blur-xl px-3 py-2 shadow-clay-card">
            <p className="text-[10px] text-[#635F69] font-medium mb-0.5">Start</p>
            <p className="font-mono font-bold text-xs text-[#332F3A]">{formatTime(startTime)}</p>
          </div>

          {/* End time card */}
          <div className="flex-1 rounded-[20px] bg-white/60 backdrop-blur-xl px-3 py-2 shadow-clay-card">
            <p className="text-[10px] text-[#635F69] font-medium mb-0.5">End</p>
            <p className="font-mono font-bold text-xs text-[#332F3A]">{formatTime(endTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
