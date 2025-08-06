import type { Router } from 'vue-router'

function createAuthGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    if (to.name === 'Home') return next({ name: 'Login' })
    return next()
  })
  router.afterEach(() => {})
}
export { createAuthGuard }
