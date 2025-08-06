import type { App } from 'vue'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { useLocalStorage } from '@vueuse/core'
import { createI18n } from 'vue-i18n'
import map from './locales/zh-CN.json'

export const localeKeys = ['zh-CN', 'en-US'] as const
export type AppLocale = (typeof localeKeys)[number]
export const i18n = createI18n({
  legacy: false,
  locale: localeKeys[0],
  fallbackLocale: localeKeys[1],
  messages,
})
const _t = i18n.global.t
export const LocalLocale = useLocalStorage('I18N_Locale', localeKeys[0])
export function getLanguage(): AppLocale | null {
  if (i18n.global.locale.value) return i18n.global.locale.value as AppLocale
  if (LocalLocale.value) {
    i18n.global.locale.value = LocalLocale.value
    return LocalLocale.value as AppLocale
  }
  return null
}
const jsonMap = new Map<string, string>()
Object.entries(map).forEach(([key, value]) => jsonMap.set((value as any)?.loc?.source as string, key))
export function setLanguage(locale?: AppLocale) {
  if (!locale) locale = localeKeys[0]
  i18n.global.locale.value = locale
  LocalLocale.value = locale
  document.documentElement.setAttribute('lang', locale)
}
export function t(key: any) {
  const hasKey = jsonMap.get(key)
  if (!hasKey) return ''
  return _t(hasKey)
}
export function setUpI18n(app: App<Element>) {
  app.use(i18n)
  setLanguage(LocalLocale.value as AppLocale)
}
