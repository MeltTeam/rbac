# CLAUDE.md — apps/uni

UniApp 跨平台移动端（微信小程序、H5、支付宝、百度、京东、快手、飞书、QQ、头条、鸿蒙、小红书、快应用）。

当前处于脚手架阶段：HTTP 工具和页面均为空桩，无状态管理。

## 常用命令

```bash
pnpm dev:mp-weixin    # 微信小程序开发
pnpm dev:h5           # H5 开发
pnpm build:mp-weixin  # 微信小程序构建
pnpm build:h5         # H5 构建
pnpm type-check       # vue-tsc --noEmit 类型检查
pnpm lint             # format + eslint 检查
pnpm lint:fix         # format + eslint 修复
```

其他平台命令格式：`dev:mp-{platform}` / `build:mp-{platform}`（alipay/baidu/jd/kuaishou/lark/qq/toutiao/harmony/xhs）。

## 架构

- HTTP 工具：`src/api/http/HttpUtils.ts`（空桩），实际请求拦截在 `src/api/index.ts`（`apiPlugin` 注册 `uni.addInterceptor('request', ...)`）
- 路由：`src/router/index.ts`（`routerPlugin` 注册 `navigateTo`/`reLaunch`/`redirectTo`/`switchTab` 拦截器）
- 页面配置：`src/pages.json`（目前仅 `pages/index/index`）
- 依赖 `@packages/types` 共享 DTO/VO/枚举
- ESLint 使用 `@uni-helper/eslint-config`（非 antfu）
