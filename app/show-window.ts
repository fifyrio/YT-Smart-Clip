"use client";

import { getCurrentWindow } from "@tauri-apps/api/window";

let windowShown = false;

export function showWindow() {
  if (windowShown) return;

  // Check if running in Tauri environment
  if (typeof window !== "undefined" && "__TAURI__" in window) {
    // Small delay to ensure content is rendered
    setTimeout(async () => {
      try {
        const appWindow = getCurrentWindow();
        await appWindow.show();
        await appWindow.setFocus();
        windowShown = true;
      } catch (error) {
        console.error("Failed to show window:", error);
      }
    }, 100);
  }
}
