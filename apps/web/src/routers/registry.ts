import type { MenuRouteVO } from '@/apis'
import router from '.'
import { parseRoute } from './parseRoute'

/**
 * 动态路由注册表
 * 管理动态路由的添加和移除，避免与静态路由耦合
 */
export class DynamicRouteRegistry {
  private registeredNames = new Set<string>()

  /**
   * 添加动态路由
   * @param routes 路由配置数组
   */
  addRoutes(routes: MenuRouteVO[]) {
    routes.forEach((route) => {
      if (route.name && !this.registeredNames.has(route.name)) {
        const parsed = parseRoute(route)
        router.addRoute('Home', parsed)
        this.registeredNames.add(route.name)
      }
    })
  }

  /**
   * 清除所有动态路由
   * 在登出时调用，确保导航完成后再执行
   */
  clear() {
    this.registeredNames.forEach((name) => {
      if (router.hasRoute(name)) {
        router.removeRoute(name)
      }
    })
    this.registeredNames.clear()
  }

  /**
   * 检查是否有动态路由
   * 用于判断是否需要重新加载路由
   */
  hasRoutes(): boolean {
    return this.registeredNames.size > 0
  }
}

export const dynamicRouteRegistry = new DynamicRouteRegistry()
