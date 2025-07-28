/* eslint-disable style/quote-props */
import { defineConfig, presetAttributify, presetIcons, presetWind3, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.(vue|ts|js|tsx|jsx)$/],
      exclude: ['node_modules/**', 'dist/**'],
    },
  },
  presets: [
    // 兼容Tailwind CSS v3 / Windi CSS配置
    presetWind3({
      dark: 'class',
    }),
    // 属性写法配置
    presetAttributify({
      prefix: 'uno-',
      prefixedOnly: true,
    }),
    // 图标配置
    presetIcons({
      warn: true,
      // 前缀
      prefix: ['i-'],
      // 图标样式
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      // 打包时分包
      collections: {
        iconPark: () => import('@iconify-json/icon-park/icons.json').then((i) => i.default),
      },
    }),
  ],
  rules: [
    ['wh-full', { width: '100%', height: '100%' }],
    ['wh-screen', { width: '100vw', height: '100vh' }],
    ['auto-wh', { width: 'auto', height: 'auto' }],
    [
      'f-c-c',
      {
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
      },
    ],
  ],
  transformers: [
    // 指令配置,例子:tailwindcss的@apply
    transformerDirectives(),
    // 组合写法配置,例子:text-red text-green可以写成text-(red green)
    transformerVariantGroup(),
  ],
})
