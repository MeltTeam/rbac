# CLAUDE.md — packages/gen

Plop 代码生成器，Handlebars 模板。入口 `src/index.mjs`。

## 生成器

- **bm**（Business Module）：`plop --plopfile ./node_modules/@packages/gen/src/plopfiles/api.mjs bm` — 生成完整 DDD 模块（domain/app/iface/infra 四层）
- **type**：`plop --plopfile ./node_modules/@packages/gen/src/plopfiles/types.mjs` — 生成 packages/types 的 DTO/VO

## 模板目录

模板位于 `templates/`（非 `src/templates/`）：

- `templates/api/crud/` — API 模块模板（app/domain/iface/infra 各层）
- `templates/types/crud/` — Types 包模板（dto/vo）
- `templates/web/crud/` — Web 模块模板（待实现）

## 结构

- `src/generator/` — 生成器定义（api/bm、types/type、web/）
- `src/helper/` — Handlebars helpers
- `src/actionType/` — 自定义 plop action 类型
- `src/config/` — 模板路径配置（`templatePath` 指向 `../../templates`）
- `src/plopfiles/` — Plop 入口文件
