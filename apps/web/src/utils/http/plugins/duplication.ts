import type { ICustomAxiosError, ICustomInternalAxiosRequestConfig } from '../IHttpUtils'
import type { IHttpUtilsPlugin } from '../IPlugin'
import type { IEventBusEvents } from '@/eventBus/IEventBus'
import axios from 'axios'
import { eventBus } from '@/eventBus'
import { PluginResType } from '../IHttpUtils'
import { pluginDebug } from './debug'

/** 重复请求处理插件配置 */
export interface IDuplicationPluginConfig {
  /** 是否显示错误提示 */
  showError?: boolean
  /** 错误提示消息 */
  message?: string
  /** 错误提示显示时长 */
  duration?: number
  /** 是否允许重复请求（跳过检测） */
  allowDuplication?: boolean
}

/** 重复请求处理插件事件 */
export interface IDuplicationPluginEvents extends IEventBusEvents {
  'HTTP_PLUGIN:DUPLICATION_PLUGIN:Handler': [err: ICustomAxiosError]
  'HTTP_PLUGIN:DUPLICATION_PLUGIN:ShowError': [message: string, duration: number]
}

export const DUPLICATION_PLUGIN = 'DUPLICATION_PLUGIN'

/** 重复请求队列项 */
interface IDuplicationQueueItem {
  /** 取消函数 */
  cancel: (message?: string) => void
}

/** 重复请求队列 */
const duplicationQueue = new Map<string, IDuplicationQueueItem>()

/** 重复请求处理插件 */
export const DuplicationPlugin: IHttpUtilsPlugin = {
  name: DUPLICATION_PLUGIN,
  priority: {
    onReq: 2,
    onRes: 10,
    onResErr: 10,
    default: 0,
  },
  config: {
    showError: false,
    message: '请求已取消',
    duration: 1500,
    allowDuplication: false,
  },
  onReq: (config, ctx) => {
    pluginDebug(DUPLICATION_PLUGIN, 'onReq', config.url)
    const pluginConfig: IDuplicationPluginConfig = {
      ...ctx.getPlugin(DUPLICATION_PLUGIN)!.config,
      ...(config.customConfig?.DuplicationPlugin as IDuplicationPluginConfig),
    }
    if (pluginConfig.allowDuplication) return ctx.createPluginRes(PluginResType.NEXT, config)
    const requestId = ctx.generateRequestId(config)
    config.requestId = requestId
    const existingItem = duplicationQueue.get(requestId)
    if (existingItem) {
      pluginDebug(DUPLICATION_PLUGIN, 'onReq:cancel', '取消重复请求', requestId)
      existingItem.cancel(pluginConfig.message)
      duplicationQueue.delete(requestId)
    }
    const source = axios.CancelToken.source()
    config.cancelToken = source.token
    duplicationQueue.set(requestId, { cancel: source.cancel })
    return ctx.createPluginRes(PluginResType.NEXT, config)
  },
  onRes: (res, ctx) => {
    pluginDebug(DUPLICATION_PLUGIN, 'onRes', res.config?.url)
    const requestId = res.config?.requestId
    if (requestId) duplicationQueue.delete(requestId)
    return ctx.createPluginRes(PluginResType.NEXT, res)
  },
  onResErr: async (err, ctx) => {
    pluginDebug(DUPLICATION_PLUGIN, 'onResErr', err.config?.url)
    const config = err.config as ICustomInternalAxiosRequestConfig | undefined
    const requestId = config?.requestId

    if (axios.isCancel(err)) {
      const pluginConfig: IDuplicationPluginConfig = {
        ...ctx.getPlugin(DUPLICATION_PLUGIN)!.config,
        ...(config?.customConfig?.DuplicationPlugin as IDuplicationPluginConfig),
      }
      eventBus.emit('HTTP_PLUGIN:DUPLICATION_PLUGIN:Handler', [err])
      if (pluginConfig.showError) {
        eventBus.emit('HTTP_PLUGIN:DUPLICATION_PLUGIN:ShowError', [pluginConfig.message!, pluginConfig.duration!])
      }
      return ctx.createPluginRes(PluginResType.END, err)
    }

    if (requestId) duplicationQueue.delete(requestId)
    return ctx.createPluginRes(PluginResType.NEXT, err)
  },
}
