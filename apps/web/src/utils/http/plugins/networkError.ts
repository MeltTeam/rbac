import type { ICustomAxiosError } from '../IHttpUtils'
import type { IHttpUtilsPlugin } from '../IPlugin'
import type { IEventBusEvents } from '@/eventBus/IEventBus'
import { eventBus } from '@/eventBus'
import { PluginResType } from '../IHttpUtils'
import { pluginDebug } from './debug'

/** 网络错误处理插件配置 */
export interface INetworkErrorPluginConfig {
  /** 是否显示错误 */
  showError?: boolean
  /** 错误提示 */
  msg?: string
  /** 错误提示显示时长 */
  duration?: number
  /** 跳过插件判断函数 */
  skipFn: (err: ICustomAxiosError) => boolean
}

/** 网络错误处理插件事件 */
export interface INetworkErrorPluginEvents extends IEventBusEvents {
  'HTTP_PLUGIN:NETWORK_ERROR_PLUGIN:Handler': [err: ICustomAxiosError]
  'HTTP_PLUGIN:NETWORK_ERROR_PLUGIN:ShowError': [message: string, type: 'error' | 'warning', duration: number]
}

export const NETWORK_ERROR_PLUGIN = 'NETWORK_ERROR_PLUGIN'

/** 网络错误处理插件 */
export const NetworkErrorPlugin: IHttpUtilsPlugin = {
  name: NETWORK_ERROR_PLUGIN,
  priority: {
    onReq: 4,
    onReqErr: 7,
    onResErr: 7,
    default: 0,
  },
  config: {
    showError: true,
    msg: '网络错误',
    duration: 1500,
    skipFn: (err: ICustomAxiosError) => !(err.response!.status >= 500 || [403, 404, 429, 400].includes(err.response!.status)),
  },
  onResErr: async (err, ctx) => {
    pluginDebug(NETWORK_ERROR_PLUGIN, 'onResErr', err.config?.url, err.response?.status)
    if (!err.response) return ctx.createPluginRes(PluginResType.NEXT, err)
    const config: INetworkErrorPluginConfig = {
      ...ctx.getPlugin(NETWORK_ERROR_PLUGIN)!.config,
      ...(err.config?.customConfig.NetworkErrorPlugin as INetworkErrorPluginConfig),
    }
    if (config.skipFn(err)) return ctx.createPluginRes(PluginResType.NEXT, err)
    eventBus.emit('HTTP_PLUGIN:NETWORK_ERROR_PLUGIN:Handler', [err])
    if (config.showError) {
      if ([403, 429, 400].includes(err.response!.status)) {
        eventBus.emit('HTTP_PLUGIN:NETWORK_ERROR_PLUGIN:ShowError', [
          `${err.response.data.msg || '未知错误,请联系管理员'}`,
          'warning',
          config.duration!,
        ])
      } else {
        eventBus.emit('HTTP_PLUGIN:NETWORK_ERROR_PLUGIN:ShowError', [
          `${config.msg!}:${err.response.data.msg || '请联系管理员'}`,
          'error',
          config.duration!,
        ])
      }
    }
    return ctx.createPluginRes(PluginResType.END, err)
  },
}
