/* eslint-disable style/quote-props */
import { defineConfig, presetAttributify, presetIcons, presetWind3, transformerDirectives, transformerVariantGroup } from 'unocss'
import { themeVars } from './theme/vars'

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.(vue|ts|js|tsx|jsx)$/],
      exclude: ['node_modules/**', 'dist/**'],
    },
  },

  preflights: [
    {
      getCSS: (_) => {
        // console.warn((theme as any).colors)
        return ``
      },
    },
  ],
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
      // collections: {
      //   iconPark: () => import('@iconify-json/icon-park/icons.json').then((i) => i.default),
      // },
    }),
  ],
  // 白名单生成
  // safelist: [...themeSafelist],
  // 注入自定义主题变量
  theme: {
    ...themeVars,
  },
  // 组合新类名
  shortcuts: [
    {
      'wh-full': 'w-full h-full',
      'wh-screen': 'w-screen h-screen',
      'wh-auto': 'w-auto h-auto',
      'flex-center': 'flex justify-center items-center',
      'flex-col': 'flex flex-col',
      'flex-col-center': 'flex-col flex-center',
    },
  ],
  transformers: [
    // 指令配置,例子:tailwindcss的@apply
    transformerDirectives(),
    // 组合写法配置,例子:text-red text-green可以写成text-(red green)
    transformerVariantGroup(),
  ],
})
