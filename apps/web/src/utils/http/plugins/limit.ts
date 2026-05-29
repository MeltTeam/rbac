import type { ICustomAxiosError, ICustomInternalAxiosRequestConfig } from '../IHttpUtils'
import type { IHttpUtilsPlugin, IHttpUtilsPluginCTX } from '../IPlugin'
import type { IEventBusEvents } from '@/eventBus/IEventBus'
import axios from 'axios'
import { MD5 } from 'crypto-js'
import { eventBus } from '@/eventBus'
import { PluginResType } from '../IHttpUtils'
import { pluginDebug } from './debug'

/** 限流类型 */
export type TLimitType = 'throttle' | 'debounce'

/** 限流处理插件配置 */
export interface ILimitPluginConfig {
  /** 是否启用限流 */
  enabled?: boolean
  /** 是否显示错误提示 */
  showError?: boolean
  /** 错误提示消息 */
  message?: string
  /** 错误提示显示时长 */
  duration?: number
  /** 限流时间（毫秒） */
  limitTime?: number
  /** 限流类型 */
  limitType?: TLimitType
  /** 是否持久化到本地存储（刷新页面后仍有效） */
  persist?: boolean
  /** 本地存储 key 前缀 */
  storageKeyPrefix?: string
}

/** 限流处理插件事件 */
export interface ILimitPluginEvents extends IEventBusEvents {
  'HTTP_PLUGIN:LIMIT_PLUGIN:Handler': [err: ICustomAxiosError]
  'HTTP_PLUGIN:LIMIT_PLUGIN:ShowError': [message: string, duration: number]
}

export const LIMIT_PLUGIN = 'LIMIT_PLUGIN'

/** 限流队列项 */
interface ILimitQueueItem {
  /** 最后请求时间戳 */
  lastTime: number
  /** 定时器 ID */
  timer: ReturnType<typeof setTimeout> | null
}

/** 限流存储数据结构 - 聚合多个接口的限流数据 */
interface ILimitStorageData {
  [requestId: string]: {
    /** 最后请求时间戳 */
    lastTime: number
  }
}

/** 内存限流队列 */
const memoryLimitQueue = new Map<string, ILimitQueueItem>()

/** 获取持久化存储数据 */
function getStorageData(prefix: string): ILimitStorageData {
  try {
    const data = localStorage.getItem(prefix)
    if (!data) return {}
    return JSON.parse(data) as ILimitStorageData
  } catch {
    return {}
  }
}

/** 保存持久化存储数据 */
function saveStorageData(prefix: string, data: ILimitStorageData): void {
  try {
    localStorage.setItem(prefix, JSON.stringify(data))
  } catch {
    // 存储失败时忽略
  }
}

/** 清理过期的存储数据 */
function cleanupExpiredStorage(prefix: string, limitTime: number): void {
  const now = Date.now()
  const data = getStorageData(prefix)
  let changed = false

  Object.keys(data).forEach((requestId) => {
    if (now - data[requestId].lastTime > limitTime) {
      delete data[requestId]
      changed = true
    }
  })

  if (changed) {
    saveStorageData(prefix, data)
  }
}

async function errFn<C = any>(err: ICustomAxiosError<C>, ctx: IHttpUtilsPluginCTX<C>) {
  pluginDebug(LIMIT_PLUGIN, 'errFn', err.code)
  if (!axios.isAxiosError(err) || err.code !== 'LIMIT') return ctx.createPluginRes(PluginResType.NEXT, err)
  const config = err.config as ICustomInternalAxiosRequestConfig | undefined
  const pluginConfig: ILimitPluginConfig = {
    ...ctx.getPlugin(LIMIT_PLUGIN)!.config,
    ...(config?.customConfig?.LimitPlugin as ILimitPluginConfig),
  }
  eventBus.emit('HTTP_PLUGIN:LIMIT_PLUGIN:Handler', [err as ICustomAxiosError])
  if (pluginConfig.showError) eventBus.emit('HTTP_PLUGIN:LIMIT_PLUGIN:ShowError', [pluginConfig.message!, pluginConfig.duration!])
  return ctx.createPluginRes(PluginResType.END, err)
}

/** 限流处理插件 */
export const LimitPlugin: IHttpUtilsPlugin = {
  name: LIMIT_PLUGIN,
  priority: {
    onReq: 0,
    onReqErr: 5,
    onResErr: 5,
    default: 0,
  },
  config: {
    enabled: false,
    showError: true,
    message: '请求过于频繁，请稍后再试',
    duration: 1500,
    limitTime: 1000,
    limitType: 'throttle',
    persist: false,
    storageKeyPrefix: 'HTTP_LIMIT',
  },
  onReq: (config, ctx) => {
    pluginDebug(LIMIT_PLUGIN, 'onReq', config.url)
    const pluginConfig: ILimitPluginConfig = {
      ...ctx.getPlugin(LIMIT_PLUGIN)!.config,
      ...(config.customConfig?.LimitPlugin as ILimitPluginConfig),
    }

    if (!pluginConfig.enabled || typeof pluginConfig.limitTime !== 'number') {
      return ctx.createPluginRes(PluginResType.NEXT, config)
    }

    const rawRequestId = ctx.generateRequestId(config)
    const requestId = MD5(rawRequestId).toString().slice(0, 8)
    const now = Date.now()
    const { limitTime, limitType, persist, storageKeyPrefix } = pluginConfig

    if (persist) {
      cleanupExpiredStorage(storageKeyPrefix!, limitTime!)

      const data = getStorageData(storageKeyPrefix!)
      const storedItem = data[requestId]

      if (limitType === 'debounce') {
        const memoryItem = memoryLimitQueue.get(requestId)
        if (memoryItem?.timer) {
          clearTimeout(memoryItem.timer)
        }

        const timer = setTimeout(() => {
          const currentData = getStorageData(storageKeyPrefix!)
          delete currentData[requestId]
          saveStorageData(storageKeyPrefix!, currentData)
          memoryLimitQueue.delete(requestId)
        }, limitTime)

        memoryLimitQueue.set(requestId, { lastTime: now, timer })
        data[requestId] = { lastTime: now }
        saveStorageData(storageKeyPrefix!, data)
      } else {
        if (storedItem && now - storedItem.lastTime < limitTime!) {
          pluginDebug(LIMIT_PLUGIN, 'onReq:throttle', '触发限流', requestId)
          const error = new axios.AxiosError(pluginConfig.message!, 'LIMIT', config)
          throw error
        }
        data[requestId] = { lastTime: now }
        saveStorageData(storageKeyPrefix!, data)
      }
    } else {
      let limitItem = memoryLimitQueue.get(requestId)

      if (limitType === 'debounce') {
        if (limitItem?.timer) {
          clearTimeout(limitItem.timer)
        }

        const timer = setTimeout(() => {
          memoryLimitQueue.delete(requestId)
        }, limitTime)

        limitItem = { lastTime: now, timer }
        memoryLimitQueue.set(requestId, limitItem)
      } else {
        if (limitItem && now - limitItem.lastTime < limitTime!) {
          pluginDebug(LIMIT_PLUGIN, 'onReq:throttle', '触发限流', requestId)
          const error = new axios.AxiosError(pluginConfig.message!, 'LIMIT', config)
          throw error
        }
        memoryLimitQueue.set(requestId, { lastTime: now, timer: null })
      }
    }

    return ctx.createPluginRes(PluginResType.NEXT, config)
  },
  onReqErr: errFn,
  onResErr: errFn,
}
