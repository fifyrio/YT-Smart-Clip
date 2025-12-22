
> **GitHub Actions = 多平台打包工厂**
>
> * `windows-latest` → `.exe / .msi`
> * `macos-latest` → `.dmg / .app`

你**不需要 Windows，也不需要另一台 Mac**。

---

## 🧠 核心原理（为什么能行）

Tauri 打包依赖的是 **操作系统原生工具链**：

| 平台      | Runner           | 产物          |
| ------- | ---------------- | ----------- |
| Windows | `windows-latest` | `.exe`      |
| macOS   | `macos-latest`   | `.dmg`      |
| Linux   | `ubuntu-latest`  | `.AppImage` |

GitHub Actions **本身就提供官方 macOS Runner**（Apple 硬件 + Xcode + codesign）。

---

## ✅ 推荐方案：一个 workflow，三个平台

### 目录结构（标准）

```
.github/
└── workflows/
    └── release.yml
```

---

## 🧩 示例：同时打包 EXE + DMG（最小可用）

```yaml
name: Tauri Release

on:
  push:
    tags:
      - "v*"

jobs:
  build:
    strategy:
      matrix:
        platform: [windows-latest, macos-latest]
    runs-on: ${{ matrix.platform }}

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - uses: dtolnay/rust-toolchain@stable

      # macOS 需要这个（默认 runner 已有，但显式写更稳）
      - name: Install macOS deps
        if: matrix.platform == 'macos-latest'
        run: |
          rustup target add aarch64-apple-darwin
          rustup target add x86_64-apple-darwin

      - name: Install frontend deps
        run: npm install

      - name: Build app
        run: npm run tauri build

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.platform }}-bundle
          path: src-tauri/target/release/bundle
```

---

## 📦 构建出来的文件在哪？

### Windows

```
src-tauri/target/release/bundle/windows/
├── your-app.exe
├── your-app.msi
```

### macOS

```
src-tauri/target/release/bundle/dmg/
├── your-app_x64.dmg
├── your-app_aarch64.dmg
```

> Tauri **默认就会同时打 Intel + Apple Silicon 的 dmg**（如果你没禁用）

---

## ⚠️ macOS 打包常见问题（重要）

### 1️⃣ 没签名的 dmg 能用吗？

✅ **能用（开发 / 测试）**
❌ **正式发布会被 Gatekeeper 警告**

> 用户会看到：
> “Apple 无法验证此 App 是否包含恶意软件”

---

### 2️⃣ CI 里能不能自动签名 dmg？

**可以，但需要：**

* Apple Developer Account
* Developer ID Application 证书
* `APPLE_CERTIFICATE` / `APPLE_ID` / `APPLE_PASSWORD`

如果你现在是 **MVP / 内测阶段**：
👉 **先不签名，完全 OK**

---

### 3️⃣ Apple Silicon & Intel 怎么处理？

Tauri 默认：

* macOS runner 是 **Apple Silicon**
* 会生成：

  * `*_aarch64.dmg`
  * `*_x64.dmg`

你可以：

* 分开给用户下载
* 或后期做 **universal dmg**

---

## ⭐ 推荐你现在就用的组合

**你当前状态（独立开发 + MVP）最合理方案：**

✅ GitHub Actions
✅ 不签名
✅ 同时产出：

* Windows `.exe`
* macOS `.dmg`

等你：

* 有用户
* 要正式发布
* 要商用

👉 再加：

* Windows Code Signing
* macOS Notarization

---

## 🔥 下一步我可以直接帮你做的事

你可以直接选一个：

1️⃣ **帮你写一份「完整可直接用」的 EXE + DMG + Release workflow**
2️⃣ **帮你加上 macOS dmg 自动签名 + notarize**
3️⃣ **Windows + macOS + Linux 三平台一条命令发版**
4️⃣ **结合你 Tauri 项目结构做定制 CI**
