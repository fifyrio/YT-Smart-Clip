"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  videoId: string | null;
  onReady?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function VideoPlayer({ videoId, onReady, onTimeUpdate, onDurationChange }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onDurationChangeRef = useRef(onDurationChange);
  const onReadyRef = useRef(onReady);
  const onTimeUpdateRef = useRef(onTimeUpdate);

  // Update refs when callbacks change
  useEffect(() => {
    onDurationChangeRef.current = onDurationChange;
    onReadyRef.current = onReady;
    onTimeUpdateRef.current = onTimeUpdate;
  });

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
        onReady: (event: any) => {
          // Get video duration when player is ready
          const duration = event.target.getDuration();
          if (duration && onDurationChangeRef.current) {
            onDurationChangeRef.current(duration);
          }
          onReadyRef.current?.();
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
                onTimeUpdateRef.current?.(currentTime);
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
  }, [isPlayerReady, videoId]);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-border flex items-center justify-center">
        <img
          src="/animated-static.gif"
          alt="Preview animation"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-border">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
