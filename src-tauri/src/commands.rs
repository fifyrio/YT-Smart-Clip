use serde::{Deserialize, Serialize};
use std::process::Command;
use tauri::command;
use tauri::{AppHandle, Manager};
use reqwest::Client;

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

#[derive(Debug, Serialize, Deserialize)]
pub struct ActivateLicenseRequest {
    #[serde(rename = "licenseKey")]
    pub license_key: String,
    #[serde(rename = "deviceHash")]
    pub device_hash: String,
    #[serde(rename = "deviceName")]
    pub device_name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ActivateLicenseResponse {
    #[serde(rename = "activationToken")]
    pub activation_token: String,
    pub plan: String,
    #[serde(rename = "expiresAt")]
    pub expires_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VerifyTokenResponse {
    pub valid: bool,
    #[serde(rename = "licenseId", skip_serializing_if = "Option::is_none")]
    pub license_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub plan: Option<String>,
    #[serde(rename = "expiresAt", skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct LicenseError {
    pub error: String,
}

fn license_api_url() -> String {
    std::env::var("LICENSE_API_URL").unwrap_or_else(|_| {
        if cfg!(debug_assertions) {
            "http://localhost:3000/api/license/activate".to_string()
        } else {
            "https://ytsmartclip.org/api/license/activate".to_string()
        }
    })
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

    // In production or if system binary not found, use bundled binary from resources
    let resource_path = app_handle.path()
        .resource_dir()
        .map_err(|e| format!("Failed to get resource dir: {}", e))?;

    // Try different possible locations for the binary
    let possible_paths = vec![
        resource_path.join(format!("binaries/{}", binary_name)),
        resource_path.join(binary_name),
        resource_path.join(format!("../Resources/binaries/{}", binary_name)),
    ];

    log::info!("Searching for {} in resource directory: {}", binary_name, resource_path.display());

    for binary_path in possible_paths {
        log::info!("Checking path: {}", binary_path.display());
        if binary_path.exists() {
            log::info!("Found bundled binary for {}: {}", binary_name, binary_path.display());
            return Ok(binary_path);
        }
    }

    // List contents of resource directory for debugging
    if let Ok(entries) = std::fs::read_dir(&resource_path) {
        log::info!("Resource directory contents:");
        for entry in entries.flatten() {
            log::info!("  - {}", entry.path().display());
        }
    }

    Err(format!(
        "{} binary not found in resource directory: {}. Please ensure it's bundled with the app.",
        binary_name,
        resource_path.display()
    ))
}

/// Convert quality ID to yt-dlp format selector
fn quality_to_format(quality: &str) -> String {
    match quality {
        "360p" => "bestvideo[height<=360]+bestaudio/best[height<=360]".to_string(),
        "480p" => "bestvideo[height<=480]+bestaudio/best[height<=480]".to_string(),
        "720p" => "bestvideo[height<=720]+bestaudio/best[height<=720]".to_string(),
        "1080p" => "bestvideo[height<=1080]+bestaudio/best[height<=1080]".to_string(),
        "1440p" => "bestvideo[height<=1440]+bestaudio/best[height<=1440]".to_string(),
        "2160p" => "bestvideo[height<=2160]+bestaudio/best[height<=2160]".to_string(),
        _ => "best".to_string(), // fallback to best quality
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
    log::info!("Starting download: {} ({}-{}) with quality: {}", video_id, start_time, end_time, format_id);

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

    // Convert quality to yt-dlp format selector
    let format_selector = quality_to_format(&format_id);
    log::info!("Using format selector: {}", format_selector);

    // Build yt-dlp command
    let mut yt_dlp_args = vec![
        "--format".to_string(),
        format_selector,
        "--merge-output-format".to_string(),
        "mp4".to_string(),
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

/// Activate a license key via the license API
#[command]
pub async fn activate_license(request: ActivateLicenseRequest) -> Result<ActivateLicenseResponse, String> {
    let client = Client::new();
    let response = client
        .post(license_api_url())
        .json(&request)
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    let status = response.status();
    let body = response
        .text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))?;

    if !status.is_success() {
        if let Ok(error_payload) = serde_json::from_str::<LicenseError>(&body) {
            return Err(error_payload.error);
        }
        log::error!(
            "License activation failed: status={}, body={}",
            status.as_u16(),
            body
        );
        return Err("Failed to activate license".to_string());
    }

    serde_json::from_str::<ActivateLicenseResponse>(&body)
        .map_err(|e| format!("Failed to parse activation response: {}", e))
}

/// Verify a license activation token via the license API
#[command]
pub async fn verify_activation_token(token: String) -> Result<VerifyTokenResponse, String> {
    let client = Client::new();
    let response = client
        .get(license_api_url())
        .bearer_auth(token)
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    let status = response.status();
    let body = response
        .text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))?;

    if status.is_success() {
        return serde_json::from_str::<VerifyTokenResponse>(&body)
            .map_err(|e| format!("Failed to parse verification response: {}", e));
    }

    if let Ok(error_payload) = serde_json::from_str::<VerifyTokenResponse>(&body) {
        return Ok(error_payload);
    }

    Ok(VerifyTokenResponse {
        valid: false,
        license_id: None,
        plan: None,
        expires_at: None,
        error: Some("Failed to verify token".to_string()),
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

/// Get device ID (SHA-256 hash of hardware identifiers)
#[command]
pub fn get_device_id() -> Result<String, String> {
    #[cfg(target_os = "macos")]
    {
        use std::process::Command;
        use sha2::{Sha256, Digest};

        // Get hardware UUID
        let hardware_uuid = Command::new("ioreg")
            .args(&["-d2", "-c", "IOPlatformExpertDevice"])
            .output()
            .map_err(|e| format!("Failed to get hardware UUID: {}", e))?;

        let hw_output = String::from_utf8_lossy(&hardware_uuid.stdout);
        let hw_uuid = hw_output
            .lines()
            .find(|line| line.contains("IOPlatformUUID"))
            .and_then(|line| {
                line.split('"')
                    .nth(3)
            })
            .unwrap_or("unknown-uuid");

        // Get serial number
        let serial_num = Command::new("ioreg")
            .args(&["-l"])
            .output()
            .map_err(|e| format!("Failed to get serial number: {}", e))?;

        let sn_output = String::from_utf8_lossy(&serial_num.stdout);
        let serial = sn_output
            .lines()
            .find(|line| line.contains("IOPlatformSerialNumber"))
            .and_then(|line| {
                line.split('"')
                    .nth(3)
            })
            .unwrap_or("unknown-serial");

        // Combine and hash
        let device_string = format!("{}-{}", hw_uuid, serial);
        let mut hasher = Sha256::new();
        hasher.update(device_string.as_bytes());
        let result = hasher.finalize();

        Ok(format!("{:x}", result))
    }

    #[cfg(not(target_os = "macos"))]
    {
        // For other platforms, use a simple fallback
        use sha2::{Sha256, Digest};
        let hostname = hostname::get()
            .map(|h| h.to_string_lossy().to_string())
            .unwrap_or_else(|_| "unknown".to_string());

        let mut hasher = Sha256::new();
        hasher.update(hostname.as_bytes());
        let result = hasher.finalize();

        Ok(format!("{:x}", result))
    }
}

/// Get human-readable device name
#[command]
pub fn get_device_name() -> Result<String, String> {
    #[cfg(target_os = "macos")]
    {
        use std::process::Command;

        // Get computer name
        let output = Command::new("scutil")
            .args(&["--get", "ComputerName"])
            .output()
            .map_err(|e| format!("Failed to get device name: {}", e))?;

        if output.status.success() {
            let name = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !name.is_empty() {
                return Ok(name);
            }
        }

        Ok("Mac".to_string())
    }

    #[cfg(not(target_os = "macos"))]
    {
        hostname::get()
            .map(|h| h.to_string_lossy().to_string())
            .or(Ok("Unknown Device".to_string()))
    }
}
