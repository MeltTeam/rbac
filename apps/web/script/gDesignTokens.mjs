import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { stringify } from 'css'
import {
  breakpoints,
  duration,
  easing,
  elComponentOverrides,
  elSemanticColors,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  radius,
  shadow,
  spacing,
  zIndex,
} from './designTokens.mjs'

const ROOT_SELECTOR = 'html:root'
const ROOT_DARK_SELECTOR = 'html.dark:root'

const cssAst = {
  type: 'stylesheet',
  stylesheet: {
    rules: [],
  },
}

function addDeclaration(rule, property, value) {
  rule.declarations.push({
    type: 'declaration',
    property,
    value,
  })
}

function addComment(rule, comment) {
  rule.declarations.push({
    type: 'comment',
    comment: ` ${comment} `,
  })
}

function generateObjectVars(rule, prefix, obj) {
  Object.entries(obj).forEach(([key, value]) => {
    addDeclaration(rule, `--${prefix}-${key}`, value)
  })
}

function generateDesignTokens() {
  const rootRule = {
    type: 'rule',
    selectors: [ROOT_SELECTOR],
    declarations: [],
  }

  addComment(rootRule, '间距系统')
  generateObjectVars(rootRule, 'spacing', spacing)

  addComment(rootRule, '圆角系统')
  generateObjectVars(rootRule, 'radius', radius)

  addComment(rootRule, 'Element Plus 圆角映射')
  addDeclaration(rootRule, '--el-border-radius-base', 'var(--radius-base)')
  addDeclaration(rootRule, '--el-border-radius-small', 'var(--radius-lg)')
  addDeclaration(rootRule, '--el-border-radius-round', 'var(--radius-2xl)')
  addDeclaration(rootRule, '--el-border-radius-circle', 'var(--radius-full)')

  addComment(rootRule, '阴影系统')
  generateObjectVars(rootRule, 'shadow', shadow)

  addComment(rootRule, 'Element Plus 阴影映射 (光亮模式)')
  addDeclaration(rootRule, '--el-box-shadow', 'var(--shadow-lg)')
  addDeclaration(rootRule, '--el-box-shadow-light', 'var(--shadow-md)')
  addDeclaration(rootRule, '--el-box-shadow-lighter', 'var(--shadow-sm)')
  addDeclaration(rootRule, '--el-box-shadow-dark', 'var(--shadow-xl)')

  addComment(rootRule, '字体系统')
  generateObjectVars(rootRule, 'font-family', fontFamily)
  generateObjectVars(rootRule, 'font-size', fontSize)
  generateObjectVars(rootRule, 'font-weight', fontWeight)
  generateObjectVars(rootRule, 'line-height', lineHeight)
  generateObjectVars(rootRule, 'letter-spacing', letterSpacing)

  addComment(rootRule, '层级系统')
  Object.entries(zIndex).forEach(([key, value]) => {
    addDeclaration(rootRule, `--z-index-${key}`, String(value))
  })

  addComment(rootRule, '过渡时间')
  generateObjectVars(rootRule, 'duration', duration)

  addComment(rootRule, '缓动函数')
  generateObjectVars(rootRule, 'ease', easing)

  addComment(rootRule, '断点系统')
  generateObjectVars(rootRule, 'breakpoint', breakpoints)

  cssAst.stylesheet.rules.push(rootRule)

  const lightRule = {
    type: 'rule',
    selectors: [ROOT_SELECTOR],
    declarations: [],
  }

  addComment(lightRule, 'Element Plus 语义化颜色 - 光亮模式')

  const { light } = elSemanticColors

  addComment(lightRule, '背景色')
  Object.entries(light.bg).forEach(([key, value]) => {
    addDeclaration(lightRule, `--el-bg-color${key === 'default' ? '' : `-${key}`}`, value)
  })

  addComment(lightRule, '文本色')
  Object.entries(light.text).forEach(([key, value]) => {
    addDeclaration(lightRule, `--el-text-color-${key}`, value)
  })

  addComment(lightRule, '边框色')
  Object.entries(light.border).forEach(([key, value]) => {
    addDeclaration(lightRule, `--el-border-color${key === 'default' ? '' : `-${key}`}`, value)
  })

  addComment(lightRule, '填充色')
  Object.entries(light.fill).forEach(([key, value]) => {
    addDeclaration(lightRule, `--el-fill-color${key === 'default' ? '' : `-${key}`}`, value)
  })

  addComment(lightRule, '遮罩色')
  Object.entries(light.mask).forEach(([key, value]) => {
    addDeclaration(lightRule, `--el-mask-color${key === 'default' ? '' : `-${key}`}`, value)
  })

  cssAst.stylesheet.rules.push(lightRule)

  const darkRule = {
    type: 'rule',
    selectors: [ROOT_DARK_SELECTOR],
    declarations: [],
  }

  addDeclaration(darkRule, 'color-scheme', 'dark')

  addComment(darkRule, 'Element Plus 语义化颜色 - 暗黑模式')

  addComment(darkRule, '阴影')
  addDeclaration(darkRule, '--el-box-shadow', '0px 12px 32px 4px rgba(0, 0, 0, 0.36), 0px 8px 20px rgba(0, 0, 0, 0.72)')
  addDeclaration(darkRule, '--el-box-shadow-light', '0px 0px 12px rgba(0, 0, 0, 0.72)')
  addDeclaration(darkRule, '--el-box-shadow-lighter', '0px 0px 6px rgba(0, 0, 0, 0.72)')
  addDeclaration(darkRule, '--el-box-shadow-dark', '0px 16px 48px 16px rgba(0, 0, 0, 0.72), 0px 12px 32px #000000, 0px 8px 16px -8px #000000')

  const { dark } = elSemanticColors

  addComment(darkRule, '背景色')
  Object.entries(dark.bg).forEach(([key, value]) => {
    addDeclaration(darkRule, `--el-bg-color${key === 'default' ? '' : `-${key}`}`, value)
  })

  addComment(darkRule, '文本色')
  Object.entries(dark.text).forEach(([key, value]) => {
    addDeclaration(darkRule, `--el-text-color-${key}`, value)
  })

  addComment(darkRule, '边框色')
  Object.entries(dark.border).forEach(([key, value]) => {
    addDeclaration(darkRule, `--el-border-color${key === 'default' ? '' : `-${key}`}`, value)
  })

  addComment(darkRule, '填充色')
  Object.entries(dark.fill).forEach(([key, value]) => {
    addDeclaration(darkRule, `--el-fill-color${key === 'default' ? '' : `-${key}`}`, value)
  })

  addComment(darkRule, '遮罩色')
  Object.entries(dark.mask).forEach(([key, value]) => {
    addDeclaration(darkRule, `--el-mask-color${key === 'default' ? '' : `-${key}`}`, value)
  })

  cssAst.stylesheet.rules.push(darkRule)

  const { dark: darkOverrides } = elComponentOverrides

  if (darkOverrides.button) {
    const buttonRule = {
      type: 'rule',
      selectors: [`${ROOT_DARK_SELECTOR} .el-button`],
      declarations: [],
    }
    Object.entries(darkOverrides.button).forEach(([key, value]) => {
      addDeclaration(buttonRule, `--el-button-${key}`, value)
    })
    cssAst.stylesheet.rules.push(buttonRule)
  }

  if (darkOverrides.card) {
    const cardRule = {
      type: 'rule',
      selectors: [`${ROOT_DARK_SELECTOR} .el-card`],
      declarations: [],
    }
    Object.entries(darkOverrides.card).forEach(([key, value]) => {
      addDeclaration(cardRule, `--el-card-${key}`, value)
    })
    cssAst.stylesheet.rules.push(cardRule)
  }

  if (darkOverrides.empty) {
    const emptyRule = {
      type: 'rule',
      selectors: [`${ROOT_DARK_SELECTOR} .el-empty`],
      declarations: [],
    }
    Object.entries(darkOverrides.empty).forEach(([key, value]) => {
      addDeclaration(emptyRule, `--el-empty-${key}`, value)
    })
    cssAst.stylesheet.rules.push(emptyRule)
  }

  const { code } = stringify(cssAst, { sourcemap: 'generator' })
  if (code) {
    const outPath = join('./src/assets/css', 'design-tokens.css')
    const outDir = dirname(outPath)
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
    writeFileSync(outPath, code, 'utf-8')
    console.warn(`[生成] 设计令牌文件 ${outPath}`)
  }
}

export { generateDesignTokens }
