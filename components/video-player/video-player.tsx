"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  videoId: string | null;
  onReady?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function VideoPlayer({ videoId, onReady, onTimeUpdate }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      setIsPlayerReady(true);
    };

    if (window.YT && window.YT.Player) {
      setIsPlayerReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isPlayerReady || !videoId || !containerRef.current) return;

    // Initialize player
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: videoId,
      playerVars: {
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          onReady?.();
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            // Start time tracking
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(() => {
              if (playerRef.current && playerRef.current.getCurrentTime) {
                const currentTime = playerRef.current.getCurrentTime();
                onTimeUpdate?.(currentTime);
              }
            }, 100);
          } else {
            // Stop time tracking
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        },
      },
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [isPlayerReady, videoId, onReady, onTimeUpdate]);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-card rounded-lg border border-border flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Play className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">No video loaded</p>
            <p className="text-xs text-muted-foreground">
              Enter a YouTube URL to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-border">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
