import type {
  IDuplicationPluginEvents,
  ILimitPluginEvents,
  INetworkErrorPluginEvents,
  INetworkStatusPluginEvents,
  ITokenPluginEvents,
} from '@/utils/http/plugins'
import { EventBus } from './EventBus'

/** http 插件事件 */
type IHttpPluginEvents = INetworkErrorPluginEvents & ITokenPluginEvents & IDuplicationPluginEvents & ILimitPluginEvents & INetworkStatusPluginEvents

/** 事件总线事件 */
type IEventBusEvents = IHttpPluginEvents

/** 事件总线 */
export const eventBus = EventBus.create<IEventBusEvents>({ maxListeners: 50 })
