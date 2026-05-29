# uni-agent 移植到 Claude Code 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> 参考文档：[Claude Code 插件](https://www.runoob.com/claude-code/claude-code-plugins.html) | [插件参考手册](https://www.runoob.com/claude-code/claude-code-plugin-ref.html)

**Goal:** 将 HBuilderX 的 uni-agent 功能移植到 Claude Code，使 Claude Code 能够辅助 uni-app/uni-app x 项目开发

**Architecture:** 使用 Claude Code 插件机制（skills + hooks），通过中间层符号链接实时读取 HBuilderX 安装目录的 uni-agent 文件。所有脚本使用 Node.js 编写，确保跨平台兼容性。

**Tech Stack:** Node.js, Claude Code Skills, Claude Code Hooks, Symbolic Links

---

## 背景知识

### 插件 vs 独立配置

| 方式                      | 命令形式             | 适合场景                   |
| ------------------------- | -------------------- | -------------------------- |
| 独立配置（`.claude/`）    | `/hello`             | 个人使用、单项目、快速实验 |
| 插件（`.claude-plugin/`） | `/plugin-name:hello` | 团队共享、跨项目、版本化   |

**uni-agent 选择插件方式的原因：**

- 需要跨项目复用（所有 uni-app 项目）
- 需要版本管理（跟随 HBuilderX 版本）
- 需要通过市场分发

### 插件能力总览

| 能力     | 用途                            | uni-agent 使用情况      |
| -------- | ------------------------------- | ----------------------- |
| Commands | 自定义斜杠命令                  | 通过 skills 实现        |
| Agents   | 专用子代理                      | ✅ unicloud、uts-native |
| Skills   | 教会 Claude 何时用某种能力      | ✅ 19 个技能            |
| Hooks    | 自动化（写完文件后执行命令等）  | ✅ 项目检测             |
| MCP      | 连接外部服务（GitHub、DB、API） | ❌ 未使用               |
| LSP      | 代码智能（跳转、类型检查）      | ❌ 未使用               |

### 插件市场

插件通过**市场**分发，本质是一个插件目录仓库。

**官方市场**：

- 默认已添加
- 运行 `/plugin` → **Discover**

**安装插件**：

```bash
/plugin install plugin-name@claude-plugins-official
```

**uni-agent 的分发方式**：

- 通过本地 marketplace 分发（`~/.claude/plugins/marketplaces/local/`）
- 或通过 `--plugin-dir` 直接加载本地目录

### 斜杠命令

**命令定义方式**：

- 位于 `commands/` 目录
- 每个命令 = 一个 Markdown 文件
- 文件名 = 命令名

**示例**：

```
commands/hello.md
```

**对应命令**：

```
/my-first-plugin:hello
```

**命令内容示例**：

```markdown
---
description: Greet the user with a friendly message
---

Greet the user warmly and ask how you can help them today.
```

**命令参数**：

使用 `$ARGUMENTS` 捕获用户输入：

```markdown
Greet the user named "$ARGUMENTS" warmly.
```

**调用**：

```
/my-first-plugin:hello Alex
```

**uni-agent 的命令实现**：

uni-agent 通过 skills 而非 commands 实现功能调用，命令格式为：

```
/uni-agent:skill-name
```

### 典型插件分类

**1、代码智能（LSP）**

- TypeScript、Python、Go、Rust 等
- 提供跳转定义、引用、类型错误
- 需要本地安装对应语言服务器

**2、外部集成（MCP）**

- GitHub / GitLab
- Jira / Notion
- Slack / Figma
- Vercel / Supabase

> 本质：**插件 = MCP 服务器 + 配置**

**3、开发工作流**

- Git 提交、PR
- 代码审查代理
- 插件开发工具

**uni-agent 属于"开发工作流"分类**，专注于 uni-app/uni-app x 开发辅助。

### 从 `.claude/` 迁移到插件

| 原来                  | 迁移后                    |
| --------------------- | ------------------------- |
| `.claude/commands`    | `plugin/commands`         |
| `.claude/agents`      | `plugin/agents`           |
| `settings.json hooks` | `plugin/hooks/hooks.json` |

迁移后：

- 插件版本优先生效
- 可删除旧 `.claude/` 配置避免重复

---

## 文件结构

```
~/.claude/plugins/uni-agent/
├── .claude-plugin/
│   └── plugin.json                    # 插件清单（必需）
├── skills -> {HBuilderX}/.../skills/  # 整个 skills 目录链接
├── knowledges -> {HBuilderX}/.../knowledges/  # 整个 knowledges 目录链接
├── common -> {HBuilderX}/.../common/  # 整个 common 目录链接
├── rules/                             # 规则文件（固定，不链接）
│   └── uni-agent.md                  # 静态规则 + 条件指令
├── hooks/                             # Hook 脚本（固定，不链接）
│   └── detect-uniapp.js              # 检测 uni-app 项目（可选）
├── scripts/                           # 工具脚本（固定，不链接）
│   ├── detect-hbuilderx-path.js
│   ├── check-hbuilderx.js
│   ├── sync-links.js
│   └── install.js
├── agents/                            # 子代理定义（固定，不链接，手动转换）
│   ├── unicloud.md
│   └── uts-native.md
└── config.jsonc                       # 配置文件（自动生成）
```

**重要规则**（参考 [Claude Code 插件文档](https://www.runoob.com/claude-code/claude-code-plugins.html)）：

- `.claude-plugin/` 目录中**只能放 `plugin.json`**
- 其他目录（skills、agents、hooks 等）必须在插件根目录
- `plugin.json` 是插件的"身份证"，决定插件名称、版本、作者等信息

**重要说明**:

- **skills**: 整个目录链接，`~/.claude/plugins/uni-agent/skills` -> `{HBuilderX}/.../skills/`
- **knowledges**: 整个目录链接，`~/.claude/plugins/uni-agent/knowledges` -> `{HBuilderX}/.../knowledges/`
- **common**: 整个目录链接，`~/.claude/plugins/uni-agent/common` -> `{HBuilderX}/.../common/`
- **rules**: 静态规则文件 + 条件指令，内容固定，缓存友好
- **hooks**: 仅用于项目检测（可选），系统提示词通过 rules 文件注入
- **agents**: 不链接，因为 OpenCode 和 Claude Code 的 MD 格式有差异，需要手动转换
- **scripts**: 固定文件，不链接

---

### Task 1: 创建插件目录结构

**Files:**

- Create: `~/.claude/plugins/uni-agent/.claude-plugin/plugin.json`

- [ ] **Step 1: 创建插件目录**

```bash
mkdir -p ~/.claude/plugins/uni-agent/.claude-plugin
mkdir -p ~/.claude/plugins/uni-agent/{skills,agents,hooks,scripts,rules}
```

- [ ] **Step 2: 创建 .claude-plugin/plugin.json**

```json
{
  "name": "uni-agent",
  "description": "uni-app/uni-app x 开发助手，移植自 HBuilderX uni-agent",
  "version": "1.2.22",
  "author": {
    "name": "DCloud"
  },
  "homepage": "https://github.com/nicepkg/uni-agent-claude",
  "repository": "https://github.com/nicepkg/uni-agent-claude",
  "license": "MIT",
  "keywords": ["uni-app", "uni-app-x", "vue", "mobile", "cross-platform"],
  "skills": ["./skills"],
  "rules": ["./rules"]
}
```

**说明**：

- `name`: 唯一标识符，kebab-case 格式
- `description`: 插件市场中展示
- `version`: 语义化版本控制
- `author`: 可选，归属说明
- `skills`: 技能目录路径（以 `./` 开头）
- `rules`: 规则目录路径（以 `./` 开头）
- **注意**：
  - Hooks 不在 `plugin.json` 中配置，而是在 `~/.claude/settings.json` 中配置
  - 如果 `agents` 目录为空，可以不配置 `agents` 字段
  - 使用目录路径（如 `./skills`）而非 glob 模式（如 `./skills/*/SKILL.md`）

- [ ] **Step 3: 验证目录结构**

```bash
ls -la ~/.claude/plugins/uni-agent/
ls -la ~/.claude/plugins/uni-agent/.claude-plugin/
```

Expected: 看到 `.claude-plugin/plugin.json` 和所有子目录

- [ ] **Step 4: Commit**

```bash
git add .claude-plugin/plugin.json
git commit -m "feat: create uni-agent plugin structure with .claude-plugin manifest"
```

---

### Task 2: 实现 HBuilderX 安装路径检测脚本

**Files:**

- Create: `~/.claude/plugins/uni-agent/scripts/detect-hbuilderx-path.js`

- [ ] **Step 1: 创建 detect-hbuilderx-path.js**

```javascript
#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const os = require('os')

/**
 * 检测 HBuilderX 安装路径
 * @returns {string|null} HBuilderX 安装路径，未找到返回 null
 */
function detectHBuilderXPath() {
  // 1. 检查环境变量
  const envPath = process.env.HBUILDERX_PATH
  if (envPath && fs.existsSync(envPath)) {
    return envPath
  }

  const cliPath = process.env.HBUILDERX_CLI_PATH
  if (cliPath && fs.existsSync(cliPath)) {
    // 从 CLI 路径推断安装路径
    return path.dirname(path.dirname(cliPath))
  }

  // 2. 检测进程
  try {
    const platform = os.platform()
    let hbuilderxPath = null

    if (platform === 'win32') {
      // Windows: 通过 wmic 获取进程路径
      const output = execSync('wmic process where "name=\'HBuilderX.exe\'" get executablepath /format:csv', { encoding: 'utf-8', timeout: 5000 })
      const lines = output.split('\n').filter((line) => line.trim() && !line.includes('ExecutablePath'))
      for (const line of lines) {
        const parts = line.split(',')
        if (parts.length > 1) {
          const execPath = parts[parts.length - 1].trim()
          if (execPath && fs.existsSync(execPath)) {
            hbuilderxPath = path.dirname(execPath)
            break
          }
        }
      }
    } else if (platform === 'darwin') {
      // macOS: 通过 ps 获取进程路径
      const output = execSync('ps -ax | grep -i "HBuilderX" | grep -v grep', { encoding: 'utf-8', timeout: 5000 })
      const match = output.match(/(\/[^\s]+\.app\/Contents\/MacOS\/HBuilderX)/)
      if (match && match[1]) {
        const execPath = match[1]
        if (fs.existsSync(execPath)) {
          // macOS .app 结构: Contents/MacOS/HBuilderX -> ../..
          hbuilderxPath = path.dirname(path.dirname(execPath))
        }
      }
    } else {
      // Linux: 通过 ps 获取进程路径
      const output = execSync('ps -ax | grep -i "HBuilderX" | grep -v grep', { encoding: 'utf-8', timeout: 5000 })
      const lines = output.split('\n').filter((line) => line.trim())
      for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        const execPath = parts[parts.length - 1]
        if (execPath && fs.existsSync(execPath)) {
          hbuilderxPath = path.dirname(execPath)
          break
        }
      }
    }

    if (hbuilderxPath && fs.existsSync(hbuilderxPath)) {
      return hbuilderxPath
    }
  } catch (e) {
    // 进程检测失败，继续尝试其他方式
  }

  // 3. 检查常见安装位置
  const platform = os.platform()
  const homeDir = os.homedir()
  const commonPaths = []

  if (platform === 'win32') {
    const appData = process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming')
    const localAppData = process.env.LOCALAPPDATA || path.join(homeDir, 'AppData', 'Local')
    commonPaths.push(
      path.join(appData, 'HBuilder X'),
      path.join(localAppData, 'HBuilder X'),
      path.join(homeDir, 'AppData', 'Roaming', 'HBuilder X'),
      path.join(homeDir, 'AppData', 'Local', 'HBuilder X'),
    )
  } else if (platform === 'darwin') {
    commonPaths.push(path.join(homeDir, 'Library', 'Application Support', 'HBuilder X'))
  } else {
    commonPaths.push(path.join(homeDir, '.config', 'HBuilder X'))
  }

  for (const testPath of commonPaths) {
    if (fs.existsSync(testPath)) {
      return testPath
    }
  }

  return null
}

// 主程序
const hbuilderxPath = detectHBuilderXPath()
if (hbuilderxPath) {
  console.log(hbuilderxPath)
  process.exit(0)
} else {
  console.error('未找到 HBuilderX 安装路径')
  console.error('请设置环境变量 HBUILDERX_PATH 或在 config.jsonc 中配置 hbuilderxPath')
  process.exit(1)
}
```

- [ ] **Step 2: 测试脚本**

```bash
node ~/.claude/plugins/uni-agent/scripts/detect-hbuilderx-path.js
```

Expected: 输出 HBuilderX 安装路径或错误信息

- [ ] **Step 3: Commit**

```bash
git add scripts/detect-hbuilderx-path.js
git commit -m "feat: add HBuilderX path detection script"
```

---

### Task 3: 实现 HBuilderX CLI 检测脚本

**Files:**

- Create: `~/.claude/plugins/uni-agent/scripts/check-hbuilderx.js`

- [ ] **Step 1: 创建 check-hbuilderx.js**

```javascript
#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const os = require('os')

/**
 * 检测 HBuilderX CLI 路径
 * @returns {string|null} CLI 路径，未找到返回 null
 */
function detectHBuilderXCLI() {
  // 1. 检查环境变量
  const cliPath = process.env.HBUILDERX_CLI_PATH
  if (cliPath && fs.existsSync(cliPath)) {
    return cliPath
  }

  // 2. 检测进程获取 CLI 路径
  try {
    const platform = os.platform()
    let hbuilderxPath = null

    if (platform === 'win32') {
      // Windows
      const output = execSync('wmic process where "name=\'HBuilderX.exe\'" get executablepath /format:csv', { encoding: 'utf-8', timeout: 5000 })
      const lines = output.split('\n').filter((line) => line.trim() && !line.includes('ExecutablePath'))
      for (const line of lines) {
        const parts = line.split(',')
        if (parts.length > 1) {
          const execPath = parts[parts.length - 1].trim()
          if (execPath && fs.existsSync(execPath)) {
            hbuilderxPath = execPath
            break
          }
        }
      }

      if (hbuilderxPath) {
        const cliDir = path.dirname(hbuilderxPath)
        const cli = path.join(cliDir, 'cli.exe')
        if (fs.existsSync(cli)) {
          return cli
        }
      }
    } else if (platform === 'darwin') {
      // macOS
      const output = execSync('ps -ax | grep -i "HBuilderX" | grep -v grep', { encoding: 'utf-8', timeout: 5000 })
      const match = output.match(/(\/[^\s]+\.app\/Contents\/MacOS\/HBuilderX)/)
      if (match && match[1]) {
        const execPath = match[1]
        if (fs.existsSync(execPath)) {
          const cli = path.join(path.dirname(execPath), 'cli')
          if (fs.existsSync(cli)) {
            return cli
          }
        }
      }
    } else {
      // Linux
      const output = execSync('ps -ax | grep -i "HBuilderX" | grep -v grep', { encoding: 'utf-8', timeout: 5000 })
      const lines = output.split('\n').filter((line) => line.trim())
      for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        const execPath = parts[parts.length - 1]
        if (execPath && fs.existsSync(execPath)) {
          const cli = path.join(path.dirname(execPath), 'cli')
          if (fs.existsSync(cli)) {
            return cli
          }
        }
      }
    }
  } catch (e) {
    // 进程检测失败，继续尝试其他方式
  }

  // 3. 从配置文件读取路径
  const configPath = path.join(os.homedir(), '.claude', 'plugins', 'uni-agent', 'config.jsonc')
  if (fs.existsSync(configPath)) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8')
      // 简单解析 JSONC（移除注释）
      const jsonStr = configContent.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
      const config = JSON.parse(jsonStr)

      if (config.hbuilderxPath) {
        const possibleCliPaths = [
          path.join(config.hbuilderxPath, 'cli.exe'),
          path.join(config.hbuilderxPath, 'cli'),
          path.join(config.hbuilderxPath, 'HBuilderX', 'cli.exe'),
          path.join(config.hbuilderxPath, 'HBuilderX', 'cli'),
        ]

        for (const cli of possibleCliPaths) {
          if (fs.existsSync(cli)) {
            return cli
          }
        }
      }
    } catch (e) {
      // 配置文件解析失败
    }
  }

  return null
}

// 主程序
const cliPath = detectHBuilderXCLI()
if (cliPath) {
  console.log(cliPath)
  process.exit(0)
} else {
  console.error('未找到 HBuilderX CLI')
  console.error('请确保 HBuilderX 正在运行，或设置环境变量 HBUILDERX_CLI_PATH')
  process.exit(1)
}
```

- [ ] **Step 2: 测试脚本**

```bash
node ~/.claude/plugins/uni-agent/scripts/check-hbuilderx.js
```

Expected: 输出 HBuilderX CLI 路径或错误信息

- [ ] **Step 3: Commit**

```bash
git add scripts/check-hbuilderx.js
git commit -m "feat: add HBuilderX CLI detection script"
```

---

### Task 4: 实现符号链接同步脚本

**Files:**

- Create: `~/.claude/plugins/uni-agent/scripts/sync-links.js`

- [ ] **Step 1: 创建 sync-links.js**

```javascript
#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs')
const os = require('os')

// 检测 HBuilderX 安装路径
function detectHBuilderXPath() {
  // 1. 检查环境变量
  const envPath = process.env.HBUILDERX_PATH
  if (envPath && fs.existsSync(envPath)) {
    return envPath
  }

  const cliPath = process.env.HBUILDERX_CLI_PATH
  if (cliPath && fs.existsSync(cliPath)) {
    return path.dirname(path.dirname(cliPath))
  }

  // 2. 检查常见安装位置
  const platform = os.platform()
  const homeDir = os.homedir()
  const commonPaths = []

  if (platform === 'win32') {
    const appData = process.env.APPDATA || path.join(homeDir, 'AppData', 'Roaming')
    const localAppData = process.env.LOCALAPPDATA || path.join(homeDir, 'AppData', 'Local')
    commonPaths.push(path.join(appData, 'HBuilder X'), path.join(localAppData, 'HBuilder X'))
  } else if (platform === 'darwin') {
    commonPaths.push(path.join(homeDir, 'Library', 'Application Support', 'HBuilder X'))
  } else {
    commonPaths.push(path.join(homeDir, '.config', 'HBuilder X'))
  }

  for (const testPath of commonPaths) {
    if (fs.existsSync(testPath)) {
      return testPath
    }
  }

  return null
}

// 创建目录符号链接
function createDirSymlink(target, source) {
  // 删除已存在的链接
  if (fs.existsSync(target)) {
    try {
      const stat = fs.lstatSync(target)
      if (stat.isSymbolicLink()) {
        fs.unlinkSync(target)
      } else if (stat.isDirectory()) {
        fs.rmdirSync(target, { recursive: true })
      }
    } catch (e) {
      // 忽略删除错误
    }
  }

  // 确保父目录存在
  const parentDir = path.dirname(target)
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true })
  }

  // 创建符号链接（目录类型）
  try {
    fs.symlinkSync(source, target, 'dir')
    return { success: true, method: 'symlink' }
  } catch (e) {
    // Windows 可能需要管理员权限，尝试使用 junction
    if (os.platform() === 'win32') {
      try {
        fs.symlinkSync(source, target, 'junction')
        return { success: true, method: 'junction' }
      } catch (e2) {
        return { success: false, error: e2.message + ' (Windows 需要管理员权限或启用开发者模式)' }
      }
    }
    return { success: false, error: e.message }
  }
}

// 主程序
const pluginPath = path.join(os.homedir(), '.claude', 'plugins', 'uni-agent')
const CONFIG_PATH = path.join(pluginPath, 'config.jsonc')
const HBuilderX_RELATIVE_PATH = path.join('plugins', 'hbuilderx-ai-chat', 'uni-agent')

console.log('Uni-Agent Symlink Sync')
console.log('======================')
console.log()

// 确保插件目录存在
if (!fs.existsSync(pluginPath)) {
  fs.mkdirSync(pluginPath, { recursive: true })
}

// 检测 HBuilderX 路径
console.log('[1/2] Detecting HBuilderX installation...')
const hbuilderxPath = detectHBuilderXPath()

if (!hbuilderxPath) {
  console.error('  Error: HBuilderX installation not found.')
  console.error('  To fix: set HBUILDERX_PATH to your HBuilderX installation directory.')
  process.exit(1)
}

const agentPath = path.join(hbuilderxPath, HBuilderX_RELATIVE_PATH)

if (!fs.existsSync(agentPath)) {
  console.error(`  Error: uni-agent directory not found: ${agentPath}`)
  process.exit(1)
}

console.log(`  Found: ${hbuilderxPath}`)
console.log()

// 同步链接
console.log('[2/2] Syncing links...')
const stats = { created: 0, unchanged: 0, failed: 0 }

// 需要链接的目录列表
const dirsToLink = [
  { name: 'skills', desc: 'Skills 目录' },
  { name: 'knowledges', desc: '知识库目录' },
  { name: 'common', desc: '公共脚本目录' },
]

for (const { name, desc } of dirsToLink) {
  const source = path.join(agentPath, name)
  const target = path.join(pluginPath, name)

  if (!fs.existsSync(source)) {
    console.log(`  [SKIP] ${desc}: 源目录不存在`)
    continue
  }

  // 检查是否已链接到正确目标
  if (fs.existsSync(target)) {
    try {
      const existingTarget = fs.readlinkSync(target)
      if (path.resolve(existingTarget) === path.resolve(source)) {
        console.log(`  [OK]   ${desc} (已链接)`)
        stats.unchanged++
        continue
      }
    } catch {
      // 不是符号链接，继续创建
    }
  }

  const result = createDirSymlink(target, source)

  if (result.success) {
    console.log(`  [LINK] ${desc} -> ${source} (${result.method})`)
    stats.created++
  } else {
    console.log(`  [FAIL] ${desc}: ${result.error}`)
    stats.failed++
  }
}

// 创建默认配置文件
if (!fs.existsSync(CONFIG_PATH)) {
  const defaultConfig = `{
  // HBuilderX 安装路径（自动检测，无需手动配置）
  // "hbuilderxPath": "C:/path/to/HBuilder X",

  // 同步选项
  "sync": {
    "skills": true,
    "knowledges": true,
    "common": true
  }
}
`
  fs.writeFileSync(CONFIG_PATH, defaultConfig, 'utf8')
  console.log(`  [NEW]  配置文件已创建`)
}

// 输出统计
console.log()
console.log('Summary:')
console.log(`  Created:   ${stats.created}`)
console.log(`  Unchanged: ${stats.unchanged}`)
console.log(`  Failed:    ${stats.failed}`)

if (stats.failed > 0) {
  process.exit(1)
}
```

- [ ] **Step 2: 测试脚本**

```bash
node ~/.claude/plugins/uni-agent/scripts/sync-links.js
```

Expected: 链接 skills、knowledges、common 三个目录

- [ ] **Step 3: Commit**

```bash
git add scripts/sync-links.js
git commit -m "feat: add sync-links script for directory symlinks"
```

---

### Task 5: 创建静态规则文件

**Files:**

- Create: `~/.claude/plugins/uni-agent/rules/uni-agent.md`

- [ ] **Step 1: 创建 rules 目录和规则文件**

```bash
mkdir -p ~/.claude/plugins/uni-agent/rules
```

- [ ] **Step 2: 创建 uni-agent.md**

```markdown
# uni-agent 规则

## 身份协议

- 你的官方名称是 "uni-agent"
- 在所有交互中，你必须介绍自己为 "uni-agent"
- 你是一个专门用于 uni-app/uni-app x 开发的 AI 助手

## 项目类型检测

根据当前项目目录下的文件判断项目类型：

- 如果 manifest.json 包含 "uni-app-x" 字段 → uni-app x 项目
- 否则 → uni-app 项目

## uni-app 项目规则（仅适用于 uni-app 项目）

### H5 输入框兼容性注意事项

不要对 input / textarea 设置 box-sizing: border-box

在 uni-app 项目中，尤其是 H5 平台，只要对 input、textarea 设置了 box-sizing: border-box，无论是在 App.vue 全局样式、单个页面样式、class 样式，还是直接写在 style 属性中，都可能导致输入框无法获得焦点、无法正常输入等问题。

## uni-app x 项目规则（仅适用于 uni-app x 项目）

### UI 实现规则

#### 强制 flex-direction 定义

- 使用 `display: flex` 时，必须显式定义 `flex-direction`
- uni-app x 默认 `column`（不同于标准 Web 的 `row`）

#### 强制 `<scroll-view>` 滚动

- App 平台需要滚动时，必须使用 `<scroll-view>` 包装
- 使用 `#ifdef APP` 条件编译

### CSS 选择器限制

- 只支持 class 选择器
- 不支持：子选择器、通用选择器、标签选择器
- 解决方案：为每个需要样式的元素分配特定 class

### UTS 类型安全规则

- 不支持 `undefined`，使用 `null` 替代
- 条件语句必须使用布尔类型
- 对象字面量默认为 `UTSJSONObject` 类型
- 使用 `type` 而非 `interface` 定义字面量类型
- 所有变量和函数必须先声明后使用
- 使用 `let` 或 `const` 替代 `var`

### 知识库引用

知识库位于插件目录下的 knowledges 目录（符号链接到 HBuilderX 安装目录）。

### 子代理重定向协议

- 涉及后端服务、云函数、云对象、JQL、schema.json 的任务，必须委托给 [unicloud] 子代理
- 涉及 UTS 原生插件开发的任务，必须委托给 [uts-native] 子代理
- 不要自己生成后端逻辑，避免上下文污染
```

- [ ] **Step 3: 验证文件**

```bash
cat ~/.claude/plugins/uni-agent/rules/uni-agent.md
```

Expected: 显示规则文件内容

- [ ] **Step 4: Commit**

```bash
git add rules/uni-agent.md
git commit -m "feat: add static rules file with conditional instructions"
```

---

### Task 6: 创建 uni-app 项目检测 Hook（可选）

**Files:**

- Create: `~/.claude/plugins/uni-agent/hooks/detect-uniapp.js`

- [ ] **Step 1: 创建 detect-uniapp.js**

```javascript
#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs')

/**
 * 检测当前目录是否为 uni-app 项目
 * @returns {object} 检测结果
 */
function detectUniAppProject() {
  const cwd = process.cwd()

  // 检测特征文件
  const features = ['manifest.json', 'pages.json', 'App.vue', 'App.nvue', 'App.uvue', 'main.js', 'main.ts', 'main.uts']

  // 检测根目录
  const rootFiles = features.map((f) => path.join(cwd, f))
  const hasRootFiles = rootFiles.some((f) => fs.existsSync(f))

  if (hasRootFiles) {
    // 检测是否为 uni-app x 项目
    const manifestPath = path.join(cwd, 'manifest.json')
    if (fs.existsSync(manifestPath)) {
      try {
        const content = fs.readFileSync(manifestPath, 'utf-8')
        if (content.includes('"uni-app-x"')) {
          return { isUniApp: true, type: 'uni-app-x', path: cwd }
        }
      } catch (e) {
        // 忽略读取错误
      }
    }
    return { isUniApp: true, type: 'uni-app', path: cwd }
  }

  // 检测 src 目录
  const srcDir = path.join(cwd, 'src')
  if (fs.existsSync(srcDir)) {
    const srcFiles = features.map((f) => path.join(srcDir, f))
    const hasSrcFiles = srcFiles.some((f) => fs.existsSync(f))

    if (hasSrcFiles) {
      // 检测是否为 uni-app x 项目
      const manifestPath = path.join(srcDir, 'manifest.json')
      if (fs.existsSync(manifestPath)) {
        try {
          const content = fs.readFileSync(manifestPath, 'utf-8')
          if (content.includes('"uni-app-x"')) {
            return { isUniApp: true, type: 'uni-app-x', path: cwd }
          }
        } catch (e) {
          // 忽略读取错误
        }
      }
      return { isUniApp: true, type: 'uni-app', path: cwd }
    }
  }

  return { isUniApp: false, type: null, path: cwd }
}

// 主程序
const result = detectUniAppProject()

if (result.isUniApp) {
  // 输出检测结果，供 Claude Code 使用
  console.log(`PROJECT_TYPE=${result.type}`)
  console.log(`PROJECT_PATH=${result.path}`)
  process.exit(0)
} else {
  // 非 uni-app 项目，静默退出
  process.exit(0)
}
```

- [ ] **Step 2: 测试脚本**

```bash
cd /path/to/uni-app-project
node ~/.claude/plugins/uni-agent/hooks/detect-uniapp.js
```

Expected: 输出 PROJECT_TYPE=uni-app 或 PROJECT_TYPE=uni-app-x

- [ ] **Step 3: Commit**

```bash
git add hooks/detect-uniapp.js
git commit -m "feat: add uni-app project detection hook"
```

---

### Task 7: 创建安装脚本

**Files:**

- Create: `~/.claude/plugins/uni-agent/scripts/install.js`

- [ ] **Step 1: 创建 install.js**

```javascript
#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs')
const os = require('os')

const PLUGIN_PATH = path.join(os.homedir(), '.claude', 'plugins', 'uni-agent')

// 创建目录结构
function createDirectories() {
  const dirs = ['skills', 'agents', 'rules', 'hooks', 'scripts', 'cache', 'cache/knowledge']

  for (const dir of dirs) {
    const dirPath = path.join(PLUGIN_PATH, dir)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
      console.log(`创建目录: ${dir}`)
    }
  }
}

// 主程序
console.log('开始安装 uni-agent 插件...')
console.log(`插件路径: ${PLUGIN_PATH}`)

// 1. 创建目录结构
createDirectories()

// 2. 运行同步脚本
const syncScript = path.join(PLUGIN_PATH, 'scripts', 'sync-links.js')
if (fs.existsSync(syncScript)) {
  console.log('运行同步脚本...')
  require(syncScript)
} else {
  console.warn('警告：同步脚本不存在，请手动运行 sync-links.js')
}

console.log('安装完成')
console.log('')
console.log('使用方法:')
console.log('  1. 确保 HBuilderX 正在运行')
console.log('  2. 在 uni-app 项目中使用 Claude Code')
console.log('  3. 通过斜杠命令调用技能: /uni-agent:launch-uniapp-or-uniappx')
console.log('')
```

- [ ] **Step 2: 测试脚本**

```bash
node ~/.claude/plugins/uni-agent/scripts/install.js
```

Expected: 创建目录并同步链接

- [ ] **Step 3: Commit**

```bash
git add scripts/install.js
git commit -m "feat: add installation script"
```

---

### Task 8: 配置 Claude Code Hooks

**Files:**

- Modify: `~/.claude/settings.json`

- [ ] **Step 1: 读取现有配置**

```bash
cat ~/.claude/settings.json
```

Expected: 显示现有配置

- [ ] **Step 2: 添加 Hook 配置（可选）**

如果需要项目检测功能，在 `~/.claude/settings.json` 中添加以下配置：

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/plugins/uni-agent/hooks/detect-uniapp.js",
            "timeout": 5000
          }
        ]
      }
    ]
  }
}
```

**Hook 事件类型**（参考 [Claude Code Hooks 文档](https://www.runoob.com/claude-code/claude-code-hooks.html)）：

- `SessionStart`: 会话开始时触发
- `PreToolUse`: 工具调用前触发
- `PostToolUse`: 工具调用后触发
- `Stop`: 会话结束时触发

**注意**: 系统提示词通过 rules 文件注入，不依赖 Hook。此 Hook 仅用于项目检测（可选）。

- [ ] **Step 3: 验证配置**

```bash
cat ~/.claude/settings.json | grep -A 10 "hooks"
```

Expected: 显示 hooks 配置

- [ ] **Step 4: Commit**

```bash
git add ~/.claude/settings.json
git commit -m "feat: add uni-agent hooks to Claude Code settings"
```

---

### Task 9: 测试完整流程

**Files:**

- None

- [ ] **Step 1: 确保 HBuilderX 正在运行**

```bash
# 检查 HBuilderX 进程
ps aux | grep HBuilderX | grep -v grep
```

Expected: 看到 HBuilderX 进程

- [ ] **Step 2: 测试路径检测**

```bash
node ~/.claude/plugins/uni-agent/scripts/detect-hbuilderx-path.js
```

Expected: 输出 HBuilderX 安装路径

- [ ] **Step 3: 测试 CLI 检测**

```bash
node ~/.claude/plugins/uni-agent/scripts/check-hbuilderx.js
```

Expected: 输出 HBuilderX CLI 路径

- [ ] **Step 4: 测试符号链接同步**

```bash
node ~/.claude/plugins/uni-agent/scripts/sync-links.js
```

Expected: 同步技能和子代理链接

- [ ] **Step 5: 测试 uni-app 项目检测**

```bash
cd /path/to/uni-app-project
node ~/.claude/plugins/uni-agent/hooks/detect-uniapp.js
```

Expected: 输出 PROJECT_TYPE=uni-app 或 PROJECT_TYPE=uni-app-x

- [ ] **Step 6: 测试技能调用**

在 uni-app 项目中启动 Claude Code，尝试调用技能：

```
/uni-agent:uniappx-best-practices
```

Expected: 技能被正确调用

---

### Task 10: 编写使用文档

**Files:**

- Create: `~/.claude/plugins/uni-agent/README.md`

- [ ] **Step 1: 创建 README.md**

````markdown
# uni-agent for Claude Code

将 HBuilderX 的 uni-agent 功能移植到 Claude Code，使 Claude Code 能够辅助 uni-app/uni-app x 项目开发。

## 功能特性

- 19 个专项技能（启动项目、查看日志、语法检查、截图等）
- 2 个子代理（uniCloud、UTS 原生插件专家）
- 实时读取 HBuilderX 知识库
- 自动检测 uni-app 项目
- 跨平台支持（Windows、macOS、Linux）

## 安装

### 方式一：自动安装

```bash
cd ~/.claude/plugins/uni-agent
node scripts/install.js
```
````

### 方式二：手动安装

```bash
# 1. 创建目录结构
mkdir -p ~/.claude/plugins/uni-agent/{skills,agents,rules,hooks,scripts,cache/knowledge}

# 2. 运行同步脚本
node ~/.claude/plugins/uni-agent/scripts/sync-links.js
```

## 使用方法

### 通过斜杠命令调用技能

```
/uni-agent:launch-uniapp-or-uniappx
/uni-agent:logcat-uniapp-or-uniappx
/uni-agent:uniappx-syntax-checker
/uni-agent:capture-app-screenshots
/uni-agent:uniappx-best-practices
```

### 通过 Hooks 自动激活

在 uni-app 项目中使用 Claude Code 时，插件会自动检测项目并激活相关技能。

### 通过 Agents 调用子代理

```
@unicloud
@uts-native
```

## 配置

配置文件位置：`~/.claude/plugins/uni-agent/config.jsonc`

```jsonc
{
  // HBuilderX 安装路径（可选，默认自动检测）
  "hbuilderxPath": "",

  // 知识库缓存配置
  "cache": {
    "enabled": false,
    "path": "~/.claude/plugins/uni-agent/cache/knowledge",
  },

  // 更新策略
  "update": {
    "autoSync": true,
    "checkInterval": 0,
  },

  // 日志配置
  "logging": {
    "level": "debug",
    "path": "~/.claude/logs/uni-agent",
  },
}
```

## 故障排除

### HBuilderX 未检测到

1. 确保 HBuilderX 正在运行
2. 设置环境变量 `HBUILDERX_PATH` 或 `HBUILDERX_CLI_PATH`
3. 在 `config.jsonc` 中手动指定 `hbuilderxPath`

### 符号链接创建失败

Windows 用户可能需要：

1. 启用开发者模式
2. 以管理员权限运行

### 技能调用失败

1. 检查 HBuilderX 是否正在运行
2. 检查符号链接是否有效
3. 查看日志：`~/.claude/logs/uni-agent/`

## 版本

跟随 uni-agent 版本号，当前版本：1.2.22

## 许可证

MIT

````

- [ ] **Step 2: 验证文档**

```bash
cat ~/.claude/plugins/uni-agent/README.md
````

Expected: 显示 README 内容

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README for uni-agent plugin"
```

---

## 插件安装与管理

### 安装方式

**方式一：自动安装（推荐）**

```bash
cd ~/.claude/plugins/uni-agent
node scripts/install.js
```

**方式二：手动安装**

```bash
# 1. 创建目录结构
mkdir -p ~/.claude/plugins/uni-agent/{.claude-plugin,skills,agents,rules,hooks,scripts}

# 2. 运行同步脚本
node ~/.claude/plugins/uni-agent/scripts/sync-links.js
```

**方式三：本地测试（开发用）**

使用 `--plugin-dir` 直接加载插件目录（不需要安装）：

```bash
claude --plugin-dir ~/.claude/plugins/uni-agent
```

特点：

- 不需要安装
- 修改后需重启 Claude Code
- 支持同时加载多个插件

**加载多个插件**：

```bash
claude --plugin-dir ./plugin-a --plugin-dir ./plugin-b
```

**适用场景**：

- 插件开发阶段的快速迭代测试
- 验证插件功能是否正常
- 不想污染全局插件配置

### 插件管理命令

```bash
/plugin                # 打开插件管理器
/plugin install         # 安装插件
/plugin uninstall       # 卸载
/plugin enable/disable  # 启用 / 禁用
/plugin marketplace add # 添加市场
/plugin marketplace rm  # 移除市场
```

### 安装范围

| 范围      | 配置文件路径                  | 适用场景                       |
| --------- | ----------------------------- | ------------------------------ |
| `user`    | `~/.claude/settings.json`     | 个人所有项目通用（默认）       |
| `project` | `.claude/settings.json`       | 团队共享，随代码仓同步         |
| `local`   | `.claude/settings.local.json` | 项目专属，被 `.gitignore` 忽略 |

---

## 验证清单

- [ ] 插件目录结构正确
- [ ] 所有 Node.js 脚本可执行
- [ ] HBuilderX 路径检测正常工作
- [ ] HBuilderX CLI 检测正常工作
- [ ] 符号链接同步正常工作（skills、knowledges、common 三个目录）
- [ ] 静态规则文件内容正确
- [ ] Hook 配置正确（可选）
- [ ] 技能可以正常调用
- [ ] 文档完整

---

**计划版本**: 1.0.0
**创建日期**: 2026-05-11
**作者**: Claude Code
