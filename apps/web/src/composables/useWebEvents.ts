import type { MaybeRefOrGetter, Ref } from 'vue'
import { isReactive, isRef, onActivated, onDeactivated, onMounted, onUnmounted, toValue, watch } from 'vue'

/** 事件配置项 */
interface EventConfig {
  /** 原生DOM事件名 */
  name: string
  /**
   * 监听宿主DOM，可以是ref、选择器字符串或DOM元素
   * 当传入选择器字符串但未找到对应元素时，默认使用 window 作为监听目标
   */
  target: MaybeRefOrGetter<EventTarget | string | null | undefined>
  /** 事件处理函数 */
  handler: EventListener
  /** addEventListener的options参数 */
  options?: boolean | AddEventListenerOptions
  /** removeEventListener的options参数 */
  removeOptions?: boolean | EventListenerOptions
}

/** 事件配置数组 */
type EventsConfig = Array<EventConfig>

/** 单个事件的绑定结果 */
interface EventBindingResult {
  /** 事件名 */
  name: string
  /** 绑定的事件处理函数（用于removeEventListener） */
  handler: EventListener
  /** 清理函数 */
  cleanup: () => void
}

/**
 * 绑定事件的函数
 * @param {EventsConfig} events 事件配置数组
 * @returns {EventBindingResult[]} 事件绑定结果数组
 */
function bindEvents(events: EventsConfig): EventBindingResult[] {
  const results: EventBindingResult[] = []
  for (const config of events) {
    const { name, target, handler, options, removeOptions } = config
    const targetValue = toValue(target)
    let element: EventTarget | null = null
    if (typeof targetValue === 'string') {
      element = document.querySelector(targetValue)
    } else if (targetValue) {
      element = targetValue
    }
    if (!element) element = window
    element.addEventListener(name, handler, options)
    const capturedElement = element
    const cleanup = () => capturedElement.removeEventListener(name, handler, removeOptions ?? options)
    results.push({ name, handler, cleanup })
  }
  return results
}

/** useWebEvents返回值类型 */
interface UseWebEventsReturn {
  /** 手动清理所有事件监听 */
  cleanup: () => void
}

/**
 * 用于批量绑定多个原生DOM事件的composable
 * 在组件挂载时自动绑定事件，卸载时自动解绑
 * 支持响应式配置，当配置变化时会自动重新绑定事件
 * @param events 事件配置数组，可以是响应式数据(ref/reactive)或普通数组
 * @example
 * ```ts
 * const containerRef = ref<HTMLElement>()
 * // 基础使用
 * useWebEvents([
 *   {
 *     name: 'click',
 *     target: containerRef,
 *     handler: (e) => console.log('clicked', e)
 *   },
 *   {
 *     name: 'scroll',
 *     target: window,
 *     handler: (e) => console.log('scrolled', e)
 *   }
 * ])
 * // 响应式配置 - 配置变化时自动重新绑定
 * const eventsConfig = ref([
 *   {
 *     name: 'click',
 *     target: containerRef,
 *     handler: (e) => console.log('clicked', e)
 *   }
 * ])
 * useWebEvents(eventsConfig)
 * // 后续修改配置会自动重新绑定
 * eventsConfig.value.push({ name: 'scroll', target: window, handler: scrollHandler })
 * // 配合防抖/节流使用（需自行包装handler）
 * import { throttle } from 'lodash-es'
 * useWebEvents([
 *   {
 *     name: 'scroll',
 *     target: window,
 *     handler: throttle((e) => console.log('throttled scroll', e), 100)
 *   }
 * ])
 * ```
 */
export function useWebEvents<T extends EventsConfig | Ref<EventsConfig>>(events: T): UseWebEventsReturn {
  let bindings: EventBindingResult[] = []
  function getEventsConfig(): EventsConfig {
    return (isRef(events) ? events.value : events) as EventsConfig
  }
  /** 执行所有清理函数 */
  function cleanup(): void {
    for (const binding of bindings) {
      binding.cleanup()
    }
    bindings.length = 0
  }
  /** 绑定事件并更新bindings */
  function bindAndUpdate(): void {
    cleanup()
    bindings = bindEvents(getEventsConfig())
  }
  onMounted(bindAndUpdate)
  onUnmounted(cleanup)
  // 缓存场景处理
  onActivated(bindAndUpdate)
  onDeactivated(cleanup)

  // 监听响应式配置变化
  if (isRef(events) || isReactive(events)) watch(getEventsConfig, bindAndUpdate, { deep: true })

  return { cleanup }
}

export type { EventConfig, EventsConfig, UseWebEventsReturn }
