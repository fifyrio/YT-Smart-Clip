"use client";

import { Video } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
}

const formats = [
  { id: "1080p-60", label: "1080p • 60fps", resolution: "1920x1080" },
  { id: "1080p-30", label: "1080p • 30fps", resolution: "1920x1080" },
  { id: "720p-60", label: "720p • 60fps", resolution: "1280x720" },
  { id: "720p-30", label: "720p • 30fps", resolution: "1280x720" },
  { id: "480p", label: "480p • 30fps", resolution: "854x480" },
];

export function FormatSelector({ selectedFormat, onFormatChange }: FormatSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Video className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Save Destination</span>
      </div>

      <Select value={selectedFormat} onValueChange={onFormatChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select quality" />
        </SelectTrigger>
        <SelectContent>
          {formats.map((format) => (
            <SelectItem key={format.id} value={format.id}>
              <div className="flex items-center justify-between w-full">
                <span>{format.label}</span>
                <span className="text-xs text-muted-foreground ml-4">
                  {format.resolution}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
