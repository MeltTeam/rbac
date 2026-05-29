import type { ICustomAxiosError } from '../IHttpUtils'
import type { IHttpUtilsPlugin } from '../IPlugin'
import type { IEventBusEvents } from '@/eventBus/IEventBus'
import { eventBus } from '@/eventBus'
import { userStore } from '@/stores'
import { PluginResType } from '../IHttpUtils'
import { pluginDebug } from './debug'
import { unifiedLogout } from '@/utils/logout.util'

/** 令牌处理插件配置 */
export interface ITokenPluginConfig {
  /** 是否显示错误 */
  showError?: boolean
  /** 错误提示 */
  msg?: string
  /** 错误提示显示时长 */
  duration?: number
  /** 刷新令牌接口Url */
  refreshUrl?: string
  /** 登出接口Url */
  logoutUrl?: string
}

/** 令牌处理插件事件 */
export interface ITokenPluginEvents extends IEventBusEvents {
  'HTTP_PLUGIN:TOKEN_PLUGIN:Handler': [err: ICustomAxiosError]
  'HTTP_PLUGIN:TOKEN_PLUGIN:ShowError': [message: string, duration: number]
}

export const TOKEN_PLUGIN = 'TOKEN_PLUGIN'

/** 队列项 */
interface IRefreshQueueItem {
  resolve: (value: any) => void
  reject: (reason: any) => void
  config: any
}

/** 是否正在刷新中 */
let refreshLock = false
/** 刷新等待队列 */
const refreshQueue: IRefreshQueueItem[] = []
/** 是否已经退出登录，防止死循环 */
let hasLoggedOut = false

/** 重置登录状态 */
export function resetTokenPluginState() {
  hasLoggedOut = false
  refreshLock = false
  refreshQueue.length = 0
}

/** 令牌处理插件 */
export const TokenPlugin: IHttpUtilsPlugin = {
  name: TOKEN_PLUGIN,
  priority: {
    onReq: 3,
    onReqErr: 6,
    onResErr: 6,
  },
  config: { showError: true, msg: '令牌已失效', duration: 1500, refreshUrl: '/v1/auth/refresh', logoutUrl: '/v1/auth/logout' },
  onReq(config, ctx) {
    pluginDebug(TOKEN_PLUGIN, 'onReq', config.url)
    const user = userStore()
    const accessToken = user.access
    accessToken && (config.headers!.Authorization = `Bearer ${accessToken}`)
    return ctx.createPluginRes(PluginResType.NEXT, config)
  },
  onResErr: async (err, ctx) => {
    pluginDebug(TOKEN_PLUGIN, 'onResErr', err.config?.url, err.response?.status)
    const user = userStore()
    const config: ITokenPluginConfig = {
      ...ctx.getPlugin(TOKEN_PLUGIN)!.config,
      ...(err.config?.customConfig.TokenPlugin as ITokenPluginConfig),
    }

    if (err.response?.status !== 401) return ctx.createPluginRes(PluginResType.NEXT, err)
    if (err.config?.url?.includes(config.logoutUrl!)) return ctx.createPluginRes(PluginResType.END, err)

    const originalConfig = err.config

    if (!user.refresh || err.config?.url?.includes(config.refreshUrl!)) {
      pluginDebug(TOKEN_PLUGIN, 'onResErr:logout', '刷新令牌不存在或刷新接口返回401，退出登录')
      return await handleLogout(err, config, ctx)
    }

    if (hasLoggedOut) {
      pluginDebug(TOKEN_PLUGIN, 'onResErr:hasLoggedOut', '已经退出登录，拒绝请求')
      return ctx.createPluginRes(PluginResType.END, err)
    }

    if (refreshLock) {
      pluginDebug(TOKEN_PLUGIN, 'onResErr:queue', '加入等待队列', refreshQueue.length)
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (value: any) => resolve(ctx.createPluginRes(PluginResType.END, value)),
          reject,
          config: originalConfig,
        })
      })
    }

    refreshLock = true
    pluginDebug(TOKEN_PLUGIN, 'onResErr:refresh', '开始刷新 token')

    try {
      await user.refreshToken({ refreshToken: user.refresh! })
      pluginDebug(TOKEN_PLUGIN, 'onResErr:refresh:success', '刷新成功，重试队列', refreshQueue.length)

      const pendingQueue = [...refreshQueue]
      refreshQueue.length = 0

      pendingQueue.forEach((item) => {
        ctx.request(item.config.url!, item.config).then(item.resolve).catch(item.reject)
      })

      const result = await ctx.request(originalConfig!.url!, originalConfig!)
      return ctx.createPluginRes(PluginResType.END, result)
    } catch (refreshErr) {
      pluginDebug(TOKEN_PLUGIN, 'onResErr:refresh:error', '刷新失败', refreshErr)

      const pendingQueue = [...refreshQueue]
      refreshQueue.length = 0

      pendingQueue.forEach((item) => {
        item.reject(refreshErr)
      })

      return await handleLogout(refreshErr as ICustomAxiosError, config, ctx)
    } finally {
      refreshLock = false
    }
  },
}

/** 处理退出登录 */
async function handleLogout(err: ICustomAxiosError, config: ITokenPluginConfig, ctx: any) {
  if (hasLoggedOut) {
    pluginDebug(TOKEN_PLUGIN, 'handleLogout:hasLoggedOut', '已经退出登录，直接返回')
    return ctx.createPluginRes(PluginResType.END, err)
  }

  hasLoggedOut = true
  pluginDebug(TOKEN_PLUGIN, 'handleLogout', '触发退出登录')

  eventBus.emit('HTTP_PLUGIN:TOKEN_PLUGIN:Handler', [err])
  eventBus.emit('HTTP_PLUGIN:TOKEN_PLUGIN:ShowError', [config.msg!, config.duration!])

  // 使用统一登出函数，跳过 API 调用（因为 token 已失效）
  await unifiedLogout({ skipAPI: true })

  return ctx.createPluginRes(PluginResType.END, err)
}
