/* eslint-disable style/quotes */
/* eslint-disable style/quote-props */
/** 设计令牌配置 */

/** 间距系统 (基于 4px 基准) */
const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
}

/** 圆角系统 */
const radius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
}

/** 阴影系统 */
const shadow = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
}

/** 字体系统 */
const fontFamily = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
}

const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
  '9xl': '8rem',
}

const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
}

const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
}

const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
}

/** 层级系统 */
const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  'modal-backdrop': '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
}

/** 过渡时间 */
const duration = {
  none: '0ms',
  faster: '50ms',
  fast: '100ms',
  normal: '150ms',
  slow: '200ms',
  slower: '300ms',
  slowest: '500ms',
}

const easing = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
}

/** 断点系统 */
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

/** Element Plus 语义化颜色配置 */
const elSemanticColors = {
  light: {
    bg: {
      page: '#f2f3f5',
      default: '#ffffff',
      overlay: '#ffffff',
    },
    text: {
      primary: '#1d2129',
      regular: '#4e5969',
      secondary: '#86909c',
      placeholder: '#c9cdd4',
      disabled: '#c9cdd4',
    },
    border: {
      darker: '#939aa3',
      dark: '#c9cdd4',
      default: '#e5e6eb',
      light: '#ebeef5',
      lighter: '#f2f3f5',
      'extra-light': '#f7f8fa',
    },
    fill: {
      darker: '#e5e6eb',
      dark: '#ebeef5',
      default: '#f2f3f5',
      light: '#f7f8fa',
      lighter: '#fafafa',
      'extra-light': '#fafcff',
      blank: 'transparent',
    },
    mask: {
      default: 'rgba(255, 255, 255, 0.9)',
      'extra-light': 'rgba(255, 255, 255, 0.3)',
    },
  },
  dark: {
    bg: {
      page: '#0a0a0a',
      default: '#141414',
      overlay: '#1d1e1f',
    },
    text: {
      primary: '#e5eaf3',
      regular: '#cfd3dc',
      secondary: '#a3a6ad',
      placeholder: '#8d9095',
      disabled: '#6c6e72',
    },
    border: {
      darker: '#636466',
      dark: '#58585b',
      default: '#4c4d4f',
      light: '#414243',
      lighter: '#363637',
      'extra-light': '#2b2b2c',
    },
    fill: {
      darker: '#424243',
      dark: '#39393a',
      default: '#303030',
      light: '#262727',
      lighter: '#1d1d1d',
      'extra-light': '#191919',
      blank: 'transparent',
    },
    mask: {
      default: 'rgba(0, 0, 0, 0.8)',
      'extra-light': 'rgba(0, 0, 0, 0.3)',
    },
  },
}

/** Element Plus 组件暗黑模式覆盖 */
const elComponentOverrides = {
  dark: {
    button: {
      'disabled-text-color': 'rgba(255, 255, 255, 0.5)',
    },
    card: {
      'bg-color': 'var(--el-bg-color-overlay)',
    },
    empty: {
      'fill-color-0': 'var(--el-color-black)',
      'fill-color-1': '#4b4b52',
      'fill-color-2': '#36383d',
      'fill-color-3': '#1e1e20',
      'fill-color-4': '#262629',
      'fill-color-5': '#202124',
      'fill-color-6': '#212224',
      'fill-color-7': '#1b1c1f',
      'fill-color-8': '#1c1d1f',
      'fill-color-9': '#18181a',
    },
  },
}

export {
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
}
