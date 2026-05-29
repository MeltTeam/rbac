import type { App } from 'vue'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { useStorage } from '@vueuse/core'
import ElementPlusEn from 'element-plus/dist/locale/en.mjs'
import ElementPlusZhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { createI18n } from 'vue-i18n'
import { appStore } from '@/stores'

export const localeKeys = ['zh-CN', 'en'] as const
export type AppLocale = (typeof localeKeys)[number]
export const i18n = createI18n({
  legacy: false,
  locale: localeKeys[0],
  fallbackLocale: localeKeys[1],
  messages: {
    'zh-CN': { ...messages!['zh-CN'], ...ElementPlusZhCn },
    // eslint-disable-next-line style/quote-props
    en: { ...messages!.en, ...ElementPlusEn },
  },
})
const global = i18n.global as unknown as { t: (key: string | number) => string }
export const t = (key: string | number): string => global.t(key)
/** I18N本地持久化 */
export const I18N_LOCALE = useStorage('I18N_Locale', localeKeys[0], window.localStorage)

export function initI18n() {
  const { setLocale } = appStore()
  setLocale(I18N_LOCALE.value as AppLocale)
}
export function setupI18n(app: App<Element>) {
  app.use(i18n)
  initI18n()
}
