import antfu from '@antfu/eslint-config'

export const webConfig = antfu({
  typescript: true,
  vue: true,
  yaml: true,
  test: true,
  pnpm: true,
  stylistic: true,
  unocss: true,
  formatters: ['prettier'],
  ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**'],
  rules: {
    'style/operator-linebreak': 'off',
    'style/arrow-parens': 'off',
    'antfu/if-newline': 'off',
    'style/brace-style': 'off',
    'vue/html-self-closing': 'off',
    'vue/singleline-html-element-content-newline': 'off',
  },
})
