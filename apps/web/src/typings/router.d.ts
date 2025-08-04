import type { RouteRecordRaw } from 'vue-router'

export interface PageInfo {
  /** 路由配置 */
  router: Partial<RouteRecordRaw> & {
    meta: {
      /** 页面标题 */
      title: string
      /** 是否为动态路由 */
      isDynamics?: boolean
    }
  }
}
