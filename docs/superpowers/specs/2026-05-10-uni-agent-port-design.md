# uni-agent 移植到 Claude Code 设计文档

> 参考文档：[Claude Code 插件](https://www.runoob.com/claude-code/claude-code-plugins.html) | [插件参考手册](https://www.runoob.com/claude-code/claude-code-plugin-ref.html)

## 1. 概述

### 1.1 目标

将 HBuilderX 的 uni-agent 功能移植到 Claude Code，使 Claude Code 能够辅助 uni-app/uni-app x 项目开发。

### 1.2 范围

- 移植 uni-agent 的全部功能：知识库、技能、子代理
- 使用 Claude Code 插件机制（skills + hooks）
- 实时读取 HBuilderX 安装目录的文件
- 支持自动更新

### 1.3 约束

- 保留 HBuilderX CLI 依赖（启动项目、查看日志、语法检查、截图）
- 项目级作用域（仅在 uni-app 项目中生效）
- 跨平台支持（Windows、macOS、Linux）

### 1.4 插件 vs 独立配置

Claude Code 支持两种扩展方式：

| 方式                      | 命令形式             | 适合场景                   |
| ------------------------- | -------------------- | -------------------------- |
| 独立配置（`.claude/`）    | `/hello`             | 个人使用、单项目、快速实验 |
| 插件（`.claude-plugin/`） | `/plugin-name:hello` | 团队共享、跨项目、版本化   |

**什么时候用独立配置？**

- 只在当前项目使用
- 个人工作流
- 尚未稳定的实验性配置
- 想要简短命令名（如 `/review`）

**什么时候用插件？**

- 要在**多个项目复用**
- 要**分享给团队或社区**
- 需要**版本控制、升级、回滚**
- 计划通过市场分发
- 可以接受命名空间命令（避免冲突）

**最佳实践：** 先在 `.claude/` 中迭代 → 稳定后打包为插件

**uni-agent 选择插件方式的原因：**

- 需要跨项目复用（所有 uni-app 项目）
- 需要版本管理（跟随 HBuilderX 版本）
- 需要通过市场分发

### 1.5 什么时候一定要用插件？

- 你已经有**稳定的 Claude 工作流**
- 你在**反复复制 `.claude/`**
- 团队成员开始问你："这个怎么配置？"
- 你希望 Claude 像 IDE 插件一样可控

> **插件，是 Claude Code 从"个人 AI 助手"走向"工程化工具"的分水岭**

## 2. 架构设计

### 2.1 目录结构

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
├── scripts/                           # 工具脚本（固定，Node.js，不链接）
│   ├── sync-links.js                 # 同步链接
│   ├── check-hbuilderx.js            # 检测 HBuilderX CLI
│   ├── detect-hbuilderx-path.js      # 检测 HBuilderX 安装路径
│   └── install.js                    # 安装脚本
├── agents/                            # 子代理定义（固定，不链接）
│   ├── unicloud.md                   # 从 uni-agent 转换为 Claude Code 格式
│   └── uts-native.md                 # 从 uni-agent 转换为 Claude Code 格式
└── config.jsonc                       # 配置文件（自动生成）
```

**重要规则**（参考 [Claude Code 插件文档](https://www.runoob.com/claude-code/claude-code-plugins.html)）：

- `.claude-plugin/` 目录中**只能放 `plugin.json`**
- 其他目录（skills、agents、hooks 等）必须在插件根目录
- `plugin.json` 是插件的"身份证"，决定插件名称、版本、作者等信息

**说明**:

- `{HBuilderX}` 代表 HBuilderX 的安装路径，通过动态检测获取。每个用户的路径可能不同。
- **skills**: 整个目录链接，`~/.claude/plugins/uni-agent/skills` -> `{HBuilderX}/.../skills/`
- **knowledges**: 整个目录链接，`~/.claude/plugins/uni-agent/knowledges` -> `{HBuilderX}/.../knowledges/`
- **common**: 整个目录链接，`~/.claude/plugins/uni-agent/common` -> `{HBuilderX}/.../common/`
- **rules**: 静态规则文件 + 条件指令，内容固定，缓存友好
- **hooks**: 仅用于项目检测（可选），系统提示词通过 rules 文件注入
- **agents**: 不链接，因为 OpenCode 和 Claude Code 的 MD 格式有差异，需要手动转换
- **scripts**: 固定文件，不链接
- 所有脚本使用 Node.js 编写，确保跨平台兼容性（Windows、macOS、Linux）。
- uni-app 开发者已安装 Node.js，无需额外依赖。

### 2.2 插件清单（plugin.json）

`plugin.json` 是插件的**核心配置文件**，存放于 `.claude-plugin/` 目录下。

**必需字段**：

| 字段   | 类型   | 要求                        | 示例          |
| ------ | ------ | --------------------------- | ------------- |
| `name` | string | 唯一标识符，kebab-case 格式 | `"uni-agent"` |

**核心元数据字段**：

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
  "keywords": ["uni-app", "uni-app-x", "vue", "mobile", "cross-platform"]
}
```

**组件路径字段**：

用于指定自定义组件的位置，路径需**相对插件根目录**且以 `./` 开头：

```json
{
  "skills": ["./skills"],
  "rules": ["./rules"]
}
```

**注意**：

- Hooks 不在 `plugin.json` 中配置，而是在 `~/.claude/settings.json` 或 `hooks/hooks.json` 文件中配置
- 如果 `agents` 目录为空，可以不配置 `agents` 字段
- 使用目录路径（如 `./skills`）而非 glob 模式（如 `./skills/*/SKILL.md`）

**环境变量**：

`${CLAUDE_PLUGIN_ROOT}`：插件根目录的绝对路径，用于脚本和配置中引用插件内文件，避免路径错误。

### 2.3 中间层链接

使用符号链接（symlink）指向 HBuilderX 安装目录的文件：

**HBuilderX 安装路径检测**:

HBuilderX 的安装路径因用户而异，需要动态检测。检测优先级：

1. **环境变量**: `HBUILDERX_PATH` 或 `HBUILDERX_CLI_PATH`
2. **进程检测**: 从正在运行的 HBuilderX 进程获取路径
3. **常见安装位置**:
   - Windows: `%APPDATA%\HBuilder X\` 或 `%LOCALAPPDATA%\HBuilder X\`
   - macOS: `~/Library/Application Support/HBuilder X/`
   - Linux: `~/.config/HBuilder X/`
4. **用户配置**: 在 `config.jsonc` 中手动指定路径

**路径检测脚本** (`detect-hbuilderx-path.js`):

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

**uni-agent 子目录**:
检测到 HBuilderX 安装路径后，uni-agent 子目录位于：

```
<HBuilderX安装路径>/plugins/hbuilderx-ai-chat/uni-agent
```

**链接类型**:

- Windows: `mklink` 或 `mklink /D`（需要管理员权限或启用开发者模式）
- macOS/Linux: `ln -s`

**链接管理**:

- 创建 `sync-links.js` 脚本管理链接
- 每次使用 Claude Code 时验证链接有效性
- 如果链接损坏，自动修复或提示用户

### 2.4 知识库访问

**实时读取**:

- 直接从 HBuilderX 安装目录读取知识库文件
- 路径：`<HBuilderX安装路径>/plugins/hbuilderx-ai-chat/uni-agent/knowledges/`
- 无需缓存，实时读取最新内容

**路径解析**:

- 使用动态检测获取 HBuilderX 安装路径
- 支持环境变量、进程检测、常见安装位置、用户配置等多种方式
- 自动处理不同操作系统的路径格式

**路径检测优先级**:

1. 环境变量 `HBUILDERX_PATH` 或 `HBUILDERX_CLI_PATH`
2. 进程检测（从正在运行的 HBuilderX 获取路径）
3. 常见安装位置（AppData、Library、.config 等）
4. 用户配置文件 `config.jsonc` 中的 `hbuilderxPath` 字段

### 2.5 插件能力总览

| 能力     | 用途                            | uni-agent 使用情况      |
| -------- | ------------------------------- | ----------------------- |
| Commands | 自定义斜杠命令                  | 通过 skills 实现        |
| Agents   | 专用子代理                      | ✅ unicloud、uts-native |
| Skills   | 教会 Claude 何时用某种能力      | ✅ 19 个技能            |
| Hooks    | 自动化（写完文件后执行命令等）  | ✅ 项目检测             |
| MCP      | 连接外部服务（GitHub、DB、API） | ❌ 未使用               |
| LSP      | 代码智能（跳转、类型检查）      | ❌ 未使用               |

### 2.6 典型插件分类

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

### 2.7 从 `.claude/` 迁移到插件

| 原来                  | 迁移后                    |
| --------------------- | ------------------------- |
| `.claude/commands`    | `plugin/commands`         |
| `.claude/agents`      | `plugin/agents`           |
| `settings.json hooks` | `plugin/hooks/hooks.json` |

迁移后：

- 插件版本优先生效
- 可删除旧 `.claude/` 配置避免重复

## 3. 核心组件

### 3.1 Skills（技能）

移植 uni-agent 的 19 个技能为 Claude Code skills 格式：

| 技能名称                                    | 描述                                  | HBuilderX 依赖 |
| ------------------------------------------- | ------------------------------------- | -------------- |
| launch-uniapp-or-uniappx                    | 运行 uni-app/uni-app x 项目到指定平台 | 是             |
| logcat-uniapp-or-uniappx                    | 获取运行控制台日志                    | 是             |
| uniappx-syntax-checker                      | 验证 uts/uvue 文件语法                | 是             |
| capture-app-screenshots                     | 获取运行时截图                        | 是             |
| uniappx-best-practices                      | 提供最佳实践指引                      | 否             |
| uniappx-pitfalls-and-tips                   | 提供开发注意事项                      | 否             |
| uniappx-cross-platform-guide                | 跨平台开发指南                        | 否             |
| uniappx-layout                              | 布局指南                              | 否             |
| easycom-component-usage                     | easycom 组件使用                      | 否             |
| find-matching-plugin                        | 查找匹配插件                          | 否             |
| how_to_use_uni_module                       | 使用 uni_module                       | 否             |
| how-to-write-unicloud-backend               | 编写 uniCloud 后端                    | 否             |
| how-to-write-uts-plugin                     | 编写 UTS 插件                         | 否             |
| optimize-subpackage                         | 优化分包                              | 否             |
| resolve-packaging-problem                   | 解决打包问题                          | 否             |
| submit-issue-report                         | 提交问题报告                          | 否             |
| uts-diff-ts                                 | UTS 与 TS 差异                        | 否             |
| verify-uniappx-compile-error                | 验证编译错误                          | 否             |
| write-or-run-testcase-for-uniapp-or-uniappx | 编写/运行测试用例                     | 否             |

**技能文件格式**:

```markdown
---
name: launch-uniapp-or-uniappx
description: 运行 uni-app/uni-app x 项目到指定平台
---

### 参数说明

...

### 执行逻辑

...
```

### 3.2 斜杠命令（最常用插件能力）

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

### 3.3 Agents（子代理）

移植 2 个子代理为 Claude Code agents 格式：

| 子代理名称 | 描述                  |
| ---------- | --------------------- |
| unicloud   | uniCloud 后端服务专家 |
| uts-native | UTS 原生插件专家      |

**子代理文件格式**:

```markdown
---
mode: subagent
displayName: uniCloud
description: Design and implement backend services for uni-app x.
---

# 系统提示词

...
```

### 3.4 Rules（静态规则 + 条件指令）

使用静态规则文件 + 条件指令的方式注入系统提示词，内容固定，缓存友好。

**优势**:

- 规则文件内容固定，不影响 LLM 缓存命中率
- LLM 根据上下文自动选择适用的规则
- 不依赖 Hook 机制，简单可靠

**规则文件格式** (`rules/uni-agent.md`):

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

### 3.5 Hooks（钩子）

创建 `detect-uniapp.js` 脚本，用于：

1. 检测当前目录是否为 uni-app/uni-app x 项目
2. 如果是，自动注入系统提示词
3. 激活相关技能

**Hook 事件类型**（参考 [Claude Code Hooks 文档](https://www.runoob.com/claude-code/claude-code-hooks.html)）：

| 事件           | 触发时机       |
| -------------- | -------------- |
| `SessionStart` | 会话开始时触发 |
| `PreToolUse`   | 工具调用前触发 |
| `PostToolUse`  | 工具调用后触发 |
| `Stop`         | 会话结束时触发 |

**Hook 配置** (添加到 `~/.claude/settings.json`):

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

**Hook 脚本 1** (`detect-uniapp.js`):
检测当前目录是否为 uni-app 项目，输出项目类型和路径。

**Hook 脚本 2** (`inject-system-prompt.js`):
根据项目类型动态生成系统提示词，参考 uni-agent 的 `u(p)` 函数。

```javascript
#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs')
const os = require('os')

// 检测项目类型
function detectProjectType() {
  const cwd = process.cwd()
  const features = ['manifest.json', 'pages.json', 'App.vue', 'App.nvue', 'App.uvue', 'main.js', 'main.ts', 'main.uts']

  // 检测根目录
  const hasRootFiles = features.some((f) => fs.existsSync(path.join(cwd, f)))
  if (hasRootFiles) {
    const manifestPath = path.join(cwd, 'manifest.json')
    if (fs.existsSync(manifestPath)) {
      try {
        const content = fs.readFileSync(manifestPath, 'utf-8')
        if (content.includes('"uni-app-x"')) return 'uni-app-x'
      } catch {}
    }
    return 'uni-app'
  }

  // 检测 src 目录
  const srcDir = path.join(cwd, 'src')
  if (fs.existsSync(srcDir)) {
    const hasSrcFiles = features.some((f) => fs.existsSync(path.join(srcDir, f)))
    if (hasSrcFiles) {
      const manifestPath = path.join(srcDir, 'manifest.json')
      if (fs.existsSync(manifestPath)) {
        try {
          const content = fs.readFileSync(manifestPath, 'utf-8')
          if (content.includes('"uni-app-x"')) return 'uni-app-x'
        } catch {}
      }
      return 'uni-app'
    }
  }

  return null
}

// uni-app 提示词
const UNI_APP_PROMPT = `# Project
This is a uni-app project (cross-platform framework for Vue.js).

You are uni-agent, the best coding agent on the planet.
You are an expert developer for uni-app

## uni-app H5 输入框兼容性注意事项

### 不要对 input / textarea / 设置 box-sizing: border-box

在 uni-app 项目中，尤其是 H5 平台，只要对 input、textarea 设置了 box-sizing: border-box，无论是在 App.vue 全局样式、单个页面样式、class 样式，还是直接写在 style 属性中，都可能导致输入框无法获得焦点、无法正常输入等问题。
`

// uni-app x 提示词
const UNI_APP_X_PROMPT = `# Project
This is a uni-app x project (cross-platform framework for Vue.js).

You are uni-agent, the best coding agent on the planet.
You are an expert developer for uni-app and uni-app x.

## Key Conventions
- You are **FORBIDDEN** from generating any code snippets without read skill \`uniappx-best-practices\` and \`uniappx-pitfalls-and-tips\`.
- **STRICT COMPLIANCE REQUIRED**: You must strictly adhere to the \`Knowledge Acquisition Priority & Boundary Protocol\` during execution.

### Knowledge Acquisition Priority & Boundary Protocol
* **Priority 1:** Retrieve information using the skills \`uniappx-best-practices\` and \`uniappx-pitfalls-and-tips\`.
* **Priority 2:** Utilize the local knowledge base.
* **Forbidden Actions:** It is strictly prohibited to retrieve information directly from the web when dealing with **uni-app x** related knowledge.

### CRITICAL: UI Implementation Rules
- **Rule: Mandatory Flex Direction Definition**
  * Whenever \`display: flex\` is used, you **MUST** explicitly define \`flex-direction\`
  * uni-app x defaults to \`column\` (unlike standard Web's \`row\`)

- **Rule: Mandatory \`<scroll-view>\` for App-Side Scrolling**
  * For any page that requires scrolling, wrap content in \`<scroll-view>\`
  * Use \`#ifdef APP\` conditional compilation

### CRITICAL: CSS Selector Limitations
uni-app x only supports **class selectors**. It does **not** support:
* Child selectors, universal selectors, tag selectors
* Solution: Use independent class selectors exclusively

### CRITICAL: UTS Type-Safety Rules
* \`undefined\` is Not Supported - use \`null\`
* Conditional Statements Must Use Boolean Type
* Object Literals Default to \`UTSJSONObject\` Type
* Use \`type\` instead of \`interface\` for literal types
* All Variables and Functions MUST be Declared Before Use
* Use \`let\` or \`const\` Instead of \`var\`

## Subagent Redirection Protocol
- Backend tasks (cloud functions, JQL, schema.json) → [unicloud] subagent
- UTS native plugin tasks → [uts-native] subagent
`

// 主程序
const projectType = detectProjectType()

if (!projectType) {
  // 非 uni-app 项目，静默退出
  process.exit(0)
}

// 输出系统提示词
const prompt = projectType === 'uni-app-x' ? UNI_APP_X_PROMPT : UNI_APP_PROMPT
console.log(prompt)
process.exit(0)
```

## 4. HBuilderX 集成

### 4.1 路径检测

**检测顺序**:

1. 优先检测进程列表中的 HBuilderX
2. 其次检查环境变量 `HBUILDERX_CLI_PATH`
3. 两者都支持，优先进程检测

**检测脚本** (`check-hbuilderx.js`):

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

### 4.2 错误处理

如果 HBuilderX 未运行：

- 提示用户启动 HBuilderX
- 提供启动命令和环境变量设置说明
- 跳过依赖 HBuilderX CLI 的技能

## 5. 更新机制

### 5.1 自动同步

**同步策略**:

- 每次使用 Claude Code 时检查 uni-agent 目录变化
- 使用文件修改时间判断是否需要更新链接
- 自动更新链接指向新版本的文件

**同步脚本** (`sync-links.js`):

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

// 创建符号链接
function createSymlink(target, source) {
  const targetDir = path.dirname(target)
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  // 删除已存在的链接
  if (fs.existsSync(target)) {
    fs.unlinkSync(target)
  }

  // 创建符号链接
  try {
    fs.symlinkSync(source, target)
    return true
  } catch (e) {
    // Windows 可能需要管理员权限，尝试使用 junction
    if (os.platform() === 'win32') {
      try {
        fs.symlinkSync(source, target, 'junction')
        return true
      } catch (e2) {
        console.error(`创建链接失败: ${e2.message}`)
        return false
      }
    }
    console.error(`创建链接失败: ${e.message}`)
    return false
  }
}

// 主程序
const pluginPath = path.join(os.homedir(), '.claude', 'plugins', 'uni-agent')

// 检测 HBuilderX 安装路径
const hbuilderxPath = detectHBuilderXPath()
if (!hbuilderxPath) {
  console.error('错误：未找到 HBuilderX 安装路径')
  console.error('请设置环境变量 HBUILDERX_PATH 或在 config.jsonc 中配置 hbuilderxPath')
  process.exit(1)
}

const agentPath = path.join(hbuilderxPath, 'plugins', 'hbuilderx-ai-chat', 'uni-agent')

// 检查 uni-agent 目录是否存在
if (!fs.existsSync(agentPath)) {
  console.error(`错误：uni-agent 目录不存在: ${agentPath}`)
  process.exit(1)
}

console.log(`HBuilderX 安装路径: ${hbuilderxPath}`)
console.log(`uni-agent 路径: ${agentPath}`)

// 同步技能链接
const skillsDir = path.join(agentPath, 'skills')
if (fs.existsSync(skillsDir)) {
  const skillDirs = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  for (const skillName of skillDirs) {
    const source = path.join(skillsDir, skillName, 'SKILL.md')
    const target = path.join(pluginPath, 'skills', skillName, 'SKILL.md')

    if (fs.existsSync(source)) {
      if (createSymlink(target, source)) {
        console.log(`同步技能: ${skillName}`)
      }
    }
  }
}

// 同步子代理链接
const agentsDir = path.join(agentPath, 'subagents', 'uni-app-x')
if (fs.existsSync(agentsDir)) {
  const agentFiles = fs.readdirSync(agentsDir).filter((f) => f.endsWith('.md'))

  for (const agentFile of agentFiles) {
    const agentName = path.basename(agentFile, '.md')
    const source = path.join(agentsDir, agentFile)
    const target = path.join(pluginPath, 'agents', `${agentName}.md`)

    if (createSymlink(target, source)) {
      console.log(`同步子代理: ${agentName}`)
    }
  }
}

// 保存检测到的路径到配置文件
const configPath = path.join(pluginPath, 'config.jsonc')
if (!fs.existsSync(configPath)) {
  const config = {
    hbuilderxPath: hbuilderxPath,
    cache: {
      enabled: false,
      path: '~/.claude/plugins/uni-agent/cache/knowledge',
    },
    update: {
      autoSync: true,
      checkInterval: 0,
    },
    logging: {
      level: 'debug',
      path: '~/.claude/logs/uni-agent',
    },
  }

  // 添加注释
  const configContent = `{
  // HBuilderX 安装路径（自动检测）
  "hbuilderxPath": "${hbuilderxPath.replace(/\\/g, '\\\\')}",

  // 知识库缓存配置
  "cache": {
    "enabled": false,
    "path": "~/.claude/plugins/uni-agent/cache/knowledge"
  },

  // 更新策略
  "update": {
    "autoSync": true,
    "checkInterval": 0
  },

  // 日志配置
  "logging": {
    "level": "debug",
    "path": "~/.claude/logs/uni-agent"
  }
}
`

  fs.writeFileSync(configPath, configContent, 'utf-8')
  console.log(`已创建配置文件: ${configPath}`)
}

console.log('同步完成')
```

### 5.2 无感更新

- 更新过程对用户透明
- 不需要手动干预
- 更新后自动验证链接有效性

## 6. 配置管理

### 6.1 配置文件

**格式**: JSONC（支持注释）
**位置**: `~/.claude/plugins/uni-agent/config.jsonc`

```jsonc
{
  // HBuilderX 安装路径（可选，默认自动检测）
  // 如果自动检测失败，可以手动指定路径
  // Windows 示例: "C:\\Users\\用户名\\AppData\\Roaming\\HBuilder X"
  // macOS 示例: "/Users/用户名/Library/Application Support/HBuilder X"
  // Linux 示例: "/home/用户名/.config/HBuilder X"
  "hbuilderxPath": "",

  // 知识库缓存配置
  "cache": {
    "enabled": false, // 默认关闭，实时读取
    "path": "~/.claude/plugins/uni-agent/cache/knowledge",
  },

  // 更新策略
  "update": {
    "autoSync": true, // 自动同步
    "checkInterval": 0, // 每次使用时检查
  },

  // 日志配置
  "logging": {
    "level": "debug", // error, warn, info, debug
    "path": "~/.claude/logs/uni-agent",
  },
}
```

### 6.2 项目级配置

支持项目目录下的 `.claude/uni-agent.jsonc` 配置，覆盖全局配置的特定设置。

## 7. 安装和使用

### 7.1 插件市场（Plugin Marketplace）

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

### 7.2 安装脚本

创建 `install.js` 脚本，自动完成：

1. 创建目录结构
2. 复制插件文件
3. 配置 Claude Code 设置
4. 初始化链接

**安装方式**:

```bash
# 方式一：直接运行安装脚本（从本地路径）
cd ~/.claude/plugins/uni-agent
node scripts/install.js

# 方式二：手动安装
# 1. 创建目录结构
mkdir -p ~/.claude/plugins/uni-agent/{skills,agents,rules,hooks,scripts,cache/knowledge}

# 2. 运行同步脚本
node ~/.claude/plugins/uni-agent/scripts/sync-links.js
```

**安装脚本** (`install.js`):

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

### 7.3 使用方式

**通过斜杠命令调用技能**:

```
/uni-agent:launch-uniapp-or-uniappx
/uni-agent:logcat-uniapp-or-uniappx
/uni-agent:uniappx-syntax-checker
```

**通过 hooks 自动激活**:

- 检测到 uni-app 项目时自动注入系统提示词
- 自动激活相关技能

**通过 agents 调用子代理**:

```
@unicloud
@uts-native
```

### 7.4 插件管理命令

```bash
/plugin                # 打开插件管理器
/plugin install         # 安装插件
/plugin uninstall       # 卸载
/plugin enable/disable  # 启用 / 禁用
/plugin marketplace add # 添加市场
/plugin marketplace rm  # 移除市场
```

### 7.5 安装范围

| 范围      | 配置文件路径                  | 适用场景                       |
| --------- | ----------------------------- | ------------------------------ |
| `user`    | `~/.claude/settings.json`     | 个人所有项目通用（默认）       |
| `project` | `.claude/settings.json`       | 团队共享，随代码仓同步         |
| `local`   | `.claude/settings.local.json` | 项目专属，被 `.gitignore` 忽略 |

### 7.6 本地测试（开发用）

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

## 8. 跨平台支持

### 8.1 操作系统

- **Windows**: 使用 Node.js `fs.symlinkSync()` 创建符号链接（支持 junction 作为备选方案）
- **macOS**: 使用 Node.js `fs.symlinkSync()` 创建软链接
- **Linux**: 使用 Node.js `fs.symlinkSync()` 创建软链接

### 8.2 路径处理

- 使用 Node.js `path` 模块处理跨平台路径
- 自动处理不同操作系统的路径分隔符
- 使用 `os.homedir()`、`process.env` 等获取系统路径
- 支持自定义 HBuilderX 安装路径

## 9. 性能优化

### 9.1 响应时间

- 目标：5 秒内响应
- 使用缓存减少重复读取（可选）
- 按需加载知识库文件

### 9.2 资源管理

- 限制缓存大小（如果启用）
- 定期清理过期缓存
- 监控磁盘空间使用

## 10. 安全和隐私

### 10.1 操作日志

- 记录所有操作日志
- 日志位置：`~/.claude/logs/uni-agent/`
- 日志格式：JSON
- 日志保留：30 天

### 10.2 数据安全

- 不收集用户数据
- 不上传知识库内容
- 本地存储所有配置和缓存

## 11. 扩展性

### 11.1 自定义技能

支持用户创建自定义技能：

- 技能目录：`~/.claude/plugins/uni-agent/skills/custom/`
- 遵循 uni-agent 的技能格式

### 11.2 自定义配置

支持项目级配置覆盖：

- 项目目录下的 `.claude/uni-agent.jsonc`
- 覆盖全局配置的特定设置

### 11.3 自定义知识库

支持用户添加自己的知识库文件：

- 知识库目录：`~/.claude/plugins/uni-agent/knowledges/custom/`

## 12. 测试和文档

### 12.1 测试策略

1. **手动测试**: 逐个测试每个技能
2. **自动化测试**: 后续创建自动化测试脚本

### 12.2 文档

创建详细的使用文档，包含：

- 安装指南
- 配置说明
- 使用教程
- 故障排除

## 13. 版本和许可证

### 13.1 版本管理

- 跟随 uni-agent 的版本号
- 使用语义化版本控制

### 13.2 许可证

- 使用 MIT 许可证

## 14. 实施计划

### 14.1 阶段一：基础架构（1-2 天）

1. 创建插件目录结构
2. 实现链接管理脚本
3. 实现 HBuilderX 检测脚本
4. 创建 plugin.json 配置

### 14.2 阶段二：技能移植（2-3 天）

1. 移植 19 个技能定义
2. 移植 2 个子代理定义
3. 创建精简后的系统提示词

### 14.3 阶段三：集成测试（1-2 天）

1. 测试所有技能
2. 测试子代理功能
3. 测试自动更新机制

### 14.4 阶段四：文档和发布（1 天）

1. 编写使用文档
2. 创建安装脚本
3. 发布插件

## 15. 调试与排错

### 15.1 调试命令

运行以下命令查看插件加载详情，定位配置和加载问题：

```bash
claude --debug
```

可查看：插件加载状态、清单语法错误、组件注册情况、MCP/LSP 服务器初始化日志。

### 15.2 高频问题与解决方案

| 问题               | 原因                                           | 解决办法                                                     |
| ------------------ | ---------------------------------------------- | ------------------------------------------------------------ |
| 插件未加载         | `plugin.json` 语法错误或缺少必需字段           | 用 `claude plugin validate` 验证 JSON 语法，补充 `name` 字段 |
| 自定义命令不显示   | 命令文件放在 `.claude-plugin/` 内              | 将 `commands/` 目录移到插件根目录                            |
| 钩子脚本不执行     | 脚本没有可执行权限                             | 运行 `chmod +x scripts/your-script.sh` 赋予权限              |
| MCP 服务器启动失败 | 路径使用绝对路径，未用 `${CLAUDE_PLUGIN_ROOT}` | 替换为环境变量引用，如 `${CLAUDE_PLUGIN_ROOT}/server`        |

### 15.3 版本管理与分发

- **版本规范**：遵循语义化版本 `MAJOR.MINOR.PATCH`，比如 `1.2.3`
- **分发渠道**：通过插件市场分发，或直接分享插件目录（需包含完整结构）
- **更新日志**：建议在插件根目录添加 `CHANGELOG.md`，记录版本更新内容

## 16. 风险和缓解

### 16.1 风险

1. **HBuilderX 路径变化**: HBuilderX 更新后路径可能变化
2. **链接损坏**: 符号链接可能因各种原因损坏
3. **权限问题**: Windows 创建符号链接需要管理员权限

### 16.2 缓解措施

1. **路径检测**: 支持多种路径检测方式
2. **链接验证**: 每次使用时验证链接有效性
3. **权限提示**: 提供详细的权限设置说明

---

**文档版本**: 1.0.0
**创建日期**: 2026-05-10
**作者**: Claude Code
