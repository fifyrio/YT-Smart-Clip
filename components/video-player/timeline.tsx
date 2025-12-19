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
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2">
        <Scissors className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium">Clip Range</span>
        <span className="text-[10px] text-muted-foreground ml-auto">
          Duration: {formatTime(clipDuration)}
        </span>
      </div>

      <div className="space-y-2">
        <Slider
          min={0}
          max={duration || 100}
          step={0.1}
          value={[startTime, endTime]}
          onValueChange={handleValueChange}
          className="w-full"
          minStepsBetweenThumbs={1}
        />

        <div className="flex justify-between items-center text-xs">
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground">Start</p>
            <p className="font-mono font-medium text-xs">{formatTime(startTime)}</p>
          </div>
          <div className="space-y-0.5 text-right">
            <p className="text-[10px] text-muted-foreground">End</p>
            <p className="font-mono font-medium text-xs">{formatTime(endTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
