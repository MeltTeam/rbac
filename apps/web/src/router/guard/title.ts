import type { Router } from 'vue-router'

function createTitleGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    const { title } = to.meta
    window.document.title = (title as string) || import.meta.env.VITE_APP_TITLE
    return next()
  })
  router.afterEach(() => {})
}
export { createTitleGuard }
