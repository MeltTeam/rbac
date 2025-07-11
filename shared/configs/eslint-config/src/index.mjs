import antfu from "@antfu/eslint-config";

export default antfu(
  {
    typescript: true,
    vue: true,
    yaml: true,
    test: true,
    pnpm: true,
    unocss: true,
    stylistic: true,
    formatters: ["prettier"],
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**", "**/node_modules/**"],
    rules: {
      "style/operator-linebreak": "off",
      "style/arrow-parens": "off",
      "antfu/if-newline": "off",
      "style/brace-style": "off",
    },
  },
  {
    name: "api",
    files: ["apps/api/**/*.{ts,mts,js,mjs,cjs}"],
    rules: {
      "no-console": "off",
      "unused-imports/no-unused-vars": 2,
      "unused-imports/no-unused-imports": 2,
      "ts/consistent-type-imports": "off",
      "node/prefer-global/process": "off",
      "node/prefer-global/buffer": "off",
      "regexp/no-super-linear-backtracking": "off",
      "regexp/no-contradiction-with-assertion": "off",
      "ts/no-unused-expressions": "off",
    },
  },
  {
    name: "web",
    files: ["apps/web/**/*.{ts,mts,vue}"],
    rules: {
      "vue/html-self-closing": "off",
      "vue/singleline-html-element-content-newline": "off",
    },
  }
);
