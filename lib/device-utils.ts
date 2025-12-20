/**
 * Device identification utilities for license activation
 * Based on: https://ytsmartclip.org/docs/LICENSE_ACTIVATION_API.md
 */

import { invoke } from "@tauri-apps/api/core";
import { isTauri } from "./tauri-utils";

/**
 * Generate a unique device hash for license activation
 * Uses hardware UUID and serial number on macOS
 * @returns SHA-256 hash of device identifiers
 */
export async function generateDeviceHash(): Promise<string> {
  if (!isTauri()) {
    // In browser/dev mode, use a stable mock hash based on user agent
    const mockString = `browser-${navigator.userAgent}-${navigator.platform}`;
    return hashString(mockString);
  }

  try {
    // Call Tauri command to get hardware identifiers
    const deviceId = await invoke<string>("get_device_id");
    return deviceId;
  } catch (error) {
    console.error("Failed to generate device hash:", error);
    // Fallback to browser-based hash
    const fallbackString = `fallback-${navigator.userAgent}-${Date.now()}`;
    return hashString(fallbackString);
  }
}

/**
 * Get a human-readable device name
 * @returns Device name (e.g., "John's MacBook Pro")
 */
export async function getDeviceName(): Promise<string> {
  if (!isTauri()) {
    return `${navigator.platform} Browser`;
  }

  try {
    const deviceName = await invoke<string>("get_device_name");
    return deviceName;
  } catch (error) {
    console.error("Failed to get device name:", error);
    return "Unknown Device";
  }
}

/**
 * Hash a string using SHA-256 (Web Crypto API)
 * @param input String to hash
 * @returns Hex-encoded SHA-256 hash
 */
async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
