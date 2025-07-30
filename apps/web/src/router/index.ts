import type { RouteRecordRaw, RouterHistory } from 'vue-router'
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { createProgressGuard } from '@/router/guard/progress'
import { getStaticRoutes, staticViewsEntries } from './staticRoutes'

const { VITE_ROUTER_HISTORY_MODE = 'history', VITE_BASE_URL } = import.meta.env
/** 路由类型 */
const historyCreatorMap: Record<Env.RouterHistoryMode, (base?: string) => RouterHistory> = {
  hash: createWebHashHistory,
  history: createWebHistory,
  memory: createMemoryHistory,
}
const routes: RouteRecordRaw[] = getStaticRoutes(staticViewsEntries)
const router = createRouter({
  history: historyCreatorMap[VITE_ROUTER_HISTORY_MODE as Env.RouterHistoryMode](VITE_BASE_URL),
  routes,
})
createProgressGuard(router)
export default router
export function goTo(name: string) {
  if (name === 'back') return router.back()
  return router.push({
    name,
  })
}
