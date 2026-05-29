/* eslint-disable style/quote-props */
import { defineConfig, presetAttributify, presetIcons, presetWind3, transformerDirectives, transformerVariantGroup } from 'unocss'
import { shortcuts, themeVars } from './plugins/uno/vars'

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.(vue|ts|js|tsx|jsx)$/],
      exclude: ['node_modules/**', 'dist/**'],
    },
  },

  presets: [
    presetWind3({
      dark: 'class',
    }),
    presetAttributify({
      prefix: 'uno-',
      prefixedOnly: true,
    }),
    presetIcons({
      warn: true,
      prefix: ['i-'],
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],

  theme: {
    ...themeVars,
  },

  shortcuts: [shortcuts],

  transformers: [transformerDirectives(), transformerVariantGroup()],
})
