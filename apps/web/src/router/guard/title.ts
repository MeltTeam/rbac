import type { Router } from 'vue-router'

export default function createProgressGuard(router: Router) {
  router.afterEach((to, _from, _next) => {
    const { docTitle } = to.meta
    window.document.title = (docTitle as string) || '.'
  })
}
