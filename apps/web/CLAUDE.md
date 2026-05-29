# CLAUDE.md — apps/web

Vue 3 + Vite + TypeScript 管理前端。Element Plus UI，UnoCSS 原子化样式，Pinia 状态管理。

## 常用命令

```bash
pnpm dev           # type-check + vite 开发服务器（端口 4002）
pnpm build         # type-check + vite build（npm-run-all2 并行）
pnpm g:api         # openapi-ts 生成 API 客户端 + eslint + prettier 修复
pnpm g:css         # 生成 CSS（script/gCss.mjs）
pnpm lint          # format + eslint 检查
pnpm lint:fix      # format + eslint 修复
pnpm type-check    # vue-tsc --build 类型检查
```

## 架构

### API 层（src/apis/）

由 `openapi-ts-request` 从 Swagger 文档自动生成，按模块组织（auth/menu/resource/role/roleMenu/roleResource/user/userRole 等）。修改 API 后运行 `pnpm g:api` 重新生成。

### 路由（src/routers/）

- 静态路由 `STATIC_ROUTES`（login/error 等固定页面）— `modules/staticRoutes.ts`
- 动态路由 `dynamicRouteRegistry`（权限控制，运行时注册）— `modules/dynamicRoutes.ts`
- 路由守卫 `createPermGuard`（权限校验）— `guard/perm.ts`
- 路由解析 `parseRoute.ts`，路由注册 `registry.ts`
- 历史模式通过 `VITE_ROUTER_HISTORY_MODE` 环境变量切换（hash/history/memory）

### 状态管理（src/stores/modules/）

`app` / `user` / `perm` / `theme` / `mode` / `tagsView` / `loginCache`

### HTTP 工具（src/utils/http/）

`HttpUtils` 封装 axios，插件体系（`plugins/`）：token 注入、防重复请求、限流、网络状态检测、网络错误处理、debug 模式。

### 国际化（src/i18n/）

vue-i18n，`locales/en.json` + `locales/zh-CN.json`。

### Vite 插件链

Vue → Vue JSX → UnoCSS(vue-scoped) → AutoImport(vue/vueuse/pinia/vue-router/vue-i18n) → Components(ElementPlus resolver) → VueI18n → Compression → Imagemin → HTML injection

### 代理

开发/预览模式 `/api` 代理到 `http://192.168.0.103:4001`，rewrite 去掉 `/api` 前缀。

### 构建分包

manualChunks: vue / vue-router / pinia / element-plus / utils(axios+lodash-es) / loginView

## 路径别名

`@/` → `src/`（vite resolve.alias + tsconfig paths）
