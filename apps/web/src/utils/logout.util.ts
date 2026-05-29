import { dynamicRouteRegistry } from '@/routers/registry'
import { permStore, tagsViewStore, userStore } from '@/stores'
import { resetTokenPluginState } from '@/utils/http/plugins/token'
import router from '@/routers'
import { loginOut as logoutAPI } from '@/apis'

/**
 * 统一登出函数
 * 处理 API 调用、状态清理、导航和路由重置
 * @param options.skipAPI - 是否跳过 API 调用（用于 Token 过期等场景）
 */
export async function unifiedLogout(options?: { skipAPI?: boolean }) {
  try {
    // 1. 调用登出 API（如果需要）
    if (!options?.skipAPI) {
      const user = userStore()
      if (user.refresh) {
        await logoutAPI({ body: { refreshToken: user.refresh } }).catch(() => {})
      }
    }
  } finally {
    // 2. 清理所有状态
    permStore().$reset()
    tagsViewStore().clearCache()
    userStore().reset()
    resetTokenPluginState()

    // 3. 先导航到登录页
    await router.push({ name: 'Login' })

    // 4. 导航完成后再清理动态路由
    // 这确保我们不会在组件卸载时销毁路由
    dynamicRouteRegistry.clear()
  }
}
