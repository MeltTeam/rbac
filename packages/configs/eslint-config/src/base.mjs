import antfu from '@antfu/eslint-config'

export const baseConfig = antfu({
  typescript: true,
  vue: true,
  yaml: true,
  test: true,
  pnpm: true,
  stylistic: true,
  formatters: ['prettier'],
  ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**', '**/apps/service/**', '**/apps/web/**'],
  rules: {
    'style/operator-linebreak': 'off',
    'style/arrow-parens': 'off',
    'antfu/if-newline': 'off',
    'style/brace-style': 'off',
  },
})
