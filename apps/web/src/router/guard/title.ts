import type { Router } from 'vue-router'
import { useApp } from '@/store/modules/app'

function createTitleGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    const app = useApp()
    app.setTitle(to.meta.title as string)
    return next()
  })
  router.afterEach(() => {})
}
export { createTitleGuard }
