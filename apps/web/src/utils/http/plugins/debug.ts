/** HTTP 插件调试配置 */
export const HTTP_PLUGIN_DEBUG = {
  /** 全局调试开关 */
  enabled: import.meta.env.DEV,
  /** 各插件调试开关 */
  plugins: {
    TOKEN_PLUGIN: true,
    LIMIT_PLUGIN: true,
    DUPLICATION_PLUGIN: true,
    NETWORK_ERROR_PLUGIN: true,
    NETWORK_STATUS_PLUGIN: true,
  },
}

/** 调试日志 */
export function pluginDebug(pluginName: string, hook: string, ...args: any[]) {
  if (!HTTP_PLUGIN_DEBUG.enabled) return
  if (!HTTP_PLUGIN_DEBUG.plugins[pluginName as keyof typeof HTTP_PLUGIN_DEBUG.plugins]) return

  const timestamp = new Date().toISOString().split('T')[1].slice(0, 12)
  console.warn(`[${timestamp}][${pluginName}][${hook}]`, ...args)
}
