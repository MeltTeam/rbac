import type { ICustomAxiosError, ICustomInternalAxiosRequestConfig } from '../IHttpUtils'
import type { IHttpUtilsPlugin, IHttpUtilsPluginCTX } from '../IPlugin'
import type { IEventBusEvents } from '@/eventBus/IEventBus'
import axios from 'axios'
import { eventBus } from '@/eventBus'
import { PluginResType } from '../IHttpUtils'
import { pluginDebug } from './debug'

/** 网络状态检测插件配置 */
export interface INetworkStatusPluginConfig {
  /** 是否启用网络状态检测 */
  enabled?: boolean
  /** 是否显示错误提示 */
  showError?: boolean
  /** 离线错误提示消息 */
  message?: string
  /** 错误提示显示时长 */
  duration?: number
  /** 检测端点列表 */
  checkUrls?: string[]
  /** 检测超时时间 */
  checkTimeout?: number
  /** 缓存有效期 */
  cacheTime?: number
}

/** 网络状态检测插件事件 */
export interface INetworkStatusPluginEvents extends IEventBusEvents {
  'HTTP_PLUGIN:NETWORK_STATUS_PLUGIN:Handler': [err: ICustomAxiosError]
  'HTTP_PLUGIN:NETWORK_STATUS_PLUGIN:ShowError': [message: string, duration: number]
  'HTTP_PLUGIN:NETWORK_STATUS_PLUGIN:Offline': []
  'HTTP_PLUGIN:NETWORK_STATUS_PLUGIN:Online': []
}

export const NETWORK_STATUS_PLUGIN = 'NETWORK_STATUS_PLUGIN'

/** 默认检测端点 */
const DEFAULT_CHECK_URLS = ['https://www.baidu.com/favicon.ico', 'https://cn.vuejs.org/logo.svg', 'https://www.taobao.com/favicon.ico']

/** 网络状态缓存 */
interface INetworkCache {
  isOnline: boolean | null
  lastCheckTime: number
  pendingCheck: Promise<boolean> | null
}

/** 网络状态缓存实例 */
const networkCache: INetworkCache = {
  isOnline: null,
  lastCheckTime: 0,
  pendingCheck: null,
}

/** 使用 Image 检测网络连通性 */
function checkByImage(url: string, timeout: number): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    const timer = setTimeout(() => {
      img.src = ''
      resolve(false)
    }, timeout)
    img.onload = () => {
      clearTimeout(timer)
      resolve(true)
    }
    img.onerror = () => {
      clearTimeout(timer)
      resolve(false)
    }
    img.src = url
  })
}

/** 检测网络连通性 */
async function checkNetworkConnectivity(checkUrls: string[], checkTimeout: number, cacheTime: number): Promise<boolean> {
  const now = Date.now()
  if (networkCache.pendingCheck) return networkCache.pendingCheck
  if (networkCache.isOnline !== null && now - networkCache.lastCheckTime < cacheTime) return networkCache.isOnline
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    networkCache.isOnline = false
    networkCache.lastCheckTime = now
    return false
  }
  networkCache.pendingCheck = (async () => {
    const checkPromises = checkUrls.map((url) => checkByImage(url, checkTimeout))
    try {
      const results = await Promise.race([
        Promise.all(checkPromises),
        new Promise<boolean[]>((_, reject) => setTimeout(() => reject(new Error('timeout')), checkTimeout + 500)),
      ])
      const isOnline = results.includes(true)
      networkCache.isOnline = isOnline
      networkCache.lastCheckTime = now
      return isOnline
    } catch {
      networkCache.isOnline = false
      networkCache.lastCheckTime = now
      return false
    } finally {
      networkCache.pendingCheck = null
    }
  })()

  return networkCache.pendingCheck
}

/** 清除缓存 */
function clearCache(): void {
  networkCache.isOnline = null
  networkCache.lastCheckTime = 0
}

async function errFn<C = any>(err: ICustomAxiosError<C>, ctx: IHttpUtilsPluginCTX<C>) {
  pluginDebug(NETWORK_STATUS_PLUGIN, 'errFn', err.code)
  if (!axios.isAxiosError(err) || err.code !== 'OFFLINE') return ctx.createPluginRes(PluginResType.NEXT, err)
  const config = err.config as ICustomInternalAxiosRequestConfig | undefined
  const pluginConfig: INetworkStatusPluginConfig = {
    ...ctx.getPlugin(NETWORK_STATUS_PLUGIN)!.config,
    ...(config?.customConfig?.LimitPlugin as INetworkStatusPluginConfig),
  }
  console.warn(pluginConfig.showError)
  eventBus.emit('HTTP_PLUGIN:NETWORK_STATUS_PLUGIN:Handler', [err as ICustomAxiosError])
  if (pluginConfig.showError) eventBus.emit('HTTP_PLUGIN:NETWORK_STATUS_PLUGIN:ShowError', [pluginConfig.message!, pluginConfig.duration!])
  return ctx.createPluginRes(PluginResType.END, err)
}

/** 网络状态检测插件 */
export const NetworkStatusPlugin: IHttpUtilsPlugin = {
  name: NETWORK_STATUS_PLUGIN,
  priority: {
    onReq: 1,
    onReqErr: 5,
    onResErr: 5,
    default: 0,
  },
  config: {
    enabled: false,
    showError: true,
    message: '网络连接已断开，请检查网络设置',
    duration: 3000,
    checkUrls: DEFAULT_CHECK_URLS,
    checkTimeout: 3000,
    cacheTime: 10000,
  },
  onReq: async (config, ctx) => {
    pluginDebug(NETWORK_STATUS_PLUGIN, 'onReq', config.url)
    const pluginConfig: INetworkStatusPluginConfig = {
      ...ctx.getPlugin(NETWORK_STATUS_PLUGIN)!.config,
      ...(config.customConfig?.NetworkStatusPlugin as INetworkStatusPluginConfig),
    }
    if (!pluginConfig.enabled) return ctx.createPluginRes(PluginResType.NEXT, config)
    const now = Date.now()
    const cacheExpired = networkCache.isOnline === null || now - networkCache.lastCheckTime >= pluginConfig.cacheTime!
    const wasOffline = networkCache.isOnline === false
    if (cacheExpired) {
      const isOnline = await checkNetworkConnectivity(pluginConfig.checkUrls!, pluginConfig.checkTimeout!, pluginConfig.cacheTime!)
      if (!isOnline) {
        pluginDebug(NETWORK_STATUS_PLUGIN, 'onReq', '真实检测显示离线')
        if (!wasOffline) eventBus.emit('HTTP_PLUGIN:NETWORK_STATUS_PLUGIN:Offline', [])
        const error = new axios.AxiosError(pluginConfig.message!, 'OFFLINE', config)
        throw error
      }
      if (wasOffline) {
        pluginDebug(NETWORK_STATUS_PLUGIN, 'onReq', '网络已恢复')
        eventBus.emit('HTTP_PLUGIN:NETWORK_STATUS_PLUGIN:Online', [])
      }
    } else if (networkCache.isOnline === false) {
      pluginDebug(NETWORK_STATUS_PLUGIN, 'onReq', '缓存显示离线')
      const error = new axios.AxiosError(pluginConfig.message!, 'OFFLINE', config)
      throw error
    }

    return ctx.createPluginRes(PluginResType.NEXT, config)
  },
  onReqErr: errFn,
  onResErr: errFn,
}

/** 初始化网络状态监听 */
function initNetworkStatusListener() {
  window.addEventListener('online', () => {
    pluginDebug(NETWORK_STATUS_PLUGIN, 'online', '网络已恢复')
    clearCache()
  })

  window.addEventListener('offline', () => {
    pluginDebug(NETWORK_STATUS_PLUGIN, 'offline', '网络已断开')
    networkCache.isOnline = false
    networkCache.lastCheckTime = Date.now()
  })
}

initNetworkStatusListener()

/** 手动检测网络状态 */
export async function checkNetworkStatus(
  config?: Partial<Pick<INetworkStatusPluginConfig, 'checkUrls' | 'checkTimeout' | 'cacheTime'>>,
): Promise<boolean> {
  return checkNetworkConnectivity(config?.checkUrls ?? DEFAULT_CHECK_URLS, config?.checkTimeout ?? 3000, config?.cacheTime ?? 10000)
}

/** 获取当前网络状态（同步，返回缓存值） */
export function getNetworkStatus(): boolean | null {
  return networkCache.isOnline
}
