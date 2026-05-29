import type { Router } from 'vue-router'
import nProgress from 'nprogress'
import { appStore, userStore } from '@/stores'
import { dynamicRouteRegistry } from '../registry'

/**
 * 检查登录状态
 * 如果有 access token 则已登录
 * 如果只有 refresh token 则尝试刷新
 */
async function checkLoginStatus(): Promise<boolean> {
  const user = userStore()
  if (user.access) return true

  if (user.refresh) {
    try {
      await user.refreshToken({ refreshToken: user.refresh })
      return !!user.access
    } catch {
      return false
    }
  }

  return false
}

function createPermGuard(r: Router) {
  r.beforeEach(async (to) => {
    nProgress?.start()
    try {
      const isLoggedIn = await checkLoginStatus()

      // 未登录
      if (!isLoggedIn) {
        if (to.meta.isWhite) return true
        return { name: 'Login', query: { redirect: to.fullPath } }
      }

      // 已登录访问登录页，重定向到首页
      if (to.path.includes('/login')) {
        return { name: 'Home' }
      }

      // 需要初始化路由
      if (!dynamicRouteRegistry.hasRoutes()) {
        await userStore().getMeInfo()
        return { ...to, replace: true }
      }

      // 路由未匹配
      if (to.matched.length === 0) {
        return { name: 'NotFound' }
      }

      // 更新页面标题
      if (to.meta.title) {
        appStore().setTitle(to.meta.title as string)
      }

      return true
    } catch (e) {
      console.error('Route guard error:', e)
      return { name: 'Login' }
    }
  })

  r.afterEach(() => {
    nProgress?.done()
  })
}
export { createPermGuard }
