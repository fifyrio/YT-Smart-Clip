# 视频下载功能设置指南

## ✅ 已实现的功能

现在点击 "Download Clip" 按钮会**真正下载视频**！

### 实现的内容

1. **Tauri 后端命令** (Rust)
   - `download_clip` - 下载和剪辑 YouTube 视频
   - `get_video_metadata` - 获取视频信息
   - `check_ytdlp` - 检查 yt-dlp 是否已安装
   - `check_ffmpeg` - 检查 ffmpeg 是否已安装

2. **前端集成**
   - Tauri 命令调用函数
   - 下载按钮连接到真实的后端
   - 下载目录选择器
   - 处理选项传递

3. **完整的下载流程**
   ```
   用户点击按钮
   → 检查 yt-dlp 是否安装
   → 调用 Rust 后端
   → 执行 yt-dlp 下载视频片段
   → 保存到用户选择的目录
   → 显示成功通知
   ```

## 🛠️ 安装依赖

### 1. 安装 yt-dlp

macOS:
```bash
brew install yt-dlp
```

或者使用 pip:
```bash
pip install yt-dlp
```

验证安装:
```bash
yt-dlp --version
```

### 2. 安装 ffmpeg（可选，用于高级处理）

macOS:
```bash
brew install ffmpeg
```

验证安装:
```bash
ffmpeg -version
```

## 🚀 使用步骤

### 1. 启动 Tauri 开发模式

```bash
npm run tauri:dev
```

这会打开一个桌面应用窗口。

### 2. 使用应用

1. **输入 YouTube URL**
   - 粘贴任意 YouTube 视频链接
   - 应用会自动验证

2. **选择剪辑范围**
   - 使用时间轴滑块选择开始和结束时间
   - 实时显示剪辑时长

3. **选择保存位置**
   - 点击 "Choose" 按钮
   - 选择保存目录（默认：~/Downloads）

4. **配置选项**
   - ✅ AI Summary - AI 生成摘要
   - ✅ Add Subtitle - 字幕烧录
   - ✅ Remove Silence - 去除静音

5. **下载**
   - 点击 "Download Clip" 按钮
   - 等待处理完成
   - 文件会保存到选择的目录

## 📋 下载流程详解

### 步骤 1: 依赖检查
- 检测是否在 Tauri 环境中运行
- 验证 yt-dlp 是否已安装
- 如果缺少依赖，会显示安装提示

### 步骤 2: 视频下载
```bash
yt-dlp --format best \
  --download-sections *00:00:14-00:01:28 \
  --force-keyframes-at-cuts \
  -o ~/Downloads/VIDEO_ID_TIMESTAMP.mp4 \
  https://www.youtube.com/watch?v=VIDEO_ID
```

### 步骤 3: 可选处理
- **字幕**: `--write-subs --embed-subs`
- **格式**: 根据选择的分辨率下载
- **剪辑**: 仅下载选定的时间段

### 步骤 4: 保存
- 文件名格式: `{videoId}_{timestamp}.mp4`
- 保存到用户选择的目录
- 显示完整路径的成功通知

## ⚠️ 注意事项

### 浏览器模式 vs Tauri 模式

**在浏览器中** (`npm run dev`):
- ❌ 下载功能**不可用**
- ✅ 可以预览 UI
- 点击下载按钮会提示: "Download only works in desktop app"

**在 Tauri 中** (`npm run tauri:dev`):
- ✅ 下载功能**完全可用**
- ✅ 调用原生文件对话框
- ✅ 真实的视频下载

### 常见错误

**错误: "yt-dlp is not installed"**
```bash
brew install yt-dlp
```

**错误: "Please select a download directory"**
- 点击 "Choose" 按钮选择保存位置

**错误: "No video selected"**
- 先输入有效的 YouTube URL

## 🎯 当前功能状态

### ✅ 已实现
- YouTube URL 验证
- 视频播放器
- 时间轴选择
- 下载目录选择
- **真实的视频下载**（使用 yt-dlp）
- 字幕支持
- 进度通知

### 🚧 待实现
- [ ] ffmpeg 视频处理集成
- [ ] 去除静音功能
- [ ] AI 摘要生成
- [ ] 下载进度条（实时百分比）
- [ ] 批量下载
- [ ] 历史记录

## 📝 示例

### 下载一个 30 秒的剪辑

1. URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
2. 开始时间: 00:00:30
3. 结束时间: 00:01:00
4. 保存位置: ~/Downloads
5. 点击 "Download Clip"

结果: `dQw4w9WgXcQ_1734584123.mp4` 保存在 Downloads 文件夹

## 🔧 故障排除

### 下载失败

1. **检查网络连接**
2. **验证 YouTube URL 有效**
3. **确保有写入权限**
4. **查看控制台日志**:
   ```bash
   # Tauri 日志会显示在终端
   npm run tauri:dev
   ```

### 性能优化

- **大文件**: 选择较低分辨率
- **长视频**: 只剪辑需要的部分
- **网速慢**: 耐心等待，会显示进度

---

## 🎉 总结

现在你的应用可以**真正下载 YouTube 视频**了！

试试这些：
1. 运行 `npm run tauri:dev`
2. 输入 YouTube URL
3. 选择时间范围
4. 点击下载
5. 查看你的 Downloads 文件夹！

**注意**: 在浏览器模式 (`npm run dev`) 中，下载按钮会提示你需要在桌面应用中使用。
