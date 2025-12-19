import { invoke } from "@tauri-apps/api/core";
import type { ClipOptions } from "./types";

/**
 * Download a YouTube video clip
 */
export async function downloadClip(params: {
  url: string;
  videoId: string;
  startTime: number;
  endTime: number;
  outputPath: string;
  formatId: string;
  options: ClipOptions;
}): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    const result = await invoke<{ success: boolean; filePath?: string; error?: string }>(
      "download_clip",
      params
    );
    return result;
  } catch (error) {
    console.error("Failed to download clip:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get video metadata from YouTube
 */
export async function getVideoMetadata(url: string): Promise<{
  title?: string;
  duration?: number;
  thumbnail?: string;
  error?: string;
}> {
  try {
    const result = await invoke<{
      title?: string;
      duration?: number;
      thumbnail?: string;
      error?: string;
    }>("get_video_metadata", { url });
    return result;
  } catch (error) {
    console.error("Failed to get video metadata:", error);
    return {
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Check if yt-dlp is installed
 */
export async function checkYtDlp(): Promise<boolean> {
  try {
    const result = await invoke<boolean>("check_ytdlp");
    return result;
  } catch (error) {
    console.error("Failed to check yt-dlp:", error);
    return false;
  }
}

/**
 * Check if ffmpeg is installed
 */
export async function checkFfmpeg(): Promise<boolean> {
  try {
    const result = await invoke<boolean>("check_ffmpeg");
    return result;
  } catch (error) {
    console.error("Failed to check ffmpeg:", error);
    return false;
  }
}
