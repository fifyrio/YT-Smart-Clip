use serde::{Deserialize, Serialize};
use std::process::Command;
use tauri::command;
use tauri::{AppHandle, Manager};

#[derive(Debug, Serialize, Deserialize)]
pub struct ClipOptions {
    pub subtitles: bool,
    pub summary: bool,
    #[serde(rename = "removeSilence")]
    pub remove_silence: bool,
    #[serde(rename = "highQuality")]
    pub high_quality: bool,
}

#[derive(Debug, Serialize)]
pub struct DownloadResult {
    pub success: bool,
    #[serde(rename = "filePath", skip_serializing_if = "Option::is_none")]
    pub file_path: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct VideoMetadata {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumbnail: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

/// Get the path to a bundled binary (sidecar)
fn get_binary_path(app_handle: &AppHandle, binary_name: &str) -> Result<std::path::PathBuf, String> {
    // In development, try to use system binaries
    #[cfg(debug_assertions)]
    {
        // Check if system binary exists
        let check = Command::new("which")
            .arg(binary_name)
            .output();

        if let Ok(output) = check {
            if output.status.success() {
                let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
                if !path.is_empty() {
                    log::info!("Using system binary for {}: {}", binary_name, path);
                    return Ok(std::path::PathBuf::from(path));
                }
            }
        }
    }

    // In production or if system binary not found, use bundled sidecar
    let resource_path = app_handle.path()
        .resource_dir()
        .map_err(|e| format!("Failed to get resource dir: {}", e))?;

    let binary_path = resource_path.join(format!("binaries/{}", binary_name));

    if binary_path.exists() {
        log::info!("Using bundled binary for {}: {}", binary_name, binary_path.display());
        Ok(binary_path)
    } else {
        Err(format!("{} binary not found. Please ensure it's bundled with the app.", binary_name))
    }
}

/// Download and clip a YouTube video
#[command]
pub async fn download_clip(
    app_handle: AppHandle,
    url: String,
    video_id: String,
    start_time: f64,
    end_time: f64,
    output_path: String,
    format_id: String,
    options: ClipOptions,
) -> Result<DownloadResult, String> {
    log::info!("Starting download: {} ({}-{})", video_id, start_time, end_time);

    // Get yt-dlp binary path
    let ytdlp_path = match get_binary_path(&app_handle, "yt-dlp") {
        Ok(path) => path,
        Err(e) => {
            return Ok(DownloadResult {
                success: false,
                file_path: None,
                error: Some(format!("yt-dlp not found: {}", e)),
            });
        }
    };

    // Generate unique filename
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    let filename = format!("{}_{}.mp4", video_id, timestamp);
    let full_path = std::path::Path::new(&output_path).join(&filename);

    // Format times as HH:MM:SS
    let start_str = format_time(start_time);
    let end_str = format_time(end_time);

    // Build yt-dlp command
    let mut yt_dlp_args = vec![
        "--format".to_string(),
        format_id,
        "--download-sections".to_string(),
        format!("*{}-{}", start_str, end_str),
        "--force-keyframes-at-cuts".to_string(),
        "-o".to_string(),
        full_path.to_str().unwrap().to_string(),
    ];

    // Add subtitle options if needed
    if options.subtitles {
        yt_dlp_args.push("--write-subs".to_string());
        yt_dlp_args.push("--sub-lang".to_string());
        yt_dlp_args.push("en".to_string());
        yt_dlp_args.push("--embed-subs".to_string());
    }

    yt_dlp_args.push(url.clone());

    log::info!("Running yt-dlp with args: {:?}", yt_dlp_args);

    // Execute yt-dlp
    let output = Command::new(&ytdlp_path)
        .args(&yt_dlp_args)
        .output()
        .map_err(|e| format!("Failed to execute yt-dlp: {}", e))?;

    if !output.status.success() {
        let error_msg = String::from_utf8_lossy(&output.stderr);
        log::error!("yt-dlp failed: {}", error_msg);
        return Ok(DownloadResult {
            success: false,
            file_path: None,
            error: Some(format!("Download failed: {}", error_msg)),
        });
    }

    log::info!("Download completed: {}", full_path.display());

    Ok(DownloadResult {
        success: true,
        file_path: Some(full_path.to_str().unwrap().to_string()),
        error: None,
    })
}

/// Get video metadata from YouTube
#[command]
pub async fn get_video_metadata(app_handle: AppHandle, url: String) -> Result<VideoMetadata, String> {
    // Get yt-dlp binary path
    let ytdlp_path = match get_binary_path(&app_handle, "yt-dlp") {
        Ok(path) => path,
        Err(e) => {
            return Ok(VideoMetadata {
                title: None,
                duration: None,
                thumbnail: None,
                error: Some(format!("yt-dlp not found: {}", e)),
            });
        }
    };

    let output = Command::new(&ytdlp_path)
        .args(&[
            "--dump-json",
            "--no-playlist",
            &url,
        ])
        .output()
        .map_err(|e| format!("Failed to get metadata: {}", e))?;

    if !output.status.success() {
        return Ok(VideoMetadata {
            title: None,
            duration: None,
            thumbnail: None,
            error: Some("Failed to fetch video metadata".to_string()),
        });
    }

    let json_str = String::from_utf8_lossy(&output.stdout);
    let json: serde_json::Value = serde_json::from_str(&json_str)
        .map_err(|e| format!("Failed to parse metadata: {}", e))?;

    Ok(VideoMetadata {
        title: json["title"].as_str().map(String::from),
        duration: json["duration"].as_f64(),
        thumbnail: json["thumbnail"].as_str().map(String::from),
        error: None,
    })
}

/// Check if yt-dlp is installed
#[command]
pub fn check_ytdlp(app_handle: AppHandle) -> bool {
    match get_binary_path(&app_handle, "yt-dlp") {
        Ok(path) => {
            Command::new(&path)
                .arg("--version")
                .output()
                .map(|o| o.status.success())
                .unwrap_or(false)
        }
        Err(_) => false,
    }
}

/// Check if ffmpeg is installed
#[command]
pub fn check_ffmpeg(app_handle: AppHandle) -> bool {
    match get_binary_path(&app_handle, "ffmpeg") {
        Ok(path) => {
            Command::new(&path)
                .arg("-version")
                .output()
                .map(|o| o.status.success())
                .unwrap_or(false)
        }
        Err(_) => false,
    }
}

/// Format seconds to HH:MM:SS
fn format_time(seconds: f64) -> String {
    let total_secs = seconds as u64;
    let hours = total_secs / 3600;
    let minutes = (total_secs % 3600) / 60;
    let secs = total_secs % 60;
    format!("{:02}:{:02}:{:02}", hours, minutes, secs)
}
