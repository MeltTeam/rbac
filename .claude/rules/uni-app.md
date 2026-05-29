---
paths:
  - '{apps}/uni/src/**/*.{vue,ts}'
---

# Uni-App 跨端开发规则

> 仅适用于 `apps/uni` 子项目。Vue 通用规则见 `vue.md`。

## 核心约束

- **uni API 优先** — 禁止 `window`/`document`/`localStorage` 等 Web 专属 API，统一用 `uni.*`
- **跨端标签** — 用 `<view>`/`<text>`/`<image>` 替代 `<div>`/`<span>`/`<img>`
- **条件编译** — 平台差异用 `#ifdef`/`#ifndef` 处理，禁止运行时 `if` 判断平台
- **SSR 安全** — `main.ts` 用 `createSSRApp`，代码中禁止访问 `window`/`document`
- **TypeScript** — 所有 `.ts` 和 `<script lang="ts">` 必须通过 `vue-tsc --noEmit`

## 组件规范

- 使用 `<script setup>` + Composition API，禁止 Options API
- 遵循 easycom 规范：`components/组件名/组件名.vue` 自动注册，无需手动 import
- 优先使用 `@dcloudio/uni-ui`；禁止引入 Element Plus
- 页面结构：`pages/页面名/index.vue`，私有组件放 `pages/页面名/components/`
- 公共组件放 `src/components/`，按功能命名

## 路由与导航

- 路由在 `src/pages.json` 统一配置，禁止硬编码路径字符串
- 用 `uni.addInterceptor` 拦截 `navigateTo`/`redirectTo`/`reLaunch`/`switchTab` 做登录态与权限校验
- 页面传参：基础类型走 URL query（需 `encodeURIComponent`），复杂对象走 Store 或 `uni.setStorageSync`
- `navigateTo` 最多 10 层页面栈，深层级用 `redirectTo`/`reLaunch`

## 网络请求

- 请求统一封装在 `src/api/`，组件中禁止直接 `uni.request`
- 用 `uni.addInterceptor('request')` 注入 token、统一错误码、处理 token 过期
- 请求/响应使用 TypeScript 接口定义
- 封装 `get`/`post`/`put`/`delete`，内部统一处理 loading 与错误提示
- 表单提交做防重（loading 状态锁或节流）

## 生命周期

- `App.vue` 用 `onLaunch`/`onShow`/`onHide`（来自 `@dcloudio/uni-app`）
- 页面用 `onLoad`/`onReady`/`onShow`/`onHide`/`onPullDownRefresh`/`onReachBottom`
- `onLaunch` 仅做轻量初始化，耗时操作延后到 `onShow` 或按需触发
- `onLoad(options)` 参数均为字符串，需手动类型转换

## 表单与交互

- 使用 `<input>`/`<picker>`/`<textarea>` 等 uni 内置组件
- `<input>` 用 `@input` 事件配合 `v-model`，非原生 `onChange`
- 操作反馈：`uni.showToast`（轻提示）/ `uni.showModal`（确认弹窗）/ `uni.showLoading`
- 下拉刷新需 `pages.json` 启用 + `onPullDownRefresh` 中调用 `uni.stopPullDownRefresh()`

## 样式规范

- 尺寸用 `rpx`；主题色/字号/间距用 `uni.scss` 变量，禁止硬编码
- 状态栏高度用 `uni.getSystemInfoSync().statusBarHeight`
- 静态资源放 `src/static/`，通过 `/static/xxx` 绝对路径引用
- 深度选择器只用 `:deep()`，禁止 `::v-deep`/`/deep/`
- 小程序端 `background-image` 仅支持网络 URL 或 base64；`@font-face` 同理

## 存储与状态

- 本地存储用 `uni.setStorageSync`/`uni.getStorageSync`，键名统一为常量
- 单 key ≤ 1MB，总存储 ≤ 10MB（小程序限制）
- Pinia store 初始化在 `createApp` 之后、挂载之前
- token 存储在 `uni.setStorageSync`，拦截器读取注入，过期时清除并跳转登录页

## 事件处理

- 用 `@tap` 替代 `@click`（避免 300ms 延迟）
- 传参用 `@tap="handler(item.id)"`，禁止 `data-*` + `e.currentTarget.dataset`
- 阻止冒泡用 `@tap.stop`；长按用 `@longpress`

## 配置管理

- `pages.json`：`globalStyle` 设全局导航栏样式，页面 `style` 仅覆盖差异项
- `manifest.json`：appid/版本/权限/平台配置统一维护，禁止硬编码
- `tabBar`：最少 2 个、最多 5 个，图标放 `src/static/`

## 平台差异

- **小程序** — 禁止 `eval`/`new Function`；`WebSocket`/`canvas` API 有差异
- **H5** — 可用部分 Web API，但必须 `#ifdef H5` 隔离
- **App** — 原生插件与 5+ API 仅 App 可用，用 `#ifdef APP-PLUS`
- 运行时判断平台用 `uni.getSystemInfoSync().platform`，禁止 `navigator.userAgent`

## 性能优化

- 图片加 `lazy-load` 并设固定宽高；大图走 CDN
- 长列表用 `scroll-view` + 分页，禁止一次渲染过多节点
- 控制页面节点 ≤ 1000 个，避免深嵌套
- 首屏提供骨架屏/loading 状态

## 国际化

- 使用 `vue-i18n`，`$t()` 或 `useI18n()` 取文本
- 禁止模板和逻辑中硬编码中文/英文
- key 用点分隔层级命名（如 `login.submitBtn`）

## 代码组织

- 目录约定：`src/pages/`（页面）、`src/api/`（请求）、`src/static/`（资源）、`src/constants/`（常量）
- 路由拦截器与请求拦截器分别封装，`main.ts` 中 `app.use()` 注册

## 调试与构建

- H5：`pnpm dev:h5` / `pnpm build:h5`
- 微信小程序：`pnpm dev:mp-weixin` / `pnpm build:mp-weixin`
- 提交前：`pnpm type-check` + `pnpm lint`
- 小程序功能务必真机验证（权限弹窗、支付、分享等模拟器无法覆盖）
