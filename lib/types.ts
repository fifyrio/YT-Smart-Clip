export interface VideoMetadata {
  id: string;
  title: string;
  duration: number; // in seconds
  thumbnail: string;
  channel: string;
}

export interface VideoFormat {
  formatId: string;
  resolution: string;
  fps: number;
  extension: string;
  filesize?: number;
}

export interface ClipOptions {
  subtitles: boolean;
  summary: boolean;
  removeSilence: boolean;
  highQuality: boolean;
}

export interface ClipJob {
  id: string;
  url: string;
  startTime: string;
  endTime: string;
  formatId: string;
  options: ClipOptions;
  status: "pending" | "processing" | "ready" | "error" | "cancelled";
  filePath?: string;
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}
