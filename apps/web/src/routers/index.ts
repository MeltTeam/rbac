import type { App } from 'vue'
import type { RouteMeta, RouteRecordRaw, RouterHistory } from 'vue-router'
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { createPermGuard } from './guard'
import { STATIC_ROUTES, UNKNOWN_ROUTE } from './modules/staticRoutes'
import { parseRoute } from './parseRoute'
import { dynamicRouteRegistry } from './registry'

const { VITE_ROUTER_HISTORY_MODE = 'history', VITE_BASE_URL } = import.meta.env
/** 路由类型 */
const historyCreatorMap: Record<Env.RouterHistoryMode, (base?: string) => RouterHistory> = {
  hash: createWebHashHistory,
  history: createWebHistory,
  memory: createMemoryHistory,
}
const router = createRouter({
  history: historyCreatorMap[VITE_ROUTER_HISTORY_MODE as Env.RouterHistoryMode](VITE_BASE_URL),
  routes: [...STATIC_ROUTES],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
createPermGuard(router)

export { parseRoute }
export { dynamicRouteRegistry } from './registry'
export function setupRouter(app: App<Element>) {
  app.use(router)
}
/** 重置路由到初始状态 */
export function resetRouter() {
  dynamicRouteRegistry.clear()
}
export default router
