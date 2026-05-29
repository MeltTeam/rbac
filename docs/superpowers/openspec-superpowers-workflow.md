# OpenSpec + Superpowers 操作手册

本文档详细说明在整个项目开发迭代周期中，何时使用什么命令和技能。

---

## 目录

1. [完整开发生命周期概览](#1-完整开发生命周期概览)
2. [阶段一：需求探索](#2-阶段一需求探索)
3. [阶段二：方案提议（OpenSpec）](#3-阶段二方案提议openspec)
4. [阶段三：设计细化（Superpowers）](#4-阶段三设计细化superpowers)
5. [阶段四：计划编写](#5-阶段四计划编写)
6. [阶段五：工作区准备](#6-阶段五工作区准备)
7. [阶段六：实现执行](#7-阶段六实现执行)
8. [阶段七：测试驱动开发](#8-阶段七测试驱动开发)
9. [阶段八：调试排错](#9-阶段八调试排错)
10. [阶段九：代码审查](#9-阶段九代码审查)
11. [阶段十：分支收尾与归档](#10-阶段十分支收尾与归档)
12. [并行开发场景](#11-并行开发场景)
13. [快速参考卡片](#12-快速参考卡片)

---

## 1. 完整开发生命周期概览

```
需求探索 ──→ 方案提议 ──→ 设计细化 ──→ 计划编写 ──→ 工作区准备
   │            │            │            │            │
   │  OpenSpec  │  OpenSpec  │ Superpowers│ Superpowers│ Superpowers
   │  explore   │  propose   │brainstorming│writing-plans│using-worktrees
   │            │            │            │            │
   ↓            ↓            ↓            ↓            ↓
实现执行 ──→ 测试驱动 ──→ 代码审查 ──→ 分支收尾 ──→ 变更归档
   │            │            │            │            │
   │ Superpowers│ Superpowers│ Superpowers│ Superpowers│  OpenSpec
   │subagent/   │    TDD     │code-review │  finishing │  archive
   │executing   │            │            │  -branch   │
   ↓            ↓            ↓            ↓            ↓
 [同步 OpenSpec tasks.md 完成状态]              [归档变更目录]
```

**关键决策点：**

- 需求模糊？→ 先 explore，再 propose/brainstorming
- 变更简单（<5 任务）？→ propose → apply-change
- 变更复杂（≥5 任务）？→ propose → brainstorming → writing-plans → subagent-driven

---

## 2. 阶段一：需求探索

### 何时进入

- 用户提出一个模糊的想法（"我想加个权限守卫"）
- 用户描述了一个问题但没说清要做什么（"认证系统太乱了"）
- 需要理解现有代码结构再决定方向

### 使用技能

**`/opsx:explore`** 或 **`/openspec-explore`**

### 操作步骤

```bash
# 1. 检查现有 OpenSpec 变更上下文
pnpx openspec list --json

# 2. 如果有相关变更，读取 artifacts 了解背景
# （由技能自动完成）

# 3. 进入自由探索模式
# - 询问澄清性问题（一次一个）
# - 用 ASCII 图表可视化架构
# - 探索代码库中的相关实现
# - 对比不同方案的权衡
```

### 产出

- 无正式文档产出（纯思考与讨论）
- 可能产出：对问题的清晰理解、方案方向、风险识别

### 退出条件

- 想法足够清晰，可以正式化 → 进入阶段二或阶段三
- 用户想继续探索 → 留在本阶段
- 发现需要先做技术调研 → 创建 spike 任务

### 示例对话

```
用户: 我想给 API 加上基于资源的权限控制

Claude: [调用 /opsx:explore]

        ┌─────────────────────────────────────────┐
        │     当前 RBAC 权限模型                    │
        ├─────────────────────────────────────────┤
        │                                         │
        │   User ──→ Role ──→ Permission          │
        │                         │               │
        │                    仅基于操作             │
        │                    (CRUD 级别)           │
        │                                         │
        │   缺失: 资源级别的细粒度控制              │
        │   例如: 用户只能编辑自己创建的资源         │
        └─────────────────────────────────────────┘

        你说的"基于资源的权限控制"具体指哪种？
        A. 同一资源类型内按实例区分（如只改自己的文章）
        B. 资源类型级别的权限（如文章模块 vs 评论模块）
        C. 字段级别的权限（如只能改标题不能改状态）
```

---

## 3. 阶段二：方案提议（OpenSpec）

### 何时进入

- 需求已明确，需要创建正式变更提案
- 想快速产出 proposal + design + tasks 一整套 artifacts
- 偏好 OpenSpec 的变更管理流程

### 使用技能

**`/opsx:propose`** 或 **`/openspec-propose`**

### 操作步骤

```bash
# 1. 创建变更目录
pnpx openspec new change "<change-name>"
# change-name 使用 kebab-case，如 "resource-based-permission"

# 2. 查看变更状态和 artifact 依赖
pnpx openspec status --change "<change-name>" --json

# 3. 按依赖顺序创建 artifacts（由技能自动完成）
pnpx openspec instructions <artifact-id> --change "<change-name>" --json
# 依次创建: proposal.md → design.md → tasks.md

# 4. 确认所有 applyRequires artifacts 完成
pnpx openspec status --change "<change-name>"
```

### 产出

- `openspec/changes/<change-name>/proposal.md` — 做什么 & 为什么
- `openspec/changes/<change-name>/design.md` — 怎么做
- `openspec/changes/<change-name>/tasks.md` — 实现步骤清单

### 退出条件

- 所有 `applyRequires` artifacts 状态为 `done`
- 用户审阅并批准提案

### 与 Superpowers 的衔接

- 如果变更简单（<5 任务，无复杂交互）→ 直接进入阶段六，用 `/opsx:apply` 实现
- 如果变更复杂 → 进入阶段三，用 Superpowers 细化设计

### 示例

```
用户: 提议一个变更，给 API 加资源级权限控制

Claude: [调用 /opsx:propose]

        创建变更: resource-based-permission

        [运行 openspec new change "resource-based-permission"]
        [获取 artifact 构建顺序]
        [创建 proposal.md] ✓
        [创建 design.md] ✓
        [创建 tasks.md] ✓

        变更已就绪！Artifacts:
        - proposal.md: 基于资源的权限控制方案
        - design.md: 资源守卫 + 策略模式设计
        - tasks.md: 7 个实现任务

        运行 /opsx:apply 开始实现，或继续细化设计。
```

---

## 4. 阶段三：设计细化（Superpowers）

### 何时进入

- 变更复杂，需要更深入的设计讨论
- 需要正式的设计文档和用户批准流程
- OpenSpec propose 产出的 design.md 需要进一步细化
- 从零开始的新功能，尚未创建 OpenSpec 变更

### 使用技能

**`/superpowers:brainstorming`**

### 操作步骤

```
1. 探索项目上下文（检查文件、文档、最近提交）
2. [可选] 提供视觉伴侣（如涉及 UI/架构可视化）
3. 逐一询问澄清性问题（一次一个，优先多选）
4. 提出 2-3 种方案及权衡分析
5. 分段展示设计，每段获取用户确认
6. 撰写设计文档 → docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md
7. 自审设计文档（占位符、一致性、范围、歧义）
8. 用户审阅设计文档
9. 调用 writing-plans 进入计划编写
```

### 产出

- `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` — 正式设计文档
- Git 提交记录

### 与 OpenSpec 的衔接

- 如果已有 OpenSpec 变更：将 brainstorming 产出的设计决策更新到 `design.md`
- 如果没有 OpenSpec 变更：brainstorming 完成后，用 `/opsx:propose` 创建变更，将设计文档内容填入 artifacts

### 关键规则

- **硬门控**：设计未获用户批准前，禁止任何实现动作
- **YAGNI**：无情砍掉不必要的功能
- **单一出口**：brainstorming 完成后只调用 `writing-plans`，不调用其他实现技能

---

## 5. 阶段四：计划编写

### 何时进入

- 设计已获批准（brainstorming 完成）
- 或 OpenSpec tasks.md 已就绪，需要转为详细实现计划

### 使用技能

**`/superpowers:writing-plans`**

### 操作步骤

```
1. 读取设计文档 / OpenSpec artifacts
2. 范围检查：如果涉及多个独立子系统，拆分为多个计划
3. 映射文件结构：列出每个要创建/修改的文件及其职责
4. 编写任务清单：
   - 每个步骤 2-5 分钟可完成
   - 包含完整代码（禁止占位符）
   - 包含精确文件路径
   - 包含验证命令和预期输出
5. 自审计划（规格覆盖、占位符扫描、类型一致性）
6. 保存到 docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md
7. 提供执行选项：
   - Subagent-Driven（推荐）
   - Inline Execution
```

### 产出

- `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md` — 详细实现计划

### 计划文档格式

```markdown
# [功能名] 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** [一句话描述]
**Architecture:** [2-3 句架构说明]
**Tech Stack:** [关键技术/库]

---

### Task 1: [组件名]

**Files:**

- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts:123-145`
- Test: `tests/exact/path/to/test.ts`

- [ ] **Step 1: 写失败测试**
- [ ] **Step 2: 运行测试确认失败**
- [ ] **Step 3: 写最小实现**
- [ ] **Step 4: 运行测试确认通过**
- [ ] **Step 5: 提交**
```

### 与 OpenSpec 的衔接

- 计划中的任务应与 `tasks.md` 一一对应或细化
- 实现时同步更新 `tasks.md` 的 checkbox 状态

---

## 6. 阶段五：工作区准备

### 何时进入

- 计划已就绪，准备开始实现
- 必须在实现之前完成

### 使用技能

**`/superpowers:using-git-worktrees`**

### 操作步骤

```bash
# 1. 检查现有 worktree 目录
ls -d .worktrees 2>/dev/null

# 2. 确认目录已被 gitignore
git check-ignore -q .worktrees 2>/dev/null
# 如果未被忽略，添加到 .gitignore 并提交

# 3. 创建 worktree
git worktree add .worktrees/<branch-name> -b <branch-name>

# 4. 进入 worktree 安装依赖
cd .worktrees/<branch-name>
pnpm install

# 5. 验证基线测试通过
pnpm test  # 或项目对应的测试命令
```

### 产出

- 隔离的 git worktree 工作区
- 基线测试通过确认

### 本项目特殊配置

- Worktree 目录：`.worktrees/`（项目本地，隐藏目录）
- 依赖安装：`pnpm install`（禁止 npm/yarn）
- 测试命令：根据子工程不同，参见各子工程 `CLAUDE.md`

---

## 7. 阶段六：实现执行

### 何时进入

- 工作区已准备就绪
- 实现计划已编写（Superpowers 路线）或 tasks.md 已就绪（OpenSpec 路线）

### 路线选择

#### 路线 A：简单变更（<5 任务，无复杂交互）

**使用技能：** `/opsx:apply`

```bash
# 1. 选择变更
pnpx openspec list --json

# 2. 查看变更状态
pnpx openspec status --change "<name>" --json

# 3. 获取实现指令
pnpx openspec instructions apply --change "<name>" --json

# 4. 读取上下文文件（proposal/design/tasks）

# 5. 逐项实现任务，每完成一项标记 - [x]

# 6. 完成后查看状态
pnpx openspec status --change "<name>"
```

#### 路线 B：复杂变更（≥5 任务，需 TDD 和审查）

**使用技能：** `/superpowers:subagent-driven-development`（推荐）或 `/superpowers:executing-plans`

**Subagent-Driven 流程：**

```
1. 读取计划文件，提取所有任务
2. 创建 TodoWrite 跟踪进度
3. 对每个任务：
   a. 派发实现子代理（implementer-prompt.md）
   b. 子代理提问？→ 回答后重新派发
   c. 子代理实现 + 测试 + 提交 + 自审
   d. 派发规格审查子代理（spec-reviewer-prompt.md）
   e. 规格不合规？→ 实现子代理修复 → 重新审查
   f. 派发代码质量审查子代理（code-quality-reviewer-prompt.md）
   g. 质量不通过？→ 实现子代理修复 → 重新审查
   h. 标记任务完成
4. 所有任务完成后，派发最终代码审查
5. 进入分支收尾
```

**Executing-Plans 流程：**

```
1. 读取并审查计划
2. 创建 TodoWrite
3. 逐任务执行（严格按步骤）
4. 每 3 个任务暂停检查
5. 所有任务完成后进入分支收尾
```

### 同步 OpenSpec 状态

无论走哪条路线，实现过程中都应同步更新 OpenSpec 的 `tasks.md`：

```markdown
# tasks.md 中将已完成的任务标记为完成

- [x] 创建资源守卫装饰器
- [x] 实现策略接口
- [ ] 集成到现有模块
```

### 修改后 lint

每次修改代码后，执行对应子工程的 lint 命令：

```bash
# 后端
cd apps/api && pnpm lint

# 前端
cd apps/web && pnpm lint

# 移动端
cd apps/uni && pnpm lint

# 共享类型
cd packages/types && pnpm lint
```

---

## 8. 阶段七：测试驱动开发

### 何时进入

- 每个实现步骤开始前
- 每个修复 bug 前

### 使用技能

**`/superpowers:test-driven-development`**

### TDD 循环

```
RED（写失败测试）
  ↓
验证 RED（运行测试，确认失败原因正确）
  ↓
GREEN（写最小实现代码）
  ↓
验证 GREEN（运行测试，确认通过且无其他测试失败）
  ↓
REFACTOR（清理代码，保持测试通过）
  ↓
下一个 RED
```

### 本项目测试命令

```bash
# 后端单元测试
pnpm --filter api test

# 后端 e2e 测试
pnpm --filter api test:e2e

# 前端测试
pnpm --filter web test

# 特定测试文件
pnpm --filter api test -- path/to/test.spec.ts
```

### 关键规则

- **铁律**：没有失败测试，不写生产代码
- 先写代码再补测试？删除代码，从测试开始重来
- 测试立即通过？说明测的不是新行为，修复测试
- 禁止跳过验证步骤

---

## 9. 阶段八：调试排错

### 何时进入

- 测试失败且原因不明
- 运行时出现意外行为
- 构建失败
- 集成问题

### 使用技能

**`/superpowers:systematic-debugging`**

### 四阶段流程

```
阶段 1：根因调查
  - 仔细阅读错误信息
  - 稳定复现
  - 检查最近变更（git diff）
  - 多组件系统：在每个边界添加诊断日志
  - 追踪数据流（从错误值向上追溯）

阶段 2：模式分析
  - 找到相似的工作代码
  - 对比差异
  - 理解依赖

阶段 3：假设与测试
  - 形成单一假设
  - 最小化测试
  - 验证后继续或换假设

阶段 4：实现修复
  - 先写失败测试（回归测试）
  - 实现单一修复
  - 验证修复有效
  - 3+ 次修复失败 → 质疑架构
```

### 关键规则

- **铁律**：没有根因调查，不提修复方案
- 禁止"先试试改这个"的猜测式调试
- 3 次修复失败后必须停下来讨论架构

---

## 10. 阶段九：代码审查

### 何时进入

- 每个子代理任务完成后（subagent-driven 模式）
- 每批 3 个任务完成后（executing-plans 模式）
- 主要功能实现完成后
- 合并前

### 使用技能

**审查请求：** `/superpowers:requesting-code-review`
**审查反馈处理：** `/superpowers:receiving-code-review`

### 审查流程

```bash
# 1. 获取 git SHA
BASE_SHA=$(git rev-parse HEAD~1)  # 或 origin/main
HEAD_SHA=$(git rev-parse HEAD)

# 2. 派发 code-reviewer 子代理
# （由技能自动完成，传入实现内容、计划/需求、SHA 范围）

# 3. 处理反馈
# - Critical: 立即修复
# - Important: 修复后再继续
# - Minor: 记录后续处理
```

### 反馈处理规则

- 禁止表演性赞同（"你说得对！""好建议！"）
- 先验证再实现：检查反馈在当前代码库中是否成立
- 不清楚就问，不要猜测
- 有技术理由可以反驳
- 逐项修复，每项单独测试

---

## 11. 阶段十：分支收尾与归档

### 何时进入

- 所有任务实现完成
- 所有测试通过
- 代码审查通过

### 步骤 1：验证完成

**使用技能：** `/superpowers:verification-before-completion`

```
1. 识别：什么命令能证明这个声明？
2. 运行：执行完整命令
3. 阅读：完整输出，检查退出码，统计失败数
4. 验证：输出是否确认声明？
5. 只有通过验证才能做完成声明
```

### 步骤 2：收尾分支

**使用技能：** `/superpowers:finishing-a-development-branch`

```bash
# 1. 验证测试通过
pnpm test

# 2. 确定基础分支
git merge-base HEAD main 2>/dev/null || git merge-base HEAD dev 2>/dev/null

# 3. 呈现选项：
#    1. 本地合并到基础分支
#    2. 推送并创建 PR
#    3. 保留分支（稍后处理）
#    4. 丢弃工作

# 4. 执行用户选择

# 5. 清理 worktree（选项 1 和 4）
git worktree remove .worktrees/<branch-name>
```

### 步骤 3：归档变更

**使用技能：** `/opsx:archive`

```bash
# 1. 选择要归档的变更
pnpx openspec list --json

# 2. 检查 artifact 完成状态
pnpx openspec status --change "<name>" --json

# 3. 检查 tasks.md 完成状态

# 4. [可选] 同步 delta specs 到主 specs

# 5. 执行归档
mkdir -p openspec/changes/archive
mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>

# 6. 显示归档摘要
```

### 产出

- 分支已合并/PR 已创建/分支已保留
- Worktree 已清理（如适用）
- OpenSpec 变更已归档

---

## 12. 并行开发场景

### 何时使用

- 2+ 个独立任务可并行执行
- 任务间无共享状态或顺序依赖
- 例如：不同模块的 bug 修复、独立的测试文件失败

### 使用技能

**`/superpowers:dispatching-parallel-agents`**

### 操作步骤

```
1. 识别独立域：将任务按问题领域分组
2. 创建聚焦的代理任务：每个代理一个明确范围
3. 并行派发代理
4. 审查并整合结果
5. 运行完整测试套件验证
```

### 代理提示词要求

- **聚焦**：一个明确的问题域
- **自包含**：所有理解问题所需的上下文
- **明确输出**：代理应返回什么

### 禁止场景

- 任务间有关联（修复一个可能影响另一个）
- 需要理解完整系统状态
- 代理会编辑相同文件

---

## 13. 快速参考卡片

### 命令速查

| 场景           | 命令/技能                                     | 说明                       |
| -------------- | --------------------------------------------- | -------------------------- |
| 自由探索需求   | `/opsx:explore`                               | 思考伙伴，不写代码         |
| 快速提议变更   | `/opsx:propose`                               | 产出 proposal/design/tasks |
| 正式化设计     | `/superpowers:brainstorming`                  | 必须获批准后才能实现       |
| 编写实现计划   | `/superpowers:writing-plans`                  | 2-5 分钟粒度的任务         |
| 创建隔离工作区 | `/superpowers:using-git-worktrees`            | 实现前必须                 |
| 简单变更实现   | `/opsx:apply`                                 | 按 tasks.md 逐项实现       |
| 复杂变更实现   | `/superpowers:subagent-driven-development`    | 子代理 + 两阶段审查        |
| 顺序执行计划   | `/superpowers:executing-plans`                | 批量执行 + 检查点          |
| TDD            | `/superpowers:test-driven-development`        | RED-GREEN-REFACTOR         |
| 系统化调试     | `/superpowers:systematic-debugging`           | 四阶段根因分析             |
| 请求代码审查   | `/superpowers:requesting-code-review`         | 派发审查子代理             |
| 处理审查反馈   | `/superpowers:receiving-code-review`          | 验证后实现，可反驳         |
| 完成前验证     | `/superpowers:verification-before-completion` | 证据优先于声明             |
| 收尾分支       | `/superpowers:finishing-a-development-branch` | 合并/PR/保留/丢弃          |
| 归档变更       | `/opsx:archive`                               | 归档到 archive 目录        |
| 并行开发       | `/superpowers:dispatching-parallel-agents`    | 独立任务并行               |

### OpenSpec CLI 速查

```bash
pnpx openspec list --json                          # 列出所有变更
pnpx openspec new change "<name>"                   # 创建新变更
pnpx openspec status --change "<name>" --json       # 查看变更状态
pnpx openspec instructions <artifact> --change "<name>" --json  # 获取 artifact 指令
pnpx openspec instructions apply --change "<name>" --json       # 获取实现指令
```

### 决策树

```
收到需求
  │
  ├─ 需求模糊？ ──→ /opsx:explore ──→ 想法清晰后 ──┐
  │                                                  │
  ├─ 需求清晰？ ─────────────────────────────────────┤
  │                                                  │
  ↓                                                  ↓
变更复杂度？
  │
  ├─ 简单（<5 任务）──→ /opsx:propose ──→ /superpowers:using-git-worktrees ──→ /opsx:apply
  │
  └─ 复杂（≥5 任务）──→ /opsx:propose ──→ /superpowers:brainstorming
                           ──→ /superpowers:writing-plans
                           ──→ /superpowers:using-git-worktrees
                           ──→ /superpowers:subagent-driven-development
                           ──→ /superpowers:finishing-a-development-branch
                           ──→ /opsx:archive
```

### 常见错误与纠正

| 错误                          | 纠正                        |
| ----------------------------- | --------------------------- |
| 跳过 explore 直接 propose     | 先探索理解问题空间          |
| 跳过 brainstorming 直接写代码 | 设计必须先获批准            |
| 在 main 上直接实现            | 必须用 worktree 隔离        |
| 先写代码再补测试              | 删掉代码，TDD 从测试开始    |
| 猜测式调试                    | 先根因调查再修复            |
| 声称完成但没验证              | 运行验证命令，用证据说话    |
| 忽略代码审查反馈              | Critical/Important 必须修复 |
| 实现完忘记归档                | 用 /opsx:archive 归档变更   |
| 修改代码后不 lint             | 执行对应子工程的 lint 命令  |
