mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let _ = dotenvy::dotenv();
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      commands::download_clip,
      commands::get_video_metadata,
      commands::check_ytdlp,
      commands::check_ffmpeg,
      commands::get_device_id,
      commands::get_device_name,
      commands::activate_license,
      commands::verify_activation_token,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
