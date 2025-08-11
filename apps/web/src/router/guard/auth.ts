import type { Router } from 'vue-router'

function createAuthGuard(router: Router) {
  router.beforeEach((_to, _from, next) => {
    // if (to.name === 'Home') return next({ name: 'Test' })
    return next()
  })
  router.afterEach(() => {})
}
export { createAuthGuard }
