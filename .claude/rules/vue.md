---
paths:
  - '{apps}/{web,uni}/src/**/*.{vue}'
---

# Vue 项目配置

> 通用最佳实践已由技能覆盖：`vue`、`vue-best-practices`、`pinia`、`vue-router-best-practices`、`vueuse-functions`、`vue-testing-best-practices`、`unocss`。本文件仅记录项目特有配置。

## 组件库

- **Element Plus**：UI 组件库优先使用 Element Plus，避免重复造轮子

## 样式项目配置

- **Attributify 前缀**：项目启用 `presetAttributify`，前缀为 `uno-`（仅限前缀模式），禁止使用无前缀的 attributify 以避免与 HTML 原生属性冲突
- **Variant Group**：项目启用 `transformerVariantGroup`，相同前缀的工具类可用括号合并（如 `hover:(bg-blue-600 text-white)`）
- **CSS 指令**：项目启用 `transformerDirectives`，在 `<style>` 中可使用 `@apply`、`@screen`、`theme()`、`icon()`，但模板中应优先使用 class 而非 `@apply`
- **Shortcuts**：项目配置了 shortcuts（定义于 `plugins/uno/vars`），优先使用已有 shortcut 替代重复的类名组合
- **图标类名**：项目启用 `presetIcons`（前缀 `i-`），图标使用类名方式（如 `i-mdi-alarm`、`i-carbon-sun dark:i-carbon-moon`），单色图标用 `currentColor` 着色，彩色图标加 `?bg` 后缀

## 路由项目配置

- **权限守卫**：使用 `createPermGuard` 进行权限校验

## 国际化

- **vue-i18n**：使用 `$t()` 或 `useI18n()` 进行文本国际化
- **禁止硬编码**：模板和逻辑中禁止硬编码中文/英文字符串
- **键名规范**：i18n key 使用点分隔的层级命名（例如，`login.submitBtn`）

## 代码组织

- **目录结构**：页面放 `pages/`，布局放 `layouts/`，公共组件放 `components/`
- **就近原则**：页面私有组件放在页面目录下的 `components/` 子目录
- **自动导入**：利用 unplugin-auto-import 和 unplugin-vue-components 自动导入，无需手动 import
- **API 层分离**：API 调用通过 `src/apis/` 层封装，不在组件中直接调用 axios
- **Store 目录**：Pinia Store 定义于 `stores/modules/` 目录，文件名与导出名保持一致，使用 camelCase
