"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";
import { extractVideoId } from "@/lib/video-utils";
import { toast } from "sonner";

interface URLInputProps {
  onVideoLoad: (videoId: string) => void;
}

export function URLInput({ onVideoLoad }: URLInputProps) {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    const videoId = extractVideoId(value);
    setIsValid(!!videoId);

    if (videoId) {
      onVideoLoad(videoId);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleUrlChange(text);
      toast.success("URL pasted from clipboard");
    } catch (error) {
      toast.error("Failed to read clipboard");
    }
  };

  const handleClear = () => {
    setUrl("");
    setIsValid(false);
  };

  return (
    <div className="w-full space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        YouTube URL
      </label>
      <div className="relative">
        <Input
          type="text"
          placeholder="https://www.youtube.com/watch?v=XXXXX"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          className={`pr-20 ${
            url && !isValid ? "border-destructive" : ""
          } ${isValid ? "border-primary" : ""}`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          {url && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={handlePaste}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
