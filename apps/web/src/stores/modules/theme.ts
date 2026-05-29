import { useLocalStorage } from '@vueuse/core'
import { generatePalette, hexToRgb } from '@/utils/colorPalette.util'

const PRIMARY_COLOR_KEY = import.meta.env.VITE_APP_PRIMARY_COLOR_KEY || 'PRIMARY_COLOR'
const PRIMARY_COLOR = import.meta.env.VITE_APP_PRIMARY_COLOR || '#3b82f6'

/**
 * 应用主题颜色到 CSS 变量
 * @param color 主题颜色
 */
function applyThemeColor(color: string) {
  const root = document.documentElement
  const palette = generatePalette(color)
  palette.forEach(({ num, color: c }) => {
    const cRgb = hexToRgb(c)
    root.style.setProperty(`--uno-color-primary-${num}`, cRgb)
    root.style.setProperty(`--primary-color-${num}`, `var(--uno-color-primary-${num})`)
  })
  root.style.setProperty('--primary-color', 'var(--uno-color-primary-500)')
}
interface ThemeState {
  primaryColor: string
}
export const themeStore = defineStore('THEME', {
  state: (): ThemeState => ({
    primaryColor: useLocalStorage(PRIMARY_COLOR_KEY, PRIMARY_COLOR).value,
  }),
  getters: {
    primaryColorRgb: (state) => hexToRgb(state.primaryColor),
  },
  actions: {
    initTheme() {
      applyThemeColor(this.primaryColor)
    },
    setPrimaryColor(color: string) {
      this.primaryColor = color
      applyThemeColor(color)
      localStorage.setItem(PRIMARY_COLOR_KEY, color)
    },
    reset() {
      this.primaryColor = PRIMARY_COLOR
      applyThemeColor(PRIMARY_COLOR)
      localStorage.setItem(PRIMARY_COLOR_KEY, PRIMARY_COLOR)
    },
  },
})
