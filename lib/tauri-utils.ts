/**
 * Check if the app is running in a Tauri environment
 */
export function isTauri(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // Check for Tauri-specific globals
  return !!(window as any).__TAURI_INTERNALS__;
}

/**
 * Get a user-friendly error message if not running in Tauri
 */
export function getTauriErrorMessage(): string {
  return "This feature only works in the desktop app. Run: pnpm tauri:dev";
}
