import type { Declaration, Rule, Stylesheet } from 'css'
import type { PreflightContext } from 'unocss'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { stringify } from 'css'

/** 色系类型 */
type ColorsType = 'primary' | 'success' | 'warning' | 'danger' | 'error' | 'info'
/** 色系名 */
type ColorsName =
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
/** uno色系token */
type UnoColorsToken = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950'
/** element-plus色系token */
type ElColorsToken = '2' | '3' | '5' | '7' | '8' | '9'
interface IConfig {
  /** 输入目录 */
  outputDir: string
  /** 输出文件名(不带文件后缀) */
  outputName: string
  /** 前缀 */
  prefix: string
  /** 选择器 */
  selectors: Rule['selectors']
  /** 色系 */
  colors: Array<{
    /** 色系类型 */
    type: ColorsType
    /** 色系名 */
    name: ColorsName
  }>
  /** 主色 */
  mainTokenNum: UnoColorsToken
  /** 模式 */
  modes: {
    /** 模式(light | dark) */
    [key: string]: Array<{
      /** element-plus内置cssToken */
      elTokenNum: ElColorsToken
      /** unocss内置cssToken */
      unoTokenNum: UnoColorsToken
    }>
  }
}
const ROOT_SELECTOR = 'html:root'
const ROOT_DARK_SELECTOR = 'html.dark:root'
/** 默认配置 */
const defaultConfig: IConfig = {
  outputDir: './src/assets/css',
  outputName: 'var',
  prefix: '--el-color',
  selectors: [ROOT_SELECTOR, ROOT_DARK_SELECTOR],
  colors: [
    { type: 'primary', name: 'indigo' },
    { type: 'success', name: 'emerald' },
    { type: 'warning', name: 'amber' },
    { type: 'danger', name: 'red' },
    { type: 'error', name: 'red' },
    { type: 'info', name: 'gray' },
  ],
  mainTokenNum: '500',
  modes: {
    light: [
      { elTokenNum: '3', unoTokenNum: '800' },
      { elTokenNum: '5', unoTokenNum: '600' },
      { elTokenNum: '7', unoTokenNum: '500' },
      { elTokenNum: '8', unoTokenNum: '300' },
      { elTokenNum: '9', unoTokenNum: '100' },
    ],
    dark: [{ elTokenNum: '2', unoTokenNum: '500' }],
  },
}
function createColorVars() {
  const colorVars = {} as {
    [key: string]: string
  }
  const colors = defaultConfig.colors
  const modes = defaultConfig.modes
  if (!colors && !modes) return colorVars
  const colorsName = colors.map((c) => c.type)
  colorsName.forEach((ct) => {
    colorVars[ct] = `rgb(var(--${ct}-color) / <alpha-value>)`
    for (const mode in modes) {
      modes[mode].forEach(({ elTokenNum }) => {
        colorVars[`${ct}-${elTokenNum}`] = `rgb(var(--${ct}-${elTokenNum}-color) / <alpha-value>)`
      })
    }
  })
  return colorVars
}
/** unocss变量 */
const themeVars = {
  colors: {
    ...createColorVars(),
  },
}
/** 是否已经生成CssVars文件 */
let isG: boolean = false
/** 16进制转rgb */
function hexToRgb(hex: string) {
  hex = hex.replace('#', '')
  if (hex.length !== 6) {
    throw new Error('Invalid hex color value')
  }
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}
/** 生成CssVars文件 */
async function gCssVars(context: PreflightContext<object>, config: IConfig = defaultConfig) {
  if (isG) return
  const { colors, selectors, modes, prefix, outputName, mainTokenNum, outputDir } = config
  const cssAst: Stylesheet = {
    type: 'stylesheet',
    stylesheet: {
      rules: [
        // unocss内置颜色css变量
        {
          type: 'rule',
          selectors: [ROOT_SELECTOR],
          declarations: [],
        },
        // element-plus主题覆盖变量
        {
          type: 'rule',
          selectors,
          declarations: [],
        },
        {
          type: 'rule',
          selectors: [ROOT_DARK_SELECTOR],
          declarations: [],
        },
      ],
    },
  }
  const unoToken = cssAst.stylesheet?.rules[0] as Rule
  if (unoToken) {
    const unoTokenD = unoToken?.declarations as Declaration[]
    const themeColors = (
      context.theme as {
        colors: {
          [key: string]: string
        }
      }
    ).colors
    colors.forEach(({ name }) => {
      unoTokenD?.push({
        type: 'declaration',
        property: `--colors-${name}-${mainTokenNum}`,
        value: hexToRgb(themeColors[name][mainTokenNum]),
      })
      for (const mode in modes) {
        modes[mode].forEach(({ unoTokenNum }) => {
          unoTokenD?.push({
            type: 'declaration',
            property: `--colors-${name}-${unoTokenNum}`,
            value: hexToRgb(themeColors[name][unoTokenNum]),
          })
        })
      }
    })
  }
  const elToken = cssAst.stylesheet?.rules[1] as Rule
  if (elToken) {
    const elTokenD = elToken?.declarations as Declaration[]
    colors.forEach(({ type, name }) => {
      elTokenD?.push({
        type: 'declaration',
        property: `--${type}-color`,
        value: `var(--colors-${name}-${mainTokenNum})`,
      })
      elTokenD?.push({
        type: 'declaration',
        property: `${prefix}-${type}`,
        value: `rgb(var(--${type}-color))`,
      })
      for (const mode in modes) {
        modes[mode].forEach(({ elTokenNum, unoTokenNum }) => {
          elTokenD?.push({
            type: 'declaration',
            property: `--${type}-${elTokenNum}-color`,
            value: `var(--colors-${name}-${unoTokenNum})`,
          })
        })
        modes[mode].forEach(({ elTokenNum }) => {
          elTokenD?.push({
            type: 'declaration',
            property: `${prefix}-${type}-${mode}-${elTokenNum}`,
            value: `rgb(var(--${type}-${elTokenNum}-color))`,
          })
        })
      }
    })
  }
  const elDarkToken = cssAst.stylesheet?.rules[2] as Rule
  if (elDarkToken) {
    const elDarkTokenD = elDarkToken.declarations as Declaration[]
    colors.forEach(({ type }) => {
      elDarkTokenD.push({
        type: 'declaration',
        property: `${prefix}-${type}-light-9`,
        value: `rgb(var(--${type}-5-color))`,
      })
      elDarkTokenD.push({
        type: 'declaration',
        property: `${prefix}-${type}-light-9`,
        value: `rgb(var(--${type}-8-color))`,
      })
    })
  }
  const { code } = stringify(cssAst, { sourcemap: 'generator' }) as unknown as {
    code: any
    map: any
  }
  if (code) {
    const outPath = join(outputDir, `${outputName || 'var'}.css`)
    const _outputDir = dirname(outPath)
    if (!existsSync(_outputDir)) mkdirSync(_outputDir, { recursive: true })
    writeFileSync(outPath, code, 'utf-8')
    console.warn(`[生成] 主题文件 ${outPath}`)
    isG = true
  }
}

export { ColorsName, ColorsType, gCssVars, hexToRgb, themeVars }
