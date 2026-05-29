# CLAUDE.md — packages/configs

共享工程化配置包集合，每个子包独立发布。

## 子包

### @configs/eslint-config

基于 `@antfu/eslint-config`（api/web/base）和 `@uni-helper/eslint-config`（uni），提供四套 ESLint 配置：

- `base.mjs` — 通用配置（排除 api/web 目录）
- `api.mjs` — API 专用（TypeScript + Prettier，忽略 `src/metadata.ts`）
- `web.mjs` — Web 专用（TypeScript + Vue + UnoCSS + Prettier）
- `uni.mjs` — UniApp 专用（`@uni-helper/eslint-config`，TypeScript + Vue + UnoCSS + Prettier）

### @configs/prettier-config

Prettier 共享配置，入口 `src/index.mjs`。

### @configs/commitizen-config

commitizen 交互式提交配置（`cz-customizable`），定义提交类型和范围。入口 `src/index.js`，辅助文件 `messages.js`、`scopes.js`、`types.js`。

### @configs/commitlint-config

commitlint 校验配置，入口 `src/index.mjs`。
