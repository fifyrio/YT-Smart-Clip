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
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Scissors className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Clip Range</span>
        <span className="text-xs text-muted-foreground ml-auto">
          Duration: {formatTime(clipDuration)}
        </span>
      </div>

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

        <div className="flex justify-between items-center text-sm">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Start</p>
            <p className="font-mono font-medium">{formatTime(startTime)}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs text-muted-foreground">End</p>
            <p className="font-mono font-medium">{formatTime(endTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
