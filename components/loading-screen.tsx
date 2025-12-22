"use client";

import { useEffect, useState } from "react";
import { Scissors } from "lucide-react";

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide loading screen after fonts and content are loaded
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F4F1FA]">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-[32px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] shadow-clay-button animate-clay-breathe">
            <Scissors className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* App name */}
        <h1
          className="text-2xl font-black text-[#332F3A]"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          YT Smart Clip
        </h1>

        {/* Loading indicator */}
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-[#7C3AED] animate-pulse" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 rounded-full bg-[#7C3AED] animate-pulse" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 rounded-full bg-[#7C3AED] animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
