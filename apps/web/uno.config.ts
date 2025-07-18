/* eslint-disable style/quote-props */
import { defineConfig, presetAttributify, presetWind3, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.(vue|ts|js|tsx|jsx)$/],
      exclude: ['node_modules/**', 'dist/**'],
    },
  },
  presets: [
    // 兼容Tailwind CSS v3 / Windi CSS配置
    presetWind3(),
    // 属性写法配置
    presetAttributify({
      prefix: 'uno-',
      prefixedOnly: true,
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
