"use client";

import { Switch } from "@/components/ui/switch";
import { Sparkles, FileText, VolumeX } from "lucide-react";
import type { ClipOptions } from "@/lib/types";

interface ProcessingOptionsProps {
  options: ClipOptions;
  onOptionsChange: (options: ClipOptions) => void;
}

export function ProcessingOptions({ options, onOptionsChange }: ProcessingOptionsProps) {
  const handleToggle = (key: keyof ClipOptions) => {
    onOptionsChange({
      ...options,
      [key]: !options[key],
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-sm font-medium">Processing Options</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">AI Summary</p>
              <p className="text-xs text-muted-foreground">
                Generate smart summary
              </p>
            </div>
          </div>
          <Switch
            checked={options.summary}
            onCheckedChange={() => handleToggle("summary")}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Add Subtitle</p>
              <p className="text-xs text-muted-foreground">
                Burn-in video subtitles
              </p>
            </div>
          </div>
          <Switch
            checked={options.subtitles}
            onCheckedChange={() => handleToggle("subtitles")}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <VolumeX className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Remove Silence</p>
              <p className="text-xs text-muted-foreground">
                Cut silent moments
              </p>
            </div>
          </div>
          <Switch
            checked={options.removeSilence}
            onCheckedChange={() => handleToggle("removeSilence")}
          />
        </div>
      </div>
    </div>
  );
}
