import type { App } from 'vue'
import { mLoading } from '@/directive'

export interface IPluginsOptions {
  /** 指令插件 */
  directives?: Record<string, any>
}
/** 插件安装 */
export const pluginsInstall = {
  install(app: App<Element>, options?: IPluginsOptions) {
    const baseOptions: IPluginsOptions = {
      directives: {
        mLoading,
      },
    }
    options = { ...baseOptions, ...options }
    const { directives } = options
    if (directives) {
      for (const key in directives) {
        app.directive(key, directives[key])
      }
    }
  },
}
