import type { RouteMeta, Router } from 'vue-router'
import { t } from '@/i18n'

function setDocumentTitle(meta: RouteMeta) {
  window.document.title = t(meta.title as string) || import.meta.env.VITE_APP_TITLE
}
function createTitleGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    setDocumentTitle(to.meta)
    return next()
  })
  router.afterEach(() => {})
}
export { createTitleGuard, setDocumentTitle }
