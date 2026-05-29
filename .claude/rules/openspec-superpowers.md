---
name: openspec-superpowers-workflow
description: OpenSpec 与 Superpowers 联动组合的最佳实践规则
type: project
---

# OpenSpec + Superpowers 联动工作流

## 核心原则

- **OpenSpec 管"做什么"**：需求探索、方案提议、设计文档、任务拆分、变更归档
- **Superpowers 管"怎么做"**：头脑风暴、计划编写、TDD 实现、代码审查、分支收尾
- **两者互补而非替代**

## 探索阶段决策

- **需求模糊** → `opsx:explore`（思考伙伴，不产出正式文档）
- **需求清晰** → `superpowers:brainstorming`（设计流程，必须产出设计文档并获批准）
- **已有变更上下文** → `opsx:explore` 读取 artifacts 后再决定
- 联动：先 explore 理清思路 → brainstorming 正式化设计 → 或直接 `opsx:propose` 快速产出提案

## 实现阶段决策

- **简单变更**（<5 任务，无复杂交互）→ `opsx:apply` 直接按 tasks.md 实现
- **复杂变更**（≥5 任务，需 TDD/审查）→ `superpowers:writing-plans` → `superpowers:subagent-driven-development`
- **任务有耦合** → `superpowers:executing-plans`（顺序执行 + 检查点）
- 联动：实现过程中用 `opsx:apply` 同步标记 tasks.md 完成状态

## 完整流程（复杂变更）

1. `opsx:explore` 或 `superpowers:brainstorming` → 设计获批准
2. `opsx:propose` → 产出 proposal/design/tasks
3. `superpowers:writing-plans` → 详细实现计划
4. `superpowers:using-git-worktrees` → 隔离工作区
5. `superpowers:subagent-driven-development` → 逐任务实现（TDD + 两阶段审查）
6. `superpowers:verification-before-completion` → 验证完成
7. `superpowers:finishing-a-development-branch` → 收尾分支
8. `opsx:archive` → 归档变更

## 领域技能映射

| 领域     | 技能                                             |
| -------- | ------------------------------------------------ |
| 后端 API | `nestjs-best-practices`                          |
| 前端 UI  | `vue` / `vue-best-practices` / `frontend-design` |
| 状态管理 | `pinia`                                          |
| 样式     | `unocss`                                         |
| 包管理   | `pnpm`                                           |
| 构建     | `turborepo` / `vite` / `tsdown`                  |
| 测试     | `vitest` / `vue-testing-best-practices`          |
| 路由     | `vue-router-best-practices`                      |
| 工具函数 | `vueuse-functions`                               |

## 禁止事项

- 禁止跳过 brainstorming 直接实现
- 禁止跳过 TDD
- 禁止跳过验证
- 禁止在 main/master 上直接实现
- 禁止忽略 Critical/Important 审查反馈
- 禁止 apply-change 时猜测（不清晰则暂停询问）
