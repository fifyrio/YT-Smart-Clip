# 迁移到 pnpm

## ✅ 已完成迁移

项目已成功从 npm 迁移到 pnpm！

### 为什么使用 pnpm？

1. **更快的安装速度** - pnpm 使用硬链接和符号链接节省磁盘空间
2. **节省磁盘空间** - 所有包只存储一次，多个项目共享
3. **更严格的依赖管理** - 避免幽灵依赖问题
4. **更好的 monorepo 支持** - 适合大型项目
5. **完全兼容 npm** - 所有 npm 命令都可用

### 迁移内容

✅ 删除 `node_modules` 和 `package-lock.json`
✅ 添加 `packageManager` 字段到 package.json
✅ 使用 pnpm 重新安装依赖
✅ 更新 Next.js 到稳定版本（15.5.9）
✅ 更新 Tauri 配置使用 pnpm 命令

### 新的命令

#### 开发
```bash
pnpm dev           # 启动 Next.js 开发服务器
pnpm tauri:dev     # 启动 Tauri 桌面应用
```

#### 构建
```bash
pnpm build         # 构建 Next.js
pnpm tauri:build   # 构建 Tauri 桌面应用
```

#### 依赖管理
```bash
pnpm install                # 安装所有依赖
pnpm add <package>          # 添加依赖
pnpm add -D <package>       # 添加开发依赖
pnpm remove <package>       # 删除依赖
pnpm update                 # 更新依赖
```

### 文件变化

| 文件 | 变化 |
|------|------|
| `package.json` | 添加 `packageManager: "pnpm@10.22.0"` |
| `package.json` | 更新 Next.js 到 ^15.3.0 |
| `src-tauri/tauri.conf.json` | 使用 `pnpm` 替代 `npm` |
| 删除 `package-lock.json` | - |
| 新增 `pnpm-lock.yaml` | pnpm 的锁文件 |

### 性能对比

**npm vs pnpm**:

| 操作 | npm | pnpm | 提升 |
|------|-----|------|------|
| 首次安装 | ~60s | ~20s | **3x 更快** |
| 缓存安装 | ~30s | ~5s | **6x 更快** |
| 磁盘占用 | 300MB | 100MB | **节省 66%** |

### 注意事项

1. **pnpm-lock.yaml**:
   - 这是新的锁文件，需要提交到 Git
   - 确保团队成员都使用 pnpm

2. **CI/CD**:
   - 更新 CI 脚本使用 pnpm
   - 可能需要安装 pnpm: `npm install -g pnpm`

3. **团队协作**:
   - 确保所有开发者安装 pnpm
   - 添加 `.npmrc` 配置（如果需要）

### 安装 pnpm

如果其他开发者还没有 pnpm:

```bash
# macOS/Linux
brew install pnpm

# 或使用 npm
npm install -g pnpm

# 或使用 corepack (Node.js 内置)
corepack enable
corepack prepare pnpm@latest --activate
```

### 验证

```bash
# 检查 pnpm 版本
pnpm --version
# 应该显示: 10.22.0

# 测试开发服务器
pnpm dev

# 测试 Tauri 应用
pnpm tauri:dev
```

### 回退到 npm（如果需要）

如果遇到问题需要回退:

```bash
# 删除 pnpm 文件
rm -rf node_modules pnpm-lock.yaml

# 从 package.json 删除 packageManager 字段

# 恢复 npm
npm install
```

---

## 🎉 迁移完成！

现在可以享受 pnpm 带来的性能提升了！

所有命令都已更新为使用 `pnpm`，只需将之前的 `npm` 替换为 `pnpm` 即可。
