"use client";

import { getCurrentWindow } from "@tauri-apps/api/window";

let windowShown = false;

export function showWindow() {
  if (windowShown) return;

  if (typeof window !== "undefined" && window.__TAURI__) {
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
