import type { RouterHistory } from 'vue-router'
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { createAuthGuard, createProgressGuard, createTitleGuard } from './guard'
import { staticRoutes } from './staticRoutes'

const { VITE_ROUTER_HISTORY_MODE = 'history', VITE_BASE_URL } = import.meta.env
/** 路由类型 */
const historyCreatorMap: Record<Env.RouterHistoryMode, (base?: string) => RouterHistory> = {
  hash: createWebHashHistory,
  history: createWebHistory,
  memory: createMemoryHistory,
}
console.warn(staticRoutes)
const router = createRouter({
  history: historyCreatorMap[VITE_ROUTER_HISTORY_MODE as Env.RouterHistoryMode](VITE_BASE_URL),
  routes: staticRoutes,
})
createProgressGuard(router)
createAuthGuard(router)
createTitleGuard(router)

export default router
export function goTo(name: string | 'back') {
  if (name === 'back') return router.back()
  return router.push({
    name,
  })
}
