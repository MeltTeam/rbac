/* eslint-disable style/quote-props */
type ColorsType = 'primary' | 'success' | 'warning' | 'danger' | 'error' | 'info'
type ColorsToken = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

function createColorVars() {
  const colors: ColorsType[] = ['primary', 'success', 'warning', 'danger', 'error', 'info']
  const nums: ColorsToken[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const colorVars = {} as Record<string, string>
  colors.forEach((color) => {
    colorVars[color] = `rgb(var(--${color}-color))`
    nums.forEach((n) => (colorVars[`${color}-${n}`] = `rgb(var(--${color}-color-${n}))`))
  })
  return colorVars
}

function createElColorVars() {
  const types = ['primary', 'regular', 'secondary', 'placeholder', 'disabled'] as const
  const elColorVars = {} as Record<string, string>
  types.forEach((type) => {
    elColorVars[`el-text-${type}`] = `var(--el-text-color-${type})`
  })
  elColorVars['el-bg'] = 'var(--el-bg-color)'
  elColorVars['el-bg-page'] = 'var(--el-bg-color-page)'
  elColorVars['el-bg-overlay'] = 'var(--el-bg-color-overlay)'
  elColorVars['el-border'] = 'var(--el-border-color)'
  elColorVars['el-border-light'] = 'var(--el-border-color-light)'
  elColorVars['el-border-lighter'] = 'var(--el-border-color-lighter)'
  elColorVars['el-fill'] = 'var(--el-fill-color)'
  elColorVars['el-fill-light'] = 'var(--el-fill-color-light)'
  elColorVars['el-fill-lighter'] = 'var(--el-fill-color-lighter)'
  return elColorVars
}

const colorVars = createColorVars()
const elColorVars = createElColorVars()

const themeVars = {
  colors: {
    ...colorVars,
    ...elColorVars,
  },
  spacing: {
    0: '0',
    1: 'var(--spacing-1)',
    2: 'var(--spacing-2)',
    3: 'var(--spacing-3)',
    4: 'var(--spacing-4)',
    5: 'var(--spacing-5)',
    6: 'var(--spacing-6)',
    8: 'var(--spacing-8)',
    10: 'var(--spacing-10)',
    12: 'var(--spacing-12)',
    16: 'var(--spacing-16)',
    20: 'var(--spacing-20)',
    24: 'var(--spacing-24)',
  },
  borderRadius: {
    none: '0',
    sm: 'var(--radius-sm)',
    DEFAULT: 'var(--radius-base)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
    '3xl': 'var(--radius-3xl)',
    full: 'var(--radius-full)',
  },
  boxShadow: {
    none: 'none',
    sm: 'var(--shadow-sm)',
    DEFAULT: 'var(--shadow-base)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
    '2xl': 'var(--shadow-2xl)',
    inner: 'var(--shadow-inner)',
  },
  fontFamily: {
    sans: 'var(--font-family-sans)',
    mono: 'var(--font-family-mono)',
  },
  fontSize: {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    '2xl': 'var(--font-size-2xl)',
    '3xl': 'var(--font-size-3xl)',
    '4xl': 'var(--font-size-4xl)',
    '5xl': 'var(--font-size-5xl)',
    '6xl': 'var(--font-size-6xl)',
    '7xl': 'var(--font-size-7xl)',
    '8xl': 'var(--font-size-8xl)',
    '9xl': 'var(--font-size-9xl)',
  },
  fontWeight: {
    thin: 'var(--font-weight-thin)',
    extralight: 'var(--font-weight-extralight)',
    light: 'var(--font-weight-light)',
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
    extrabold: 'var(--font-weight-extrabold)',
    black: 'var(--font-weight-black)',
  },
  lineHeight: {
    none: 'var(--line-height-none)',
    tight: 'var(--line-height-tight)',
    snug: 'var(--line-height-snug)',
    normal: 'var(--line-height-normal)',
    relaxed: 'var(--line-height-relaxed)',
    loose: 'var(--line-height-loose)',
  },
  letterSpacing: {
    tighter: 'var(--letter-spacing-tighter)',
    tight: 'var(--letter-spacing-tight)',
    normal: 'var(--letter-spacing-normal)',
    wide: 'var(--letter-spacing-wide)',
    wider: 'var(--letter-spacing-wider)',
    widest: 'var(--letter-spacing-widest)',
  },
  zIndex: {
    '0': 'var(--z-index-0)',
    '10': 'var(--z-index-10)',
    '20': 'var(--z-index-20)',
    '30': 'var(--z-index-30)',
    '40': 'var(--z-index-40)',
    '50': 'var(--z-index-50)',
    auto: 'var(--z-index-auto)',
    dropdown: 'var(--z-index-dropdown)',
    sticky: 'var(--z-index-sticky)',
    fixed: 'var(--z-index-fixed)',
    'modal-backdrop': 'var(--z-index-modal-backdrop)',
    modal: 'var(--z-index-modal)',
    popover: 'var(--z-index-popover)',
    tooltip: 'var(--z-index-tooltip)',
  },
  animation: {
    duration: {
      none: 'var(--duration-none)',
      faster: 'var(--duration-faster)',
      fast: 'var(--duration-fast)',
      normal: 'var(--duration-normal)',
      slow: 'var(--duration-slow)',
      slower: 'var(--duration-slower)',
      slowest: 'var(--duration-slowest)',
    },
    timingFunction: {
      linear: 'var(--ease-linear)',
      in: 'var(--ease-in)',
      out: 'var(--ease-out)',
      'in-out': 'var(--ease-in-out)',
    },
  },
}

const shortcuts = {
  'wh-full': 'w-full h-full',
  'wh-screen': 'w-screen h-screen',
  'wh-auto': 'w-auto h-auto',
  'flex-center': 'flex justify-center items-center',
  'flex-between': 'flex justify-between items-center',
  'flex-start': 'flex justify-start items-center',
  'flex-end': 'flex justify-end items-center',
  'flex-col': 'flex flex-col',
  'flex-col-center': 'flex-col flex-center',
  'flex-wrap': 'flex flex-wrap',
  'text-el-primary': 'text-el-text-primary',
  'text-el-regular': 'text-el-text-regular',
  'text-el-secondary': 'text-el-text-secondary',
  'text-el-placeholder': 'text-el-text-placeholder',
  'text-el-disabled': 'text-el-text-disabled',
  'bg-el': 'bg-el-bg',
  'bg-el-page': 'bg-el-bg-page',
  'bg-el-overlay': 'bg-el-bg-overlay',
  'border-el': 'border-el-border',
  'border-el-light': 'border-el-border-light',
  'border-el-lighter': 'border-el-border-lighter',
  'fill-el': 'bg-el-fill',
  'fill-el-light': 'bg-el-fill-light',
  'fill-el-lighter': 'bg-el-fill-lighter',
  card: 'bg-el-bg rounded-lg shadow-md p-4 border border-el-border-lighter',
  'card-sm': 'bg-el-bg rounded-md shadow-sm p-3 border border-el-border-lighter',
  'card-lg': 'bg-el-bg rounded-xl shadow-lg p-6 border border-el-border-lighter',
  btn: 'px-4 py-2 rounded-md cursor-pointer transition-colors duration-normal',
  'btn-primary': 'btn bg-primary text-white hover:bg-primary-600',
  'btn-secondary': 'btn bg-el-fill text-el-regular hover:bg-el-fill-light',
  'btn-success': 'btn bg-success text-white hover:bg-success-600',
  'btn-warning': 'btn bg-warning text-white hover:bg-warning-600',
  'btn-danger': 'btn bg-danger text-white hover:bg-danger-600',
  'input-base': 'w-full px-3 py-2 border border-el-border rounded-md focus:border-primary focus:outline-none bg-el-bg text-el-regular',
  link: 'text-primary cursor-pointer hover:text-primary-600 transition-colors',
  truncate: 'overflow-hidden text-ellipsis whitespace-nowrap',
  'absolute-center': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'fixed-center': 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
}

export { ColorsToken, ColorsType, shortcuts, themeVars }
