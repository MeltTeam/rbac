# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

Monorepo RBAC 系统，pnpm workspaces + Turborepo：

- **apps/api** - NestJS 后端（DDD + CQRS），详见 `apps/api/CLAUDE.md`
- **apps/web** - Vue 3 管理前端，详见 `apps/web/CLAUDE.md`
- **apps/uni** - UniApp 跨平台移动端，详见 `apps/uni/CLAUDE.md`
- **packages/gen** - Plop 代码生成器，详见 `packages/gen/CLAUDE.md`
- **packages/types** - 共享 TypeScript 类型（DTO/VO/枚举），详见 `packages/types/CLAUDE.md`
- **packages/configs/** - 共享配置（`commitizen-config`、`commitlint-config`、`eslint-config`、`prettier-config`）
- **scripts/** - 工程化脚本（`deploy.sh`）

Node >= 20.19.2，pnpm 9.5.0，registry 默认 npmmirror.com。`pnpm-workspace.yaml` 的 `catalogs` 提供命名版本集（`catalog:api_prod`、`catalog:api_dev`、`catalog:web_prod`、`catalog:web_dev`、`catalog:uni_prod`、`catalog:uni_dev`、`catalog:cli`）。

## 根目录命令

```bash
pnpm dev:api          # 启动 API 开发服务器（HMR）
pnpm dev:web          # 启动 Web 开发服务器
pnpm build:api        # 构建 API
pnpm build:web        # 构建 Web
pnpm docker:dev:start # 启动 Docker 开发基础设施（MySQL, Redis, MongoDB）
pnpm docker:dev:stop  # 停止 Docker 容器
pnpm docker:dev:del   # 删除 Docker 容器及数据卷
pnpm git:commit       # 交互式提交（commitizen）
```

## Docker 开发

`docker-compose.dev.yml` 仅提供基础设施（无应用容器）：

- MySQL 8.4（3306）、Redis 7.4（6379）、MongoDB 8.0（27017）
- 自定义桥接网络 `dev_rbac_network`（192.168.3.0/24）
- 镜像来自腾讯云 registry，数据卷在 `./docker-volumes/`

## 提交规范

commitizen + `cz-customizable`，运行 `pnpm git:commit` 交互式提交。

格式：`<type>(<scope>): <subject>`

**类型**（23）：`init`、`feat`、`fix`、`merge`、`impr`、`perf`、`docs`、`refactor`、`test`、`cache`、`delete`、`move`、`release`、`deploy`、`config`、`upgrade`、`downgrade`、`style`、`build`、`script`、`chore`、`sync`、`revert`

**范围**（11）：`frontend`、`backend`、`api`、`utils`、`ui`、`database`、`doc`、`test`、`config`、`design`、`docker`

Hooks：`pre-commit` → lint-staged（eslint + prettier），`commit-msg` → commitlint

## Turborepo 任务

`turbo.json` 定义全局任务：`build`（依赖 `^build`）、`dev`（持久化、不缓存）、`lint`（依赖 `^build`）、`format`、`start`（依赖 `build`）、`clear`、`clean`。

## 跨包依赖关系

```
packages/types ← apps/api, apps/uni（共享 DTO/VO/枚举）
packages/gen   ← apps/api（g:bm 生成模块）, apps/web, apps/uni, packages/types
packages/configs/* ← 所有子工程（ESLint/Prettier/commitizen/commitlint 配置）
```

修改 `packages/types` 后需执行 `pnpm build`（Rollup 重新构建 CJS+ESM+d.ts），因为 `preinstall` hook 会自动构建。
