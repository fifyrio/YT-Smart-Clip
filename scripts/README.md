# 本地构建和签名脚本

本目录包含用于本地测试的构建和签名脚本。

## 脚本说明

### 0. `prepare-binaries.sh` - 下载打包所需二进制

**用途**: 为 Tauri 构建准备 `yt-dlp` 与 `ffmpeg` sidecar，可确保 Windows 与 macOS 安装包都内置依赖。

**使用方法**:
```bash
# 自动根据当前系统下载（macOS 或 Windows）
bash scripts/prepare-binaries.sh

# 或指定平台，方便在 CI 中提前准备
bash scripts/prepare-binaries.sh macos
bash scripts/prepare-binaries.sh windows

# 同时准备两套（例如本地预先缓存）
bash scripts/prepare-binaries.sh all
```

> 生成的文件会放在 `src-tauri/binaries/` 中，并使用目标三元组命名，如 `yt-dlp-x86_64-pc-windows-msvc.exe`，以便运行时正确选取。

### 1. `quick-test.sh` - 快速测试 ⚡

**用途**: 最快的本地测试方法，使用 ad-hoc 签名

**特点**:
- ✅ 无需 Apple Developer 账号
- ✅ 无需配置证书
- ✅ 构建速度快
- ⚠️ 生成的 app 需要用户手动允许运行

**使用方法**:
```bash
./scripts/quick-test.sh
```

**测试应用**:
```bash
# 脚本完成后，直接运行
open "src-tauri/target/universal-apple-darwin/release/bundle/macos/YT Smart Clip.app"
```

首次运行会被 macOS 阻止，解决方法：
1. 打开"系统偏好设置" → "安全性与隐私"
2. 点击"仍要打开"

或者右键点击应用 → 选择"打开"

---

### 2. `build-and-sign-macos.sh` - 完整签名和公证 📦

**用途**: 完整的本地构建、签名和公证流程

**前置要求**:
- ✅ Apple Developer 账号
- ✅ Developer ID Application 证书已安装
- ✅ App-Specific 密码（用于公证）

**配置**:

编辑脚本开头的配置变量：

```bash
SIGNING_IDENTITY="Developer ID Application: 你的名字 (TEAM_ID)"
APPLE_ID="your@email.com"
TEAM_ID="YTTBUWP5M6"  # 你的 10 位团队 ID
```

**查找你的签名身份**:
```bash
security find-identity -v -p codesigning
```

输出示例：
```
1) ABC123... "Developer ID Application: hongmei shen (YTTBUWP5M6)"
```

复制引号内的完整字符串到 `SIGNING_IDENTITY`。

**使用方法**:
```bash
./scripts/build-and-sign-macos.sh
```

脚本会提示：
- 是否进行公证（可选）
- 如果选择公证，会要求输入 App-Specific 密码

**生成 App-Specific 密码**:
1. 访问 https://appleid.apple.com
2. 登录
3. "安全" → "App 专用密码"
4. 点击"生成密码"
5. 输入标签（如 "YT Smart Clip Notarization"）
6. 复制生成的密码（格式：xxxx-xxxx-xxxx-xxxx）

---

## 常见用例

### 场景 1: 快速功能测试
我只想测试新功能，不关心签名：
```bash
./scripts/quick-test.sh
```

### 场景 2: 测试签名流程
我想测试签名是否正确配置：
```bash
# 编辑 build-and-sign-macos.sh，设置正确的签名身份
# 运行脚本，选择"N"跳过公证
./scripts/build-and-sign-macos.sh
```

### 场景 3: 完整测试（包括公证）
我想生成可以直接分发给用户的版本：
```bash
# 编辑 build-and-sign-macos.sh，设置所有配置
# 运行脚本，选择"Y"进行公证
# 输入 App-Specific 密码
./scripts/build-and-sign-macos.sh
```

---

## 输出文件位置

所有构建产物都在 `src-tauri/target/universal-apple-darwin/release/bundle/` 下：

```
src-tauri/target/universal-apple-darwin/release/bundle/
├── macos/
│   └── YT Smart Clip.app        # 签名的应用
└── dmg/
    └── YT Smart Clip_local_signed.dmg  # 签名的 DMG
```

---

## 故障排查

### 问题 1: "command not found: pnpm"

**解决方法**:
```bash
npm install -g pnpm
# 或
brew install pnpm
```

### 问题 2: "The specified item could not be found in the keychain"

**原因**: 证书未正确安装

**解决方法**:
1. 打开 Keychain Access
2. 确认 "Developer ID Application" 证书存在
3. 或使用 `quick-test.sh`（不需要证书）

### 问题 3: 构建失败 "No such file or directory"

**解决方法**:
```bash
# 确保在项目根目录运行
cd /Users/shenhongmei/Documents/APPDeveloper/YT-Smart-Clip
./scripts/quick-test.sh
```

### 问题 4: "Permission denied"

**解决方法**:
```bash
chmod +x scripts/*.sh
```

---

## 与 GitHub Actions 的对比

| 特性 | quick-test.sh | build-and-sign-macos.sh | GitHub Actions |
|------|--------------|------------------------|----------------|
| 速度 | ⚡ 最快 | 🐢 慢（公证需要 5-15 分钟） | 🐢 最慢 |
| 需要证书 | ❌ 不需要 | ✅ 需要 | ✅ 需要 |
| 公证 | ❌ 不支持 | ✅ 可选 | ✅ 自动 |
| 用例 | 开发测试 | 预发布测试 | 正式发布 |

---

## 提示

💡 **开发时推荐流程**:
1. 使用 `quick-test.sh` 快速迭代和测试
2. 功能完成后，用 `build-and-sign-macos.sh` 测试完整签名
3. 准备发布时，推送到 GitHub 触发 Actions

💡 **首次设置**:
1. 先运行 `quick-test.sh` 确保构建无问题
2. 再配置证书并运行 `build-and-sign-macos.sh`

💡 **节省时间**:
- 公证很慢（5-15 分钟），开发时可以跳过
- 只在准备分发给用户时才进行公证
