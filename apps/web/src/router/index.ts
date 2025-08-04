import type { RouterHistory } from 'vue-router'
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { getDynamicsRoutes, getStaticRoutes, initAutoRoutes } from './autoRouter'
import { createProgressGuard, createTitleGuard } from './guard'

const { VITE_ROUTER_HISTORY_MODE = 'history', VITE_BASE_URL } = import.meta.env
/** 路由类型 */
const historyCreatorMap: Record<Env.RouterHistoryMode, (base?: string) => RouterHistory> = {
  hash: createWebHashHistory,
  history: createWebHistory,
  memory: createMemoryHistory,
}
initAutoRoutes()
const routes = getStaticRoutes()
const a = getDynamicsRoutes()
console.warn(routes)
console.warn(a)
const router = createRouter({
  history: historyCreatorMap[VITE_ROUTER_HISTORY_MODE as Env.RouterHistoryMode](VITE_BASE_URL),
  routes,
})
createProgressGuard(router)
createTitleGuard(router)
export default router
export function goTo(name: string | 'back') {
  if (name === 'back') return router.back()
  return router.push({
    name,
  })
}
