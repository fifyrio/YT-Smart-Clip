# YT Smart Clip - 构建指南

## 当前状态 ✅

项目已完成基础配置，可以打包成 macOS .app 文件。

### 已完成
- ✅ Next.js 前端完全实现（UI 完美复刻截图）
- ✅ Tauri 桌面框架集成
- ✅ 静态导出配置（`output: "export"`）
- ✅ Tauri 配置文件设置
- ✅ 应用图标已就绪
- ✅ macOS 特定配置

## 构建 macOS .app 的步骤

### 1. 前置条件检查

首先需要同意 Xcode 许可协议：

```bash
sudo xcodebuild -license
```

按空格键滚动到底部，输入 `agree` 同意协议。

### 2. 安装依赖（如果尚未安装）

```bash
npm install
```

### 3. 构建 Next.js

```bash
npm run build
```

这会在 `out/` 目录生成静态文件。

### 4. 构建 Tauri 应用

**开发模式（测试）**：
```bash
npm run tauri:dev
```

这会启动一个带有开发者工具的桌面应用窗口。

**生产构建（打包）**：
```bash
npm run tauri:build
```

这会生成以下文件：
- **DMG 安装包**: `src-tauri/target/release/bundle/dmg/YT Smart Clip_0.1.0_aarch64.dmg`
- **.app 应用**: `src-tauri/target/release/bundle/macos/YT Smart Clip.app`

### 5. 安装应用

构建完成后，你可以：

1. **从 .app 直接运行**：
   ```bash
   open "src-tauri/target/release/bundle/macos/YT Smart Clip.app"
   ```

2. **安装 DMG**：
   - 双击 `.dmg` 文件
   - 将应用拖到 Applications 文件夹

3. **复制到 Applications**：
   ```bash
   cp -r "src-tauri/target/release/bundle/macos/YT Smart Clip.app" /Applications/
   ```

## 应用配置

### 窗口大小
- 初始大小: 1400x900
- 最小大小: 1200x700
- 可调整大小
- 居中显示

### Bundle ID
- `com.ytsmartclip.app`

### 支持的 macOS 版本
- macOS 10.13 (High Sierra) 及以上

## 故障排除

### 问题 1: Xcode 许可协议未同意

**错误信息**：
```
You have not agreed to the Xcode license agreements.
```

**解决方法**：
```bash
sudo xcodebuild -license
# 滚动到底部并输入 'agree'
```

### 问题 2: Rust 未安装

**安装 Rust**：
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 问题 3: 构建失败

**清理缓存并重试**：
```bash
# 清理 Rust 构建缓存
cd src-tauri
cargo clean
cd ..

# 清理 Next.js 构建
rm -rf out .next

# 重新构建
npm run build
npm run tauri:build
```

### 问题 4: 应用无法打开（macOS Gatekeeper）

如果双击应用显示"无法验证开发者"：

```bash
# 方法 1: 右键点击 -> 打开
# 方法 2: 在终端中运行
xattr -cr "/Applications/YT Smart Clip.app"
```

## 开发模式 vs 生产模式

### 开发模式 (`npm run tauri:dev`)
- 热重载
- 开发者工具可用
- 未优化
- 适合调试

### 生产模式 (`npm run tauri:build`)
- 完全优化
- 代码压缩
- 无开发工具
- 生成可分发的 .app 和 .dmg

## 代码签名（可选）

如果要分发应用给其他用户，需要 Apple 开发者账号进行代码签名：

```bash
# 在 tauri.conf.json 中配置
"macOS": {
  "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)"
}
```

然后重新构建：
```bash
npm run tauri:build
```

## 文件大小

预期打包后的应用大小：
- .app: ~15-20 MB
- .dmg: ~10-15 MB

## 下一步

构建成功后，你可以：

1. **本地使用**: 直接从 Applications 文件夹启动
2. **分享给朋友**: 发送 DMG 文件
3. **发布到 GitHub Releases**: 创建 release 并上传 DMG
4. **提交到 App Store**: 需要完整的代码签名流程

## 快速测试

如果只想快速测试应用，使用开发模式：

```bash
# 一键启动
npm run tauri:dev
```

这会在几秒钟内打开桌面应用窗口，无需等待完整构建。

---

## 当前限制

⚠️ **后端功能尚未实现**

虽然 UI 已完成，以下功能需要额外的后端实现：

- [ ] 实际的视频下载（需要集成 yt-dlp）
- [ ] 视频剪辑处理（需要集成 ffmpeg）
- [ ] AI 摘要生成（需要 API 集成）
- [ ] 字幕烧录
- [ ] 静音移除

UI 层面已经 100% 完成并且可以打包成独立的 macOS 应用！
