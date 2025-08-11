import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { stringify } from 'css'
import { colors } from './unoColors.mjs'
// eslint-disable-next-line no-console
console.clear()
const ROOT_SELECTOR = 'html:root'
const ROOT_DARK_SELECTOR = 'html.dark:root'
/** 16进制转rgb */
function hexToRgb(hex) {
  hex = hex.replace('#', '')
  if (hex.length !== 6) {
    throw new Error('Invalid hex color value')
  }
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)
  return `${r} ${g} ${b}`
}
/** 默认配置 */
const defaultConfig = {
  /** 输入目录 */
  outputDir: './src/assets/css',
  /** 输出文件名(不带文件后缀) */
  outputName: 'uno-vars',
  /** element-plus颜色变量前缀 */
  elPrefix: '--el-color',
  /** unocss颜色变量前缀 */
  unoPrefix: '--uno-color',
  /** 色系(type:色系类型 name:色系名) */
  colors: [
    { type: 'primary', name: 'Blue' },
    { type: 'success', name: 'Green' },
    { type: 'warning', name: 'Yellow' },
    { type: 'danger', name: 'Red' },
    { type: 'error', name: 'Red' },
    { type: 'info', name: 'Gray' },
  ],
  unoTokenNums: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  light: {
    mainUnoTokenNum: 500,
    light: [
      // hover
      { elTokenNum: 3, unoTokenNum: 600 },
      // disabled
      { elTokenNum: 5, unoTokenNum: 300 },
      // message
      { elTokenNum: 7, unoTokenNum: 500 },
      // message border
      { elTokenNum: 8, unoTokenNum: 50 },
      // message bg
      { elTokenNum: 9, unoTokenNum: 50 },
    ],
    // active
    dark: [{ elTokenNum: 2, unoTokenNum: 700 }],
  },
  dark: {
    mainUnoTokenNum: 600,
    light: [
      { elTokenNum: 3, unoTokenNum: 600 },
      { elTokenNum: 5, unoTokenNum: 400 },
      { elTokenNum: 7, unoTokenNum: 700 },
      { elTokenNum: 8, unoTokenNum: 500 },
      { elTokenNum: 9, unoTokenNum: 950 },
    ],
    dark: [{ elTokenNum: 2, unoTokenNum: 700 }],
  },
}
const cssAst = {
  type: 'stylesheet',
  stylesheet: {
    rules: [],
  },
}
/** 生成CssVars文件 */
async function gCssVars(themeColors, config = defaultConfig) {
  const { colors, unoTokenNums, outputName, outputDir, unoPrefix, light, dark, elPrefix } = config

  /**
   * 把配置中用到的unocss内置颜色提取成css变量
   */
  const unoToken = {
    type: 'rule',
    selectors: [ROOT_SELECTOR],
    declarations: [],
  }
  if (unoToken) {
    const unoTokenD = unoToken?.declarations
    colors.forEach(({ name }) => {
      name = name.toLowerCase()
      unoTokenD?.push({
        type: 'comment',
        comment: ` ${name} `,
      })
      unoTokenNums.forEach((unoTokenNum) => {
        unoTokenD?.push({
          type: 'declaration',
          property: `${unoPrefix}-${name}-${unoTokenNum}`,
          value: hexToRgb(themeColors[name][unoTokenNum]),
        })
      })
    })
    colors.forEach(({ type, name }) => {
      name = name.toLowerCase()
      unoTokenD?.push({
        type: 'comment',
        comment: ` ${type} ${name} `,
      })
      unoTokenD?.push({
        type: 'declaration',
        property: `--${type}-color`,
        value: `var(${unoPrefix}-${name}-${light.mainUnoTokenNum})`,
      })
      unoTokenNums.forEach((unoTokenNum) => {
        unoTokenD?.push({
          type: 'declaration',
          property: `--${type}-color-${unoTokenNum}`,
          value: `var(${unoPrefix}-${name}-${unoTokenNum})`,
        })
      })
    })
    unoTokenD?.push({
      type: 'comment',
      comment: ` element-plus `,
    })
    colors.forEach(({ type }) => {
      unoTokenD?.push({
        type: 'declaration',
        property: `${elPrefix}-${type}-rgb`,
        value: `var(--${type}-color)`,
      })
    })
  }
  cssAst.stylesheet?.rules.push(unoToken)

  /**
   * 光亮模式
   */
  const elToken = {
    type: 'rule',
    selectors: [ROOT_SELECTOR, ROOT_DARK_SELECTOR],
    declarations: [],
  }
  if (elToken) {
    const elTokenD = elToken?.declarations
    colors.forEach(({ type }) => {
      elTokenD?.push({
        type: 'comment',
        comment: ` ${type} `,
      })
      elTokenD?.push({
        type: 'declaration',
        property: `${elPrefix}-${type}`,
        value: `rgb(var(--${type}-color))`,
      })
      light.light.forEach(({ elTokenNum, unoTokenNum }) => {
        elTokenD?.push({
          type: 'declaration',
          property: `${elPrefix}-${type}-light-${elTokenNum}`,
          value: `rgb(var(--${type}-color-${unoTokenNum}))`,
        })
      })
      light.dark.forEach(({ elTokenNum, unoTokenNum }) => {
        elTokenD?.push({
          type: 'declaration',
          property: `${elPrefix}-${type}-dark-${elTokenNum}`,
          value: `rgb(var(--${type}-color-${unoTokenNum}))`,
        })
      })
    })
  }
  cssAst.stylesheet?.rules.push({
    type: 'comment',
    comment: ` 光亮模式 `,
  })
  cssAst.stylesheet?.rules.push(elToken)

  /**
   * 暗黑模式
   */
  cssAst.stylesheet?.rules.push({
    type: 'comment',
    comment: ` 暗黑模式 `,
  })
  const elDarkToken = {
    type: 'rule',
    selectors: [ROOT_DARK_SELECTOR],
    declarations: [],
  }
  if (elDarkToken) {
    const elDarkTokenD = elDarkToken.declarations
    colors.forEach(({ type, name }) => {
      name = name.toLowerCase()
      elDarkTokenD?.push({
        type: 'comment',
        comment: ` ${type} `,
      })
      elDarkTokenD?.push({
        type: 'declaration',
        property: `--${type}-color`,
        value: `var(${unoPrefix}-${name}-${dark.mainUnoTokenNum})`,
      })
      elDarkTokenD?.push({
        type: 'declaration',
        property: `${elPrefix}-${type}`,
        value: `rgb(var(--${type}-color))`,
      })
      dark.light.forEach(({ elTokenNum, unoTokenNum }) => {
        elDarkTokenD?.push({
          type: 'declaration',
          property: `${elPrefix}-${type}-light-${elTokenNum}`,
          value: `rgb(var(--${type}-color-${unoTokenNum}))`,
        })
      })
      dark.dark.forEach(({ elTokenNum, unoTokenNum }) => {
        elDarkTokenD?.push({
          type: 'declaration',
          property: `${elPrefix}-${type}-dark-${elTokenNum}`,
          value: `rgb(var(--${type}-color-${unoTokenNum}))`,
        })
      })
    })
  }
  cssAst.stylesheet?.rules.push(elDarkToken)

  const { code } = stringify(cssAst, { sourcemap: 'generator' })
  if (code) {
    const outPath = join(outputDir, `${outputName || 'var'}.css`)
    const _outputDir = dirname(outPath)
    if (!existsSync(_outputDir)) mkdirSync(_outputDir, { recursive: true })
    writeFileSync(outPath, code, 'utf-8')
    console.warn(`[生成] 主题文件 ${outPath}`)
  }
}
gCssVars(colors)
