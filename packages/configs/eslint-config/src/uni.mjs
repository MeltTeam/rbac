import uniHelper from '@uni-helper/eslint-config'

export const uniConfig = uniHelper({
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
    'prefer-promise-reject-errors': 'off',
  },
})
