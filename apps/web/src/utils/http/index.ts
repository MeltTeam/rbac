import type {
  IDuplicationPluginConfig,
  ILimitPluginConfig,
  INetworkErrorPluginConfig,
  INetworkStatusPluginConfig,
  ITokenPluginConfig,
} from './plugins'
import { eventBus } from '@/eventBus'
import { HttpUtils } from './HttpUtils'
import { DuplicationPlugin, LimitPlugin, NetworkErrorPlugin, NetworkStatusPlugin, TokenPlugin } from './plugins'

export interface CustomConfig {
  /** 重复请求处理插件配置 */
  DuplicationPlugin?: IDuplicationPluginConfig
  /** 限流处理插件配置 */
  LimitPlugin?: ILimitPluginConfig
  /** 网络错误处理插件配置 */
  NetworkErrorPlugin?: INetworkErrorPluginConfig
  /** 网络状态检测插件配置 */
  NetworkStatusPlugin?: INetworkStatusPluginConfig
  /** 令牌处理插件配置 */
  TokenPlugin?: ITokenPluginConfig
}
export const http = new HttpUtils<CustomConfig>({
  customConfig: {
    NetworkStatusPlugin: {
      enabled: true,
    },
  },
})
http.plugins = [LimitPlugin, NetworkStatusPlugin, DuplicationPlugin, NetworkErrorPlugin, TokenPlugin]

eventBus.on('HTTP_PLUGIN:DUPLICATION_PLUGIN:ShowError', (message: string, duration: number) => ElMessage({ message, type: 'warning', duration }))
eventBus.on('HTTP_PLUGIN:LIMIT_PLUGIN:ShowError', (message: string, duration: number) => ElMessage({ message, type: 'warning', duration }))
eventBus.on('HTTP_PLUGIN:NETWORK_ERROR_PLUGIN:ShowError', (message: string, type: 'error' | 'warning', duration: number) => {
  ElMessage[type]({ message, duration })
})
eventBus.on('HTTP_PLUGIN:NETWORK_STATUS_PLUGIN:ShowError', (message: string, duration: number) => ElMessage({ message, type: 'error', duration }))
eventBus.on('HTTP_PLUGIN:TOKEN_PLUGIN:ShowError', (message: string, duration: number) => ElMessage({ message, type: 'error', duration }))
