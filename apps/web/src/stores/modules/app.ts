import type { AppLocale } from '@/i18n'
import { TITLE } from '@/constants'
import { i18n, I18N_LOCALE, t } from '@/i18n'

export interface IAppState {
  /** 标签名 */
  title: string
}
export const appStore = defineStore('APP', {
  state: (): IAppState => {
    return {
      title: TITLE,
    }
  },
  getters: {
    /** 语言(locale i18n内部已经有内存缓存了不用state再定义) */
    locale(): AppLocale {
      if (i18n.global.locale.value) return i18n.global.locale.value as AppLocale
      if (I18N_LOCALE.value) {
        i18n.global.locale.value = I18N_LOCALE.value as AppLocale
        return I18N_LOCALE.value as AppLocale
      }
      return 'zh-CN'
    },
  },
  actions: {
    setTitle(title: string) {
      title = t(title)
      this.title = `${TITLE}${title ? ` - ${title}` : ''}`
      window.document.title = this.title
    },
    setLocale(locale: AppLocale) {
      i18n.global.locale.value = locale
      I18N_LOCALE.value = locale
      document.documentElement.setAttribute('lang', locale)
    },
  },
})
